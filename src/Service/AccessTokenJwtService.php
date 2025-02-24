<?php

namespace App\Service;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AccessTokenJwtService
{
    public function __construct(
        private string $secret,
        private string $algorithm = 'HS256'
    ) {}

    public function encode(string $userId, $expiration = 3600): string
    {
        return JWT::encode(
            [
                'user_id' => $userId,
                'iat' => time(),
                'exp' => time() + $expiration
            ],
            $this->secret,
            $this->algorithm
        );
    }

    public function decode(string $accessToken): array
    {
        try {
            return (array) JWT::decode($accessToken, new Key($this->secret, $this->algorithm));
        } catch (Exception $e) {
            throw $e;
        }
    }
}
