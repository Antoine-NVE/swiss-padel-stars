<?php

namespace App\Controller;

use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\RefreshTokenCookieManager;
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
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager
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

        $refreshToken = new RefreshToken();
        $refreshToken->setToken(bin2hex(random_bytes(32)));
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+7 days'));
        $refreshToken->setUser($user);

        $entityManager->persist($refreshToken);
        $entityManager->flush();

        // Retourner le token dans un cookie sécurisé
        $response = StandardJsonResponse::success('Inscription réussie !', null, 201);
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($refreshTokenCookieManager->createCookie($refreshToken->getToken()));

        return $response;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        JWTTokenManagerInterface $jwtManager,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Récupérer les identifiants
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Vérifier si l'utilisateur existe
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            return StandardJsonResponse::error('Email ou mot de passe incorrect.', null, 401, [
                'message' => 'Email incorrect.'
            ]);
        }

        // Vérifier le mot de passe
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return StandardJsonResponse::error('Email ou mot de passe incorrect.', null, 401, [
                'message' => 'Mot de passe incorrect.'
            ]);
        }

        // Générer le JWT
        $accessToken = $jwtManager->create($user);

        $refreshToken = new RefreshToken();
        $refreshToken->setToken(bin2hex(random_bytes(32)));
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+7 days'));
        $refreshToken->setUser($user);

        $entityManager->persist($refreshToken);
        $entityManager->flush();

        // Retourner le token dans un cookie sécurisé
        $response = StandardJsonResponse::success('Connexion réussie', null, 200);
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($refreshTokenCookieManager->createCookie($refreshToken->getToken()));

        return $response;
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager,
        RefreshTokenRepository $refreshTokenRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): JsonResponse {
        // Récupérer le token de rafraîchissement dans le cookie
        $refreshToken = $refreshTokenRepository->findOneBy(['token' => $request->cookies->get('REFRESH_TOKEN')]);

        // Supprimer le token de rafraîchissement de la base de données
        if ($refreshToken) {
            $entityManager->remove($refreshToken);
            $entityManager->flush();
        }

        // Supprimer le cookie contenant le token
        $response = StandardJsonResponse::success('Déconnexion réussie', null, 200);
        $response->headers->setCookie($accessTokenCookieManager->deleteCookie());
        $response->headers->setCookie($refreshTokenCookieManager->deleteCookie());

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
