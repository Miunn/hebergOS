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
            $containersRepository = $entityManager->getRepository(Containers::class);
            $should_flush = false;
            foreach ($containers as $key=>$container) {
                if ($containersRepository->findOneBy(['id' => $key]) == null) {
                    dump("ADD CONTAINER:".$container['name']);
                    $newContainer = new Containers($key);
                    $newContainer->setName($container['name']);
                    $entityManager->persist($newContainer);
                    $should_flush = true;
                }
            }
            if ($should_flush) {
                $entityManager->flush();
            }
            return $containers;
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
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
            $requestUri = $requestUri . 'id=' . $container->getId().'&';
        }

        try {
            $response = $this->httpClient->request(
                'GET',
                substr($requestUri, 0, strlen($requestUri)-1)
            );
            $userContainers = $response->toArray();
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }

        return $userContainers;
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
}