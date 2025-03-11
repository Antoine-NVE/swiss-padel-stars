<?php

namespace App\Controller;

use App\Entity\RefreshToken;
use App\Entity\User;
use App\Repository\RefreshTokenRepository;
use App\Repository\UserRepository;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieManager;
use App\Service\AccessTokenJwtService;
use App\Service\RefreshTokenCookieManager;
use Doctrine\ORM\EntityManagerInterface;
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
        // TODO: Vérifier que l'utilisateur n'est pas déjà connecté
        // TODO: Vérifier que l'utilisateur n'est pas déjà inscrit (en anonyme)

        $data = json_decode($request->getContent(), true);

        // Le setter de l'email n'accepte pas null, il est important de mettre un string vide par défaut
        $email = $data['email'] ?? '';

        // Pour les 3 suivants, on met un string vide même si ça marcherait avec null
        // Ces 3 valeurs sont obligatoires donc le validator bloquera que ce soit null ou un string vide
        $password = $data['password'] ?? '';
        $lastName = $data['lastName'] ?? '';
        $firstName = $data['firstName'] ?? '';

        // On met null car la valeur n'est pas obligatoire, c'est la valeur qui sera stockée en BDD
        $company = $data['company'] ?? null;

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($password);
        $user->setLastName($lastName);
        $user->setFirstName($firstName);
        $user->setCompany($company);

        // On vient vérifier les contraintes de validation (NotBlank, Length, UniqueEntity, etc.)
        $errors = $validator->validate($user, null, ['Default', 'Registration']);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $entityManager->persist($user);

        // On fait un premier flush pour pouvoir récupérer son ID pour le JWT
        $entityManager->flush();

        $accessTokenJwtService = new AccessTokenJwtService($this->getParameter('app.secret'));
        $accessToken = $accessTokenJwtService->encode($user->getId());

        $randomToken = bin2hex(random_bytes(32));

        $refreshToken = new RefreshToken();
        $refreshToken->setToken($randomToken);
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+1 month'));
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

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $errorsMessages = [];
        if (!$email) {
            $errorsMessages['email'] = 'L\'email est requis.';
        }
        if (!$password) {
            $errorsMessages['password'] = 'Le mot de passe est requis.';
        }
        if (count($errorsMessages) > 0) {
            return StandardJsonResponse::error('Une erreur est survenue.', $errorsMessages, 400);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return StandardJsonResponse::error('Identifiants invalides', null, 401);
        }

        $accessTokenJwtService = new AccessTokenJwtService($this->getParameter('app.secret'));
        $accessToken = $accessTokenJwtService->encode($user->getId());

        $randomToken = bin2hex(random_bytes(32));

        $refreshToken = new RefreshToken();
        $refreshToken->setToken($randomToken);
        $refreshToken->setExpiresAt(new \DateTimeImmutable('+1 month'));
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
            return StandardJsonResponse::error('Token invalide', null, 401, [
                'message' => 'Token de refresh non trouvé dans les cookies'
            ]);
        }

        /** @var \App\Entity\RefreshToken $refreshToken  */
        $refreshToken = $refreshTokenRepository->findOneBy(['token' => $refreshToken]);

        if (!$refreshToken || $refreshToken->getExpiresAt() < new \DateTimeImmutable()) {
            $response = StandardJsonResponse::error('Token invalide', null, 401, [
                'message' => 'Token de refresh non trouvé en BDD ou expiré'
            ]);
            $response->headers->setCookie($refreshTokenCookieManager->deleteCookie());

            return $response;
        }

        $accessTokenJwtService = new AccessTokenJwtService($this->getParameter('app.secret'));
        $accessToken = $accessTokenJwtService->encode($refreshToken->getUser()->getId());

        $refreshToken->setExpiresAt(new \DateTimeImmutable('+1 month'));
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
