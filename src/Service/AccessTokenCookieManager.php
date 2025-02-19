<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Cookie;

class AccessTokenCookieManager
{
    public function createCookie(string $token, int $ttl = 3600): Cookie
    {
        return new Cookie(
            'access_token',
            $token,
            time() + $ttl, // TTL positif pour créer, négatif pour supprimer
            '/', // Path
            null, // Domain
            false, // Secure
            true, // HttpOnly
            false, // Raw
            'Strict' // SameSite
        );
    }

    public function deleteCookie(): Cookie
    {
        return $this->createCookie('', -1);
    }
}
