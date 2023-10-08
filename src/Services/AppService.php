<?php

namespace App\Services;

use App\Entity\User;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AppService
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly string $apiUrl,
    ) {}
    public function getContainers(): array
    {
        $requestUri = $this->apiUrl . '/v1/container';
        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            return $response->toArray();
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        } catch (DecodingExceptionInterface $e) {
        }
        return [];
    }

    public function getUserContainers(User $user): array
    {
        dump($user);
        dump($user->getContainers()->toArray());
        if (empty($user->getContainers()->toArray())) {
            return [];
        }

        $userContainers = [];
        $requestUri = $this->apiUrl . '/v1/container?';
        foreach ($user->getContainers() as $container) {
            $requestUri = $requestUri . 'id=' . $container->getDockerId();
        }

        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            dump($response);
            $userContainers[] = $response->getContent();
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }

        return $userContainers;
    }
}