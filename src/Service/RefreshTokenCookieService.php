<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Cookie;

class RefreshTokenCookieService
{
    public function createCookie(string $token, int $ttl = 3600 * 24 * 30): Cookie
    {
        return new Cookie(
            'refresh_token',
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
