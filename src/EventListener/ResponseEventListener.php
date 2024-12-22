<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class ResponseEventListener
{
    #[AsEventListener(event: KernelEvents::RESPONSE)]
    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        // Vérifiez si des cookies sont à ajouter
        if ($cookie = $request->attributes->get('new_access_token_cookie')) {
            $response->headers->setCookie($cookie);
        }

        if ($cookie = $request->attributes->get('new_refresh_token_cookie')) {
            $response->headers->setCookie($cookie);
        }
    }
}
