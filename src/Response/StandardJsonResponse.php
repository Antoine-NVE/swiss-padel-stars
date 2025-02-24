<?php

namespace App\Response;

use Symfony\Component\HttpFoundation\JsonResponse;

class StandardJsonResponse extends JsonResponse
{
    private function __construct(string $message, ?array $data = null, ?array $errors = null, int $status = 200, array $debug = [], array $headers = [])
    {
        $response = [
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
            'debug' => $debug
        ];

        parent::__construct($response, $status, $headers);
    }

    public static function success(string $message, ?array $data = null, int $status = 200, array $debug = [], array $headers = []): self
    {
        return new self($message, $data, null, $status, $debug, $headers);
    }

    public static function error(string $message, ?array $errors = null, int $status = 400, array $debug = [], array $headers = []): self
    {
        return new self($message, null, $errors, $status, $debug, $headers);
    }
}
