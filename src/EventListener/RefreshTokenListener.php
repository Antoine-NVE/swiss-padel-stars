<?php

namespace App\EventListener;

use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\RefreshTokenCookieManager;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class RefreshTokenListener
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private TokenStorageInterface $tokenStorage,
        private AccessTokenCookieManager $accessTokenCookieManager,
        private RefreshTokenCookieManager $refreshTokenCookieManager,
        private RefreshTokenManagerInterface $refreshTokenManager
    ) {}

    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        // Vérifiez si la requête est pour le rafraîchissement du token
        if ($request->attributes->get('_route') === 'gesdinet_jwt_refresh_token') {
            $token = $this->tokenStorage->getToken();

            if ($token && $token->getUser()) {
                /** @var \App\Entity\User $user */
                $user = $token->getUser();

                // Générez un nouveau token JWT
                $accessToken = $this->jwtManager->create($user);

                $refreshToken = $this->refreshTokenManager->getLastFromUsername($user->getEmail());

                // Ajoutez le cookie à la réponse
                $response = StandardJsonResponse::success('Token rafraîchi', null, 200);
                $response->headers->setCookie($this->accessTokenCookieManager->createCookie($accessToken));
                $response->headers->setCookie($this->refreshTokenCookieManager->createCookie($refreshToken->getRefreshToken()));

                $event->setResponse($response);
            }
        }
    }
}
