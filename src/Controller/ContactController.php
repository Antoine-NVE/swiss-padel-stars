<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\User;
use App\Repository\ContactTypeRepository;
use App\Repository\UserRepository;
use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/contact', name: 'api_contact_')]
class ContactController extends AbstractController
{
    // Crée un message de contact pour un utilisateur connecté ou anonyme
    // Utilise les infos de l'utilisateur connecté ou crée un utilisateur anonyme
    // Vérifie si un utilisateur anonyme existe déjà avec l'email fourni et met à jour ses infos
    // Crée un utilisateur anonyme si aucun utilisateur n'existe avec l'email fourni
    // Crée le message de contact et renvoie une erreur ou un succès
    #[Route('/make', name: 'make', methods: ['POST'])]
    public function make(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        ContactTypeRepository $contactTypeRepository,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $errorMessages = [];

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $contactTypeId = trim($data['contactTypeId'] ?? '') ?: 0;
        $contactType = $contactTypeRepository->find($contactTypeId);
        $message = trim($data['message'] ?? '') ?: '';

        // Si l'utilisateur n'est pas connecté, on va chercher à créer un utilisateur anonyme
        // On peut également mettre un jour un utilisateur anonyme existant si l'email est déjà utilisé
        if (!$user) {
            $email = trim($data['email'] ?? '') ?: '';
            $firstName = trim($data['firstName'] ?? '') ?: '';
            $lastName = trim($data['lastName'] ?? '') ?: '';
            $company = trim($data['company'] ?? '') ?: null;

            /** @var \App\Entity\User $user */
            // On vient regarder si un utilisateur existe déjà avec cet email
            $user = $userRepository->findOneBy(['email' => $email]);
            if ($user && !$user->isAnonymous()) {
                // Si l'utilisateur existe et n'est pas anonyme, on renvoie une erreur
                $errorMessages['email'] = 'Un utilisateur existe déjà avec cet email';
            }

            // Création de l'utilisateur si inexistant
            $isNewUser = false;
            if (!$user) {
                $user = new User();
                $user->setEmail($email);
                $user->setAnonymous(true);
                $isNewUser = true;
            }

            // Mise à jour des informations (ce ne sera pas forcément flush mais c'est pour renvoyer des erreurs)
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setCompany($company);

            // On met à jour la date uniquement si ce n'est pas un nouvel utilisateur
            if (!$isNewUser) {
                $user->setUpdatedAt(new \DateTimeImmutable());
            }

            $entityManager->persist($user);

            $errors = $validator->validate($user, null, ['Default', 'Contact']);
            if (count($errors) > 0) {
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
            }
        }

        $contact = new Contact();
        $contact->setUser($user);
        $contact->setContactType($contactType);
        $contact->setMessage($message);

        // On vérifie le message et le type de contact
        $errors = $validator->validate($contact, null);
        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
        }

        if (count($errorMessages) > 0) {
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $entityManager->persist($contact);
        $entityManager->flush();

        return StandardJsonResponse::success('Votre message a bien été envoyé', null, 200);
    }
}
