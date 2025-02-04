<?php

namespace App\Controller;

use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Repository\UserRepository;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\RefreshTokenCookieManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
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

        $accessToken = JWT::encode(
            [
                'user_id' => $user->getId(),
                'iat' => time(),
                'exp' => time() + 3600
            ],
            $_ENV['JWT_SECRET'],
            'HS256'
        );

        $randomToken = bin2hex(random_bytes(32));

        $refreshToken = new RefreshToken();
        $refreshToken->setToken($randomToken);
        $refreshToken->setExpiration(new \DateTimeImmutable('+1 month'));
        $refreshToken->setUser($user);
        $entityManager->persist($refreshToken);

        $entityManager->flush();

        $response = StandardJsonResponse::success('Inscription réussie !', null, 201);
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($refreshTokenCookieManager->createCookie($refreshToken->getToken()));

        return $response;
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        $errors = [];
        if (!$email) {
            $errors['email'] = 'L\'email est requis.';
        }
        if (!$password) {
            $errors['password'] = 'Le mot de passe est requis.';
        }
        if (count($errors) > 0) {
            return StandardJsonResponse::error('Une erreur est survenue.', $errors, 400);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }

        $accessToken = JWT::encode(
            [
                'user_id' => $user->getId(),
                'iat' => time(),
                'exp' => time() + 3600
            ],
            $_ENV['JWT_SECRET'],
            'HS256'
        );

        $randomToken = bin2hex(random_bytes(32));

        $refreshToken = new RefreshToken();
        $refreshToken->setToken($randomToken);
        $refreshToken->setExpiration(new \DateTimeImmutable('+1 month'));
        $refreshToken->setUser($user);

        $entityManager->persist($refreshToken);
        $entityManager->flush();

        $response = StandardJsonResponse::success('Connexion réussie');
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($refreshTokenCookieManager->createCookie($refreshToken->getToken()));

        return $response;
    }

    #[Route('/refresh', name: 'refresh', methods: ['POST'])]
    public function refresh(
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager,
        RefreshTokenRepository $refreshTokenRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): JsonResponse {
        $refreshToken = $request->cookies->get('refresh_token');

        if (!$refreshToken) {
            return StandardJsonResponse::error('Token invalide', null, 401);
        }

        $refreshToken = $refreshTokenRepository->findOneBy(['token' => $refreshToken]);

        if (!$refreshToken || $refreshToken->getExpiration() < new \DateTimeImmutable()) {
            return StandardJsonResponse::error('Token invalide', null, 401);
        }

        $accessToken = JWT::encode(
            [
                'user_id' => $refreshToken->getUser()->getId(),
                'iat' => time(),
                'exp' => time() + 3600
            ],
            $_ENV['JWT_SECRET'],
            'HS256'
        );

        $refreshToken->setExpiration(new \DateTimeImmutable('+1 month'));
        $entityManager->flush();

        $response = StandardJsonResponse::success('Token rafraîchi');
        $response->headers->setCookie($accessTokenCookieManager->createCookie($accessToken));
        $response->headers->setCookie($refreshTokenCookieManager->createCookie($refreshToken->getToken()));

        return $response;
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(
        AccessTokenCookieManager $accessTokenCookieManager,
        RefreshTokenCookieManager $refreshTokenCookieManager,
        Request $request,
        EntityManagerInterface $entityManager,
        RefreshTokenRepository $refreshTokenRepository
    ): JsonResponse {
        if ($request->cookies->has('refresh_token')) {
            $entityManager->remove($refreshTokenRepository->findOneBy(['token' => $request->cookies->get('refresh_token')]));
            $entityManager->flush();
        }

        // Supprimer le cookie contenant le token
        $response = StandardJsonResponse::success('Déconnexion réussie', null, 200);
        $response->headers->setCookie($accessTokenCookieManager->deleteCookie());
        $response->headers->setCookie($refreshTokenCookieManager->deleteCookie());

        return $response;
    }
}
