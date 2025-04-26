<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/newsletter', name: 'api_newsletter_')]
class NewsletterController extends AbstractController
{
    #[Route('/subscribe', name: 'subscribe', methods: ['POST'])]
    public function subscribe(
        EntityManagerInterface $entityManager,
        Request $request,
        UserRepository $userRepository,
        ValidatorInterface $validator
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($user) {
            $user->setNewsletterOptin(true);
            $entityManager->flush();
            return StandardJsonResponse::success('Vous êtes maintenant abonné à la newsletter.', [], 200);
        }

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        /** @var \App\Entity\User $user */
        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            $user = new User();
            $user->setEmail($email);
            $user->setAnonymous(true);
            $user->setNewsletterOptin(true);

            $errors = $validator->validate($user, null, ['Default', 'Newsletter']);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
            }

            $entityManager->persist($user);
        } else {
            if ($user->isAnonymous()) {
                $user->setNewsletterOptin(true);
            } else {
                return StandardJsonResponse::error('Une erreur est survenue', [
                    'email' => 'Vous devez vous connecter pour vous abonner à la newsletter.',
                ], 400);
            }
        }
        $entityManager->flush();

        return StandardJsonResponse::success('Vous êtes maintenant abonné à la newsletter.', [], 200);
    }

    #[Route('/unsubscribe', name: 'unsubscribe', methods: ['POST'])]
    public function unsubscribe(
        EntityManagerInterface $entityManager,
        Request $request,
        UserRepository $userRepository
    ): JsonResponse {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if ($user) {
            $user->setNewsletterOptin(false);
            $entityManager->flush();
            return StandardJsonResponse::success('Vous êtes maintenant désabonné de la newsletter.', [], 200);
        }

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        /** @var \App\Entity\User $user */
        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            return StandardJsonResponse::error('Aucun utilisateur trouvé avec cet email.', [], 400);
        }

        if (!$user->isAnonymous()) {
            return StandardJsonResponse::error('Veuillez vous connecter pour vous désabonner de la newsletter.', [], 400);
        }

        $user->setNewsletterOptin(false);
        $entityManager->flush();

        return StandardJsonResponse::success('Vous êtes maintenant désabonné de la newsletter.', [], 200);
    }

    #[Route('/subscribed-users', name: 'subscribed_users', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getSubscribedUsers(UserRepository $userRepository): JsonResponse
    {
        $subscribedUsers = $userRepository->findBy(['newsletterOptin' => true]);

        $userEmails = array_map(function (User $user) {
            return $user->getEmail();
        }, $subscribedUsers);

        return StandardJsonResponse::success('Liste des utilisateurs abonnés à la newsletter.', $userEmails, 200);
    }
}
