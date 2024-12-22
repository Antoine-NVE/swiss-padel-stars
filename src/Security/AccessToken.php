<?php

namespace App\Security;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AccessToken implements TokenInterface
{
    private string $jwt;
    private ?UserInterface $user = null;
    private array $roles = [];
    private array $attributes = [];

    public function __construct(string $jwt)
    {
        $this->jwt = $jwt;
    }

    public function getCredentials(): string
    {
        return $this->jwt;
    }

    public function getUser(): ?UserInterface
    {
        return $this->user;
    }

    public function setUser(UserInterface $user): void
    {
        $this->user = $user;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function getRoleNames(): array
    {
        return array_map(static fn($role) => (string) $role, $this->roles);
    }

    public function eraseCredentials(): void
    {
        $this->jwt = '';
    }

    public function getAttributes(): array
    {
        return $this->attributes;
    }

    public function setAttributes(array $attributes): void
    {
        $this->attributes = $attributes;
    }

    public function hasAttribute(string $name): bool
    {
        return array_key_exists($name, $this->attributes);
    }

    public function getAttribute(string $name): mixed
    {
        if (!$this->hasAttribute($name)) {
            throw new \InvalidArgumentException(sprintf('Attribute "%s" does not exist.', $name));
        }

        return $this->attributes[$name];
    }

    public function setAttribute(string $name, mixed $value): void
    {
        $this->attributes[$name] = $value;
    }

    public function __toString(): string
    {
        return $this->jwt;
    }

    public function getUserIdentifier(): string
    {
        if ($this->user instanceof UserInterface) {
            return $this->user->getUserIdentifier();
        }

        return 'anonymous';
    }

    public function isAuthenticated(): bool
    {
        // JWT brute est considéré comme non authentifié à ce stade
        return false;
    }

    public function setAuthenticated(bool $authenticated): void
    {
        // Ne fait rien ici car on ne gère pas l'authentification directement
    }

    public function __serialize(): array
    {
        return [
            'jwt' => $this->jwt,
            'roles' => $this->roles,
            'attributes' => $this->attributes,
            'user' => $this->user,
        ];
    }

    public function __unserialize(array $data): void
    {
        $this->jwt = $data['jwt'] ?? '';
        $this->roles = $data['roles'] ?? [];
        $this->attributes = $data['attributes'] ?? [];
        $this->user = $data['user'] ?? null;
    }
}
