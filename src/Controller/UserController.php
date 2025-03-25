<?php

namespace App\Controller;

use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
            'createdAt' => $user->getCreatedAt(),
            'updatedAt' => $user->getUpdatedAt()
        ], 200);
    }

    #[Route('/update', name: 'update', methods: ['PATCH'])]
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

    #[Route('/delete', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(): JsonResponse
    {
        return StandardJsonResponse::error('Non implémenté', [], 501);
    }
}
