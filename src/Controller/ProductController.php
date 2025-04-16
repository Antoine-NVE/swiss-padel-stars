<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductImage;
use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/product', name: 'api_product_')]
class ProductController extends AbstractController
{
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $name = $request->request->get('name', '');
        $description = $request->request->get('description', '');
        $price = $request->request->get('price');
        $imageFiles = $request->files->get('images');

        if ($imageFiles instanceof UploadedFile) {
            $imageFiles = [$imageFiles];
        }

        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setPrice((int)$price);
        $product->setCreatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($product);

        if (!$imageFiles || count($imageFiles) < 1) {
            $errors->add(new ConstraintViolation('Veuillez ajouter au moins une image.', null, [], '', 'images', null));
        }

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Erreur de validation.', $errorMessages, 400);
        }

        $entityManager->persist($product);

        foreach ($imageFiles as $imageFile) {
            if ($imageFile && $imageFile->isValid()) {
                $fileName = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move('uploads/products', $fileName);

                $productImage = new ProductImage();
                $productImage->setProduct($product);
                $productImage->setFileName('uploads/products/' . $fileName);

                $entityManager->persist($productImage);
            }
        }

        $entityManager->flush();

        return StandardJsonResponse::success('Produit créé avec succès.', [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    #[Route('/get-all', name: 'get_all', methods: ['GET'])]
    public function getAll(EntityManagerInterface $entityManager): JsonResponse
    {
        $products = $entityManager->getRepository(Product::class)->findBy([], ['createdAt' => 'DESC']);

        $data = [];
        foreach ($products as $product) {
            $images = [];
            foreach ($product->getProductImages() as $image) {
                $images[] = $image->getFileName();
            }

            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                'images' => $images
            ];
        }

        return StandardJsonResponse::success('Liste des produits', $data);
    }

    #[Route('/{id}', name: 'get_one', methods: ['GET'])]
    public function getOne(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            return StandardJsonResponse::error('Produit non trouvé.', null, 404);
        }

        $images = [];
        foreach ($product->getProductImages() as $image) {
            $images[] = $image->getFileName();
        }

        return StandardJsonResponse::success('Produit trouvé.', [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'images' => $images
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            return StandardJsonResponse::error('Produit non trouvé.', null, 404);
        }

        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;
        $price = $data['price'] ?? null;

        if ($name !== null) $product->setName($name);
        if ($description !== null) $product->setDescription($description);
        if ($price !== null) $product->setPrice((int)$price);

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Erreur de validation.', $errorMessages, 400);
        }

        $entityManager->flush();

        return StandardJsonResponse::success('Produit mis à jour.', [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    #[Route('/{id}/images', name: 'add_images', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function addImages(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            return StandardJsonResponse::error('Produit non trouvé.', null, 404);
        }

        $imageFiles = $request->files->get('images');

        if ($imageFiles instanceof UploadedFile) {
            $imageFiles = [$imageFiles];
        }

        if (!is_array($imageFiles) || count($imageFiles) < 1) {
            return StandardJsonResponse::error('Aucune image reçue.', ['images' => 'Ajoutez au moins une image.'], 400);
        }

        foreach ($imageFiles as $imageFile) {
            if ($imageFile && $imageFile->isValid()) {
                $fileName = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move('uploads/products', $fileName);

                $productImage = new ProductImage();
                $productImage->setProduct($product);
                $productImage->setFileName('uploads/products/' . $fileName);

                $entityManager->persist($productImage);
            }
        }

        $entityManager->flush();

        return StandardJsonResponse::success('Image(s) ajoutée(s) au produit.');
    }

    #[Route('/{productId}/images/{imageId}', name: 'delete_image', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteImage(int $productId, int $imageId, EntityManagerInterface $entityManager): JsonResponse
    {
        $product = $entityManager->getRepository(Product::class)->find($productId);
        if (!$product) {
            return StandardJsonResponse::error('Produit non trouvé.', null, 404);
        }

        $image = $entityManager->getRepository(ProductImage::class)->find($imageId);
        if (!$image || $image->getProduct()->getId() !== $productId) {
            return StandardJsonResponse::error('Image non trouvée ou non liée à ce produit.', null, 404);
        }

        $filePath = $image->getFileName();
        if ($filePath && file_exists($filePath)) {
            unlink($filePath);
        }

        $entityManager->remove($image);
        $entityManager->flush();

        return StandardJsonResponse::success('Image supprimée avec succès.');
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $product = $entityManager->getRepository(Product::class)->find($id);
        if (!$product) {
            return StandardJsonResponse::error('Produit non trouvé.', null, 404);
        }

        foreach ($product->getProductImages() as $image) {
            $filePath = $image->getFileName();
            if ($filePath && file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return StandardJsonResponse::success('Produit et ses images supprimés.');
    }
}
