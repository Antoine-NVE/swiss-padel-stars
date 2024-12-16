<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ProfileController extends AbstractController
{
    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(): JsonResponse
    {
        return new JsonResponse(['Profile page' => 'Hello World'], 200);
    }
}
