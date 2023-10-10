<?php

namespace App\Services;

use App\Entity\Containers;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AppService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
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
            $containers = $response->toArray();

            $this->syncContainers($containers);
            return $containers['success'];
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }
        return [];
    }

    public function getUserContainers(User $user, EntityManagerInterface $entityManager): array
    {
        if (empty($user->getContainers()->toArray())) {
            return [];
        }

        $userContainers = [];
        $requestUri = $this->apiUrl . '/v1/container?';
        foreach ($user->getContainers() as $container) {
            $requestUri = $requestUri . 'id=' . $container->getId().'&';
        }

        try {
            $response = $this->httpClient->request(
                'GET',
                substr($requestUri, 0, strlen($requestUri)-1)
            );
            $userContainers = $response->toArray();
            $this->syncContainers($userContainers);
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }

        return $userContainers['success'];
    }

    public function getContainer(string $container_id): array
    {
        $requestUri = "$this->apiUrl/v1/container?id=$container_id";

        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            return $response->toArray();
        } catch (TransportExceptionInterface|ClientExceptionInterface|DecodingExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }
        return [];
    }

    public function getContainerStats(string $container_id, int $timestamp): string
    {
        $requestUri = "$this->apiUrl/v1/container/stats?id=$container_id&since=$timestamp";

        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            return $response->getContent();

        } catch (TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|ClientExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }
        return "{}";
    }

    public function syncContainers(array $containers): void
    {
        // Register new containers
        $containersRepository = $this->entityManager->getRepository(Containers::class);
        $should_flush = false;
        foreach ($containers['success'] as $key=>$container) {
            if ($containersRepository->findOneBy(['id' => $key]) == null) {
                $newContainer = new Containers($key);
                $newContainer->setName($container['name']);
                $this->entityManager->persist($newContainer);
                $should_flush = true;
            }
        }

        if (!array_key_exists('error', $containers)) {
            if ($should_flush) {
                $this->entityManager->flush();
            }
            return;
        }

        // Remove errors containers
        foreach ($containers['error'] as $key=>$container) {
            $container = $containersRepository->findOneBy(['id' => $key]);
            // Security but in theory it shouldn't be null
            if ($container != null) {
                $this->entityManager->remove($container);
                $should_flush = true;
            }
        }

        if ($should_flush) {
            $this->entityManager->flush();
        }
    }
}