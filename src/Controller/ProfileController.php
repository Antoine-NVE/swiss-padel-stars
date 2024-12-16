<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProfileController extends AbstractController
{
    #[Route('/api/profile', name: 'api_profile')]
    public function index(): JsonResponse
    {
        return new JsonResponse(['Profile page' => 'Hello World'], 200);
    }
}
