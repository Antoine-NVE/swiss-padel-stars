<?php

namespace App\Controller;

use App\Response\StandardJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
    public function update(): JsonResponse
    {
        return StandardJsonResponse::error('Non implémenté', [], 501);
    }

    #[Route('/delete', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(): JsonResponse
    {
        return StandardJsonResponse::error('Non implémenté', [], 501);
    }
}
