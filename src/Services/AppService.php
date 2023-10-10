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
        private readonly HttpClientInterface $httpClient,
        private readonly string $apiUrl,
    ) {}
    public function getContainers(EntityManagerInterface $entityManager): array
    {
        $requestUri = $this->apiUrl . '/v1/container';
        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            $containers = $response->toArray();

            $this->syncContainers($containers, $entityManager);
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
            $this->syncContainers($userContainers, $entityManager);
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }

        return $userContainers['success'];
    }

    public function getContainerStats(string $container_id, int $timestamp): ?string
    {
        $requestUri = "$this->apiUrl/v1/container/stats?id=$container_id&since=$timestamp";

        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            return $response->getContent();

        } catch (TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|ClientExceptionInterface $e) {
        }
        return null;
    }

    public function syncContainers(array $containers, EntityManagerInterface $entityManager): void
    {
        // Register new containers
        $containersRepository = $entityManager->getRepository(Containers::class);
        $should_flush = false;
        foreach ($containers['success'] as $key=>$container) {
            if ($containersRepository->findOneBy(['id' => $key]) == null) {
                $newContainer = new Containers($key);
                $newContainer->setName($container['name']);
                $entityManager->persist($newContainer);
                $should_flush = true;
            }
        }

        if (!array_key_exists('error', $containers)) {
            if ($should_flush) {
                $entityManager->flush();
            }
            return;
        }

        // Remove errors containers
        foreach ($containers['error'] as $key=>$container) {
            $container = $containersRepository->findOneBy(['id' => $key]);
            // Security but in theory it shouldn't be null
            if ($container != null) {
                $entityManager->remove($container);
                $should_flush = true;
            }
        }

        if ($should_flush) {
            $entityManager->flush();
        }
    }
}