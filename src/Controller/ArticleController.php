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
}
