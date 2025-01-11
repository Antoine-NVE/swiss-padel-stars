<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RemoveDebugKeySubscriber implements EventSubscriberInterface
{
    public function __construct(private string $kernelEnvironment) {}

    public function onKernelResponse(ResponseEvent $event): void
    {
        // Si on n'est pas en prod, ne rien faire
        if ($this->kernelEnvironment !== 'prod') {
            return;
        }

        $response = $event->getResponse();

        // Vérifier que la réponse est un JsonResponse
        if (!$response instanceof JsonResponse) {
            return;
        }

        // Récupérer le contenu JSON de la réponse
        $data = json_decode($response->getContent(), true);

        // Si la clé "debug" existe, on la supprime
        if (is_array($data) && array_key_exists('debug', $data)) {
            unset($data['debug']);
        }

        // Réinjecter les données modifiées dans la réponse
        $response->setData($data);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }
}
