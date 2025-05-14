<?php

use App\Service\AccessTokenCookieService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Cookie;

class AccessTokenCookieServiceTest extends TestCase
{
    public function testCreateCookieReturnsValidCookie()
    {
        $service = new AccessTokenCookieService();
        $token = 'test-token';
        $ttl = 3600;

        $cookie = $service->createCookie($token, $ttl);

        $this->assertInstanceOf(Cookie::class, $cookie);
        $this->assertEquals('access_token', $cookie->getName());
        $this->assertEquals($token, $cookie->getValue());
        $this->assertGreaterThan(time(), $cookie->getExpiresTime());
        $this->assertEquals('/', $cookie->getPath());
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertEqualsIgnoringCase('Strict', $cookie->getSameSite());
    }

    public function testDeleteCookieSetsNegativeTTL()
    {
        $service = new AccessTokenCookieService();

        $cookie = $service->deleteCookie();

        $this->assertInstanceOf(Cookie::class, $cookie);
        $this->assertEquals('access_token', $cookie->getName());
        $this->assertEquals('', $cookie->getValue());
        $this->assertLessThan(time(), $cookie->getExpiresTime());
    }
}
