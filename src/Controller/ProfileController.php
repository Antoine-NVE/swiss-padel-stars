<?php

namespace App\Controller;

use App\Response\StandardJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/profile', name: 'api_profile_')]
class ProfileController extends AbstractController
{
    #[Route('/me', name: 'me', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return StandardJsonResponse::success('Utilisateur récupéré', [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ], 200);
    }
}
