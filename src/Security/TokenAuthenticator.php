<?php

namespace App\Security;

use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use App\Repository\UserRepository;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\RefreshTokenCookieManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class TokenAuthenticator extends AbstractAuthenticator
{
    // Routes où il n'y a pas de différences si l'utilisateur est connecté ou non, on skip l'authentification
    private array $excludedRoutes = [];

    // Routes où l'on ne refresh pas le token
    private array $noRefreshRoutes = ['/api/logout'];

    // Routes où le comportement est inversé (il ne faut PAS être connecté)
    private array $inverseBehaviorRoutes = ['/api/login', '/api/register'];

    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private EntityManagerInterface $entityManager,
        private RefreshTokenRepository $refreshTokenRepository,
        private UserRepository $userRepository,
        private AccessTokenCookieManager $accessTokenCookieManager = new AccessTokenCookieManager(),
        private RefreshTokenCookieManager $refreshTokenCookieManager = new RefreshTokenCookieManager()
    ) {}

    public function supports(Request $request): ?bool
    {
        // On ne veut pas authentifier les routes exclues
        if ($this->isExcludedRoute($request, $this->excludedRoutes)) {
            return false;
        }

        return true;
    }

    public function authenticate(Request $request): Passport
    {
        $accessToken = $request->cookies->get('TOKEN');

        if ($accessToken) {
            try {
                $token = new AccessToken($accessToken);
                $data = $this->jwtManager->decode($token);

                // Vérifier si le token est expiré
                if (!isset($data['exp']) || $data['exp'] < time()) {
                    throw new AuthenticationException();
                }

                $user = $this->getUserFromTokenData($data);
                if (!$user) {
                    throw new AuthenticationException();
                }

                // Si l'access token est valide, on peut créer un SelfValidatingPassport
                return new SelfValidatingPassport(new UserBadge($user->getUserIdentifier()), []);
            } catch (\Exception $e) {
                // Si le token est invalide, on le supprime
                $request->attributes->set('new_access_token_cookie', $this->accessTokenCookieManager->deleteCookie());
            }
        }

        // Si l'access token est expiré, on tente de le renouveler avec le refresh token
        $refreshToken = $request->cookies->get('REFRESH_TOKEN');
        if (!$refreshToken) {
            throw new AuthenticationException('Refresh token manquant.');
        }

        /** @var \App\Entity\RefreshToken $refreshTokenEntity */
        $refreshTokenEntity = $this->refreshTokenRepository->findValidRefreshToken($refreshToken);
        if (!$refreshTokenEntity) {
            throw new AuthenticationException('Refresh token invalide.');
        }

        $user = $refreshTokenEntity->getUser();

        // On ne refresh pas les tokens pour certaines routes
        if (!$this->isExcludedRoute($request, $this->noRefreshRoutes)) {
            $newAccessToken = $this->jwtManager->create($user);
            $newRefreshToken = $this->rotateRefreshToken($refreshTokenEntity);

            $request->attributes->set('new_access_token', $newAccessToken);
            $request->attributes->set('new_refresh_token', $newRefreshToken);
        }

        return new SelfValidatingPassport(new UserBadge($user->getUserIdentifier()), []);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        $newAccessToken = $request->attributes->get('new_access_token');
        $newRefreshToken = $request->attributes->get('new_refresh_token');

        // On met à jour les cookies si nécessaire (le Listener ResponseEventListener s'en chargera)
        if ($newAccessToken) {
            $request->attributes->set('new_access_token_cookie', $this->accessTokenCookieManager->createCookie($newAccessToken));
        }
        if ($newRefreshToken) {
            $request->attributes->set('new_refresh_token_cookie', $this->refreshTokenCookieManager->createCookie($newRefreshToken));
        }

        // On bloque l'accès aux routes inversées
        if ($this->isExcludedRoute($request, $this->inverseBehaviorRoutes)) {
            return StandardJsonResponse::error('Vous êtes déjà connecté.', null, 403);
        }

        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?JsonResponse
    {
        // On autorise l'accès aux routes inversées
        if ($this->isExcludedRoute($request, $this->inverseBehaviorRoutes)) {
            return null;
        }

        return StandardJsonResponse::error('Vous n\'êtes pas connecté.', null, 401, [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ]);
    }

    private function isExcludedRoute(Request $request, array $routes): bool
    {
        $regex = '#^(' . implode('|', $routes) . ')$#';
        return preg_match($regex, $request->getPathInfo());
    }

    private function getUserFromTokenData(array $data): ?UserInterface
    {
        return $this->userRepository->findOneBy(['email' => $data['username'] ?? null]);
    }

    private function rotateRefreshToken(RefreshToken $refreshToken): string
    {
        // Générer un nouveau token
        $newToken = bin2hex(random_bytes(64));
        $refreshToken->setToken($newToken);

        // Mettre à jour la date d'expiration
        $refreshToken->setExpiresAt((new \DateTimeImmutable())->modify('+7 days'));

        // Sauvegarder les modifications
        $this->entityManager->flush();

        return $newToken;
    }
}
