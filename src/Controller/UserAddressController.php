<?php

namespace App\Controller;

use App\Entity\UserAddress;
use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/user-address', name: 'api_userAddress_')]
class UserAddressController extends AbstractController
{
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function addAddress(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        $addressLine1 = $data['addressLine1'] ?? '';
        $addressLine2 = $data['addressLine2'] ?? null;
        $postalCode = $data['postalCode'] ?? '';
        $city = $data['city'] ?? '';
        $country = $data['country'] ?? '';
        $phoneNumber = $data['phoneNumber'] ?? null;

        $userAddress = new UserAddress();
        $userAddress->setUser($user);
        $userAddress->setAddressLine1($addressLine1);
        $userAddress->setAddressLine2($addressLine2);
        $userAddress->setPostalCode($postalCode);
        $userAddress->setCity($city);
        $userAddress->setCountry($country);
        $userAddress->setPhoneNumber($phoneNumber);

        $errors = $validator->validate($userAddress);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $entityManager->persist($userAddress);
        $entityManager->flush();

        return StandardJsonResponse::success('Adresse mise à jour', null, 200);
    }

    #[Route('/get-all', name: 'getAll', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getAddresses(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $addresses = $entityManager->getRepository(UserAddress::class)->findBy(['user' => $user]);

        return StandardJsonResponse::success('Adresses récupérées', [
            'addresses' => array_map(function (UserAddress $address) {
                return [
                    'id' => $address->getId(),
                    'addressLine1' => $address->getAddressLine1(),
                    'addressLine2' => $address->getAddressLine2(),
                    'postalCode' => $address->getPostalCode(),
                    'city' => $address->getCity(),
                    'country' => $address->getCountry(),
                    'phoneNumber' => $address->getPhoneNumber()
                ];
            }, $addresses)
        ], 200);
    }

    #[Route('/get-one/{id}', name: 'getOne', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getAddress(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        $address = $entityManager->getRepository(UserAddress::class)->findOneBy(['id' => $id, 'user' => $user]);

        if (!$address) {
            return StandardJsonResponse::error('Adresse non trouvée', null, 404);
        }

        return StandardJsonResponse::success('Adresse récupérée', [
            'addressLine1' => $address->getAddressLine1(),
            'addressLine2' => $address->getAddressLine2(),
            'postalCode' => $address->getPostalCode(),
            'city' => $address->getCity(),
            'country' => $address->getCountry(),
            'phoneNumber' => $address->getPhoneNumber()
        ], 200);
    }
}
