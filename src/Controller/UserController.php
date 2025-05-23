<?php

namespace App\Controller;

use App\Entity\UserAddress;
use App\Response\StandardJsonResponse;
use App\Service\AccessTokenCookieService;
use App\Service\RefreshTokenCookieService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/user', name: 'api_user_')]
class UserController extends AbstractController
{
    #[Route('/me', name: 'me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function me(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return StandardJsonResponse::success('Utilisateur récupéré', [
            'email' => $user->getEmail(),
            'lastName' => $user->getLastName(),
            'firstName' => $user->getFirstName(),
            'company' => $user->getCompany(),
            'newsletterOptin' => $user->isNewsletterOptin(),
            'isVerified' => $user->isVerified(),
            'isAnonymous' => $user->isAnonymous(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $user->getUpdatedAt()->format('Y-m-d H:i:s') ?? null,
        ], 200);
    }

    #[Route('/get-all', name: 'get_all', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAll(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager->getRepository(\App\Entity\User::class)->findAll();

        foreach ($users as $user) {
            $userList[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'company' => $user->getCompany(),
                'newsletterOptin' => $user->isNewsletterOptin(),
                'isVerified' => $user->isVerified(),
                'isAnonymous' => $user->isAnonymous(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updatedAt' => $user->getUpdatedAt()?->format('Y-m-d H:i:s') ?? null,
            ];
        }

        return StandardJsonResponse::success('Utilisateurs récupérés', $userList, 200);
    }

    #[Route('/update', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        if (isset($data['email']) && $data['email'] !== $user->getEmail()) {
            $user->setEmail($data['email']);
            $user->setVerified(false); // Réinitialiser la vérification si l'email change
        }

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }

        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }

        if (isset($data['company'])) {
            $user->setCompany(trim($data['company']) === '' ? null : $data['company']);
        }

        if (isset($data['newsletterOptin'])) {
            $user->setNewsletterOptin($data['newsletterOptin']); // Convertir en booléen
        }

        $errors = $validator->validate($user, null, ['Default', 'Registration']);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $user->setUpdatedAt(new \DateTimeImmutable());

        $entityManager->flush();

        return StandardJsonResponse::success('Utilisateur mis à jour', [
            'email' => $user->getEmail(),
            'lastName' => $user->getLastName(),
            'firstName' => $user->getFirstName(),
            'company' => $user->getCompany(),
            'newsletterOptin' => $user->isNewsletterOptin(),
            'isVerified' => $user->isVerified(),
            'isAnonymous' => $user->isAnonymous(),
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt(),
            'updatedAt' => $user->getUpdatedAt()
        ], 200);
    }

    #[Route('/update-password', name: 'update_password', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updatePassword(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $errorMessages = [];
        if (!$passwordHasher->isPasswordValid($user, $data['currentPassword'] ?? '')) {
            $errorMessages['currentPassword'] = 'Le mot de passe actuel est incorrect';
        }

        $user->setPassword($data['newPassword']);

        $errors = $validator->validate($user, null, ['Default', 'Registration']);
        if (count($errors) > 0) {
            $errorMessages['newPassword'] = $errors[0]->getMessage();
        }

        if (count($errorMessages) > 0) {
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $data['newPassword']));

        $entityManager->flush();

        return StandardJsonResponse::success('Mot de passe mis à jour', null, 200);
    }

    #[Route('/delete', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        Request $request,
        AccessTokenCookieService $accessTokenCookieService,
        RefreshTokenCookieService $refreshTokenCookieService,
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!$passwordHasher->isPasswordValid($user, $data['password'] ?? '')) {
            return StandardJsonResponse::error('Une erreur est survenue', ['password' => 'Mot de passe incorrect'], 400);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        $response = StandardJsonResponse::success('Utilisateur supprimé', null, 200);
        $response->headers->setCookie($accessTokenCookieService->deleteCookie());
        $response->headers->setCookie($refreshTokenCookieService->deleteCookie());

        return $response;
    }
}
