<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\ArticleImage;
use App\Response\StandardJsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/article', name: 'api_article_')]
class ArticleController extends AbstractController
{
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $title = $request->request->get('title', '');
        $description = $request->request->get('description', '');
        $imageFiles = $request->files->get('images'); // tableau d'images

        $article = new Article();
        $article->setTitle($title);
        $article->setDescription($description);
        $article->setCreatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($article);

        if ($imageFiles instanceof UploadedFile) {
            $imageFiles = [$imageFiles];
        }

        // Vérifie qu'au moins une image est fournie
        if (!$imageFiles || count($imageFiles) < 1) {
            $errors->add(new ConstraintViolation(
                'Veuillez ajouter au moins une image.',
                null,
                [],
                '',
                'images',
                null
            ));
        }

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Une erreur est survenue.', $errorMessages, 400);
        }

        $entityManager->persist($article);

        foreach ($imageFiles as $imageFile) {
            if ($imageFile && $imageFile->isValid()) {
                $fileName = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move('uploads/articles', $fileName);

                $articleImage = new ArticleImage();
                $articleImage->setArticle($article);
                $articleImage->setFileName('uploads/articles/' . $fileName);

                $entityManager->persist($articleImage);
            }
        }

        $entityManager->flush();

        return StandardJsonResponse::success('Article créé', [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'description' => $article->getDescription(),
            'createdAt' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/get-all', name: 'get-all', methods: ['GET'])]
    public function getAll(EntityManagerInterface $entityManager): JsonResponse
    {
        $articles = $entityManager->getRepository(Article::class)->findAll();

        $data = [];

        /** @var \App\Entity\Article $article */
        foreach ($articles as $article) {
            $images = [];
            foreach ($article->getArticleImages() as $image) {
                $images[] = $image->getFileName();
            }

            $data[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'description' => $article->getDescription(),
                'createdAt' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                'images' => $images,
            ];
        }

        return StandardJsonResponse::success('Liste des articles', $data);
    }

    #[Route('/get-one/{id}', name: 'get-one', methods: ['GET'])]
    public function getOne(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $article = $entityManager->getRepository(Article::class)->find($id);

        if (!$article) {
            return StandardJsonResponse::error("Article non trouvé.", null, 404);
        }

        $images = [];
        foreach ($article->getArticleImages() as $image) {
            $images[] = $image->getFileName();
        }

        $data = [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'description' => $article->getDescription(),
            'createdAt' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
            'images' => $images,
        ];

        return StandardJsonResponse::success('Article trouvé', $data);
    }

    #[Route('/update/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateArticle(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $article = $entityManager->getRepository(Article::class)->find($id);

        if (!$article) {
            return StandardJsonResponse::error('Article non trouvé.', null, 404);
        }

        $data = json_decode($request->getContent(), true);
        $title = $data['title'] ?? null;
        $description = $data['description'] ?? null;

        if ($title !== null) {
            $article->setTitle($title);
        }

        if ($description !== null) {
            $article->setDescription($description);
        }

        $errors = $validator->validate($article);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return StandardJsonResponse::error('Erreur de validation.', $errorMessages, 400);
        }

        $article->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->flush();

        return StandardJsonResponse::success('Article mis à jour', [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'description' => $article->getDescription(),
            'createdAt' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/{id}/add-images', name: 'add_images', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function addImages(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $article = $entityManager->getRepository(Article::class)->find($id);

        if (!$article) {
            return StandardJsonResponse::error('Article non trouvé.', null, 404);
        }

        $imageFiles = $request->files->get('images');

        // S'assurer qu'on a bien un tableau d'images
        if ($imageFiles instanceof UploadedFile) {
            $imageFiles = [$imageFiles];
        }

        if (!is_array($imageFiles) || count($imageFiles) < 1) {
            return StandardJsonResponse::error('Aucune image reçue.', ['images' => 'Ajoutez au moins une image.'], 400);
        }

        foreach ($imageFiles as $imageFile) {
            if ($imageFile && $imageFile->isValid()) {
                $fileName = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move('uploads/articles', $fileName);

                $articleImage = new ArticleImage();
                $articleImage->setArticle($article);
                $articleImage->setFileName('uploads/articles/' . $fileName);

                $entityManager->persist($articleImage);
            }
        }

        $entityManager->flush();

        return StandardJsonResponse::success('Images ajoutées avec succès.');
    }

    #[Route('/{articleId}/delete-image/{imageId}', name: 'delete_image', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteImage(
        int $articleId,
        int $imageId,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $article = $entityManager->getRepository(Article::class)->find($articleId);
        if (!$article) {
            return StandardJsonResponse::error('Article non trouvé.', null, 404);
        }

        $image = $entityManager->getRepository(ArticleImage::class)->find($imageId);
        if (!$image || $image->getArticle()->getId() !== $articleId) {
            return StandardJsonResponse::error('Image non trouvée ou non liée à cet article.', null, 404);
        }

        // Suppression du fichier physique (optionnel)
        $filePath = $image->getFileName(); // ou ->getPath()
        if ($filePath && file_exists($filePath)) {
            unlink($filePath);
        }

        $entityManager->remove($image);
        $entityManager->flush();

        return StandardJsonResponse::success('Image supprimée avec succès.');
    }

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteArticle(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $article = $entityManager->getRepository(Article::class)->find($id);

        if (!$article) {
            return StandardJsonResponse::error('Article non trouvé.', null, 404);
        }

        // Suppression des fichiers images physiques
        foreach ($article->getArticleImages() as $image) {
            $filePath = $image->getFileName(); // ou getPath()
            if ($filePath && file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $entityManager->remove($article);
        $entityManager->flush();

        return StandardJsonResponse::success('Article supprimé avec toutes ses images.');
    }
}
