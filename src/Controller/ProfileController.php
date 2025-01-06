<?php

namespace App\Controller;

use App\Response\StandardJsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ProfileController extends AbstractController
{
    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return StandardJsonResponse::success('Profile page', null, 200);
    }
}
