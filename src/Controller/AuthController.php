<?php

namespace App\Controller;

use App\Entity\User;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        JWTTokenManagerInterface $jwtManager,
        AccessTokenCookieManager $accessTokenCookieManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($password);

        // On vient vérifier les contraintes de validation (NotBlank, Length, UniqueEntity, etc.)
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        // Générer le JWT
        $accessToken = $jwtManager->create($user);

        // Retourner le token dans un cookie sécurisé
        $response = StandardJsonResponse::success('Inscription réussie !', null, 201);
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));

        return $response;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): void
    {
        // Cette méthode est gérée par LexikJWTAuthenticationBundle
        // Voir la configuration dans config/packages/lexik_jwt_authentication.yaml
        // et src/Security/CustomAuthenticationSuccessHandler.php
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(
        AccessTokenCookieManager $accessTokenCookieManager,
    ): JsonResponse {
        // Supprimer le cookie contenant le token
        $response = StandardJsonResponse::success('Déconnexion réussie', null, 200);
        $response->headers->setCookie($accessTokenCookieManager->deleteCookie());

        return $response;
    }

    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    public function user(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return StandardJsonResponse::success('Utilisateur récupéré', [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ], 200);
    }
}
