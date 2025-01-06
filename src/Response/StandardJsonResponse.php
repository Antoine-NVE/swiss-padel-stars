<?php

namespace App\Response;

use Symfony\Component\HttpFoundation\JsonResponse;

class StandardJsonResponse extends JsonResponse
{
    public function __construct(string $message, ?array $data = null, ?array $errors = null, int $status = 200, array $headers = [])
    {
        $response = [
            'message' => $message,
            'data' => $data,
            'errors' => $errors
        ];

        parent::__construct($response, $status, $headers);
    }

    public static function success(string $message, ?array $data = null, int $status = 200, array $headers = []): self
    {
        return new self($message, $data, null, $status, $headers);
    }

    public static function error(string $message, ?array $errors = null, int $status = 400, array $headers = []): self
    {
        return new self($message, null, $errors, $status, $headers);
    }
}
