<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
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
            return new JsonResponse(['errors' => $errorMessages], 400);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Inscription réussie !'], 201);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        JWTTokenManagerInterface $jwtManager,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Récupérer les identifiants
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Vérifier si l'utilisateur existe
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['error' => 'Email ou mot de passe incorrect.'], 401);
        }

        // Vérifier le mot de passe
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Email ou mot de passe incorrect.'], 401);
        }

        // Générer le JWT
        $token = $jwtManager->create($user);

        // Retourner le token dans un cookie sécurisé
        $response = new JsonResponse(['message' => 'Connexion réussie']);
        $response->headers->setCookie(
            new Cookie(
                'TOKEN',         // Nom du cookie
                $token,          // Contenu du cookie (le JWT)
                time() + 3600,   // Expiration dans 1 heure
                '/',             // Accessible sur toutes les routes
                null,            // Domaine
                true,            // Secure : HTTPS uniquement
                true,            // HttpOnly : Inaccessible en JavaScript
                false,           // Raw
                'Strict'         // SameSite pour éviter les attaques CSRF
            )
        );

        return $response;
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function logout(): JsonResponse
    {
        // Supprimer le cookie contenant le token
        $response = new JsonResponse(['message' => 'Déconnexion réussie'], 200);
        $response->headers->setCookie(
            new Cookie(
                'TOKEN', // Nom du cookie
                '', // Contenu vide
                time() - 3600, // Date d'expiration dans le passé
                '/', // Chemin
                null, // Domaine
                true, // Secure : HTTPS uniquement
                true, // HttpOnly
                false, // Raw
                'Strict' // SameSite pour éviter les attaques CSRF
            )
        );

        return $response;
    }

    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function user(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return new JsonResponse([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }
}
