<?php

namespace App\Security;

use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{

    public function __construct(private AccessTokenCookieManager $accessTokenCookieManager, private JWTTokenManagerInterface $jwtTokenManager) {}

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        // Récupérer l'utilisateur depuis le token
        $user = $token->getUser();

        // Générer le token JWT via Lexik
        $jwt = $this->jwtTokenManager->create($user);

        // Utiliser StandardJsonResponse pour formater les données
        $response = StandardJsonResponse::success('Connexion réussie', null, 200);

        // Ajouter un cookie sécurisé avec le token
        $response->headers->setCookie($this->accessTokenCookieManager->createCookie($jwt));

        return $response;
    }
}
