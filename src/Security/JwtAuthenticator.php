<?php

namespace App\Security;

use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieService;
use App\Service\AccessTokenJwtService;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

class JwtAuthenticator extends AbstractAuthenticator implements AuthenticationEntryPointInterface
{
    public function __construct(
        private string $appSecret,
        private AccessTokenCookieService $accessTokenCookieService
    ) {}

    public function supports(Request $request): ?bool
    {
        return $request->cookies->has('access_token');
    }

    public function authenticate(Request $request): Passport
    {
        $accessToken = $request->cookies->get('access_token');

        try {
            $accessTokenJwtService = new AccessTokenJwtService($this->appSecret);
            $data = $accessTokenJwtService->decode($accessToken);
            if (empty($data['user_id'])) {
                throw new CustomUserMessageAuthenticationException('Données de token invalides.');
            }

            return new SelfValidatingPassport(new UserBadge($data['user_id']));
        } catch (Exception $e) {
            throw new CustomUserMessageAuthenticationException('Token invalide : ' . $e->getMessage());
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $response = StandardJsonResponse::error('Échec de l\'authentification', null, 401, [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ]);

        $response->headers->setCookie($this->accessTokenCookieService->deleteCookie());

        return $response;
    }

    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        return StandardJsonResponse::error('Authentification requise pour accéder à cette ressource.', null, 401);
    }
}
