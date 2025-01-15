<?php

namespace App\Security;

use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\RefreshTokenCookieManager;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Generator\RefreshTokenGeneratorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function __construct(
        private AccessTokenCookieManager $accessTokenCookieManager,
        private RefreshTokenCookieManager $refreshTokenCookieManager,
        private JWTTokenManagerInterface $jwtTokenManager,
        private RefreshTokenManagerInterface $refreshTokenManager,
        private RefreshTokenGeneratorInterface $refreshTokenGenerator
    ) {}

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        // Récupérer l'utilisateur depuis le token
        $user = $token->getUser();

        // Générer le token JWT via Lexik
        $accessToken = $this->jwtTokenManager->create($user);

        // Générer un refresh token
        $refreshToken = $this->refreshTokenGenerator->createForUserWithTtl($user, 3600 * 24 * 30);
        $this->refreshTokenManager->save($refreshToken);

        $response = StandardJsonResponse::success('Connexion réussie', null, 200);

        // Ajouter un cookie sécurisé avec le token
        $response->headers->setCookie($this->accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($this->refreshTokenCookieManager->createCookie($refreshToken->getRefreshToken()));

        return $response;
    }
}
