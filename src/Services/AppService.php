<?php

namespace App\Services;

use App\Entity\Containers;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class AppService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly HttpClientInterface $httpClient,
        private readonly string $apiUrl,
    ) {}

    public function getApi(string $uri): ?ResponseInterface
    {
        try {
            return $this->httpClient->request(
                'GET',
                $uri
            );
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface $e) {
            dump($e);
        }
        return null;
    }

    public function postApi(string $uri, array $data): ?ResponseInterface
    {
        try {
            return $this->httpClient->request(
                'POST',
                $uri,
                $data
            );
        } catch (TransportExceptionInterface $e) {
            dump($e);
        }
        return null;
    }

    public function putApi(string $uri, array $data): ?ResponseInterface
    {
        try {
            return $this->httpClient->request(
                'PUT',
                $uri,
                $data
            );
        } catch (TransportExceptionInterface $e) {
            dump($e);
        }
        return null;
    }

    public function deleteApi(string $uri): ?ResponseInterface
    {
        try {
            return $this->httpClient->request(
                'DELETE',
                $uri
            );
        } catch (TransportExceptionInterface $e) {
            dump($e);
        }
        return null;
    }

    public function getContainers(): array
    {
        $requestUri = $this->apiUrl . '/v1/container';
        $response = $this->getApi($requestUri);

        if ($response == null) {
            return [];
        }

        try {
            $containers = $response->toArray();
            $this->syncContainers($containers);
            return $containers['success'];
        } catch (ClientExceptionInterface|DecodingExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|TransportExceptionInterface $e) {
            dump($e);
        }
        return [];
    }

    public function getUserContainers(User $user): array
    {
        if (empty($user->getContainers()->toArray())) {
            return [];
        }

        $userContainers = [];
        $requestUri = $this->apiUrl . '/v1/container?';
        foreach ($user->getContainers() as $container) {
            $requestUri = $requestUri . 'id=' . $container->getId().'&';
        }

        $response = $this->getApi(substr($requestUri, 0, strlen($requestUri)-1));

        if ($response == null) {
            return [];
        }

        try {
            $userContainers = $response->toArray();
            $this->syncContainers($userContainers);
            return $userContainers['success'];
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            dump($e);
        }
        return [];
    }

    public function getContainer(string $container_id): array
    {
        $requestUri = "$this->apiUrl/v1/container?id=$container_id";
        $response = $this->getApi($requestUri);

        if ($response == null) {
            return [];
        }

        try {
            return $response->toArray()['success'][$container_id];
        } catch (TransportExceptionInterface|ClientExceptionInterface|DecodingExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }
        return [];
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

    public function getStats(Containers $container, string $scale): array
    {
        $requestUri = "$this->apiUrl/v1/container/stats?id={$container->getId()}&since=0&scale=$scale";
        $response = $this->getApi($requestUri);

        if ($response == null) {
            return [];
        }

        try {
            return $response->toArray();
        } catch (ClientExceptionInterface|DecodingExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|TransportExceptionInterface $e) {
            dump($e);
        }
        return [];
    }

    public function startContainer(Containers $container): array
    {
        $requestUri = "$this->apiUrl/v1/container/start?id={$container->getId()}";
        $response = $this->postApi($requestUri, []);

        if ($response == null) {
            return ["success" => false, "data" => "Null Response"];
        }
        dump($response);
        try {
            if ($response->getStatusCode() == Response::HTTP_NO_CONTENT) {
                return ["success" => true];
            }
            return ["success" => false, "data" => $response->getContent()];
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
            return ["success" => false, "data" => $e->getMessage()];
        }
    }

    public function stopContainer(Containers $container): array
    {
        $requestUri = "$this->apiUrl/v1/container/stop?id={$container->getId()}";
        $response = $this->postApi($requestUri, []);
        try {
            if ($response->getStatusCode() == Response::HTTP_NO_CONTENT) {
                return ["success" => true];
            }
            return ["success" => false, "data" => $response->getContent()];
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }
        return ["success" => false, "data" => $e->getMessage()];
    }

    public function restartContainer(Containers $container): array
    {
        $requestUri = "$this->apiUrl/v1/container/restart?id={$container->getId()}";
        $response = $this->postApi($requestUri, []);
        try {
            if ($response->getStatusCode() == Response::HTTP_NO_CONTENT) {
                return ["success" => true];
            }
            return ["success" => false, "data" => $response->getContent()];
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }
        return ["success" => false, "data" => $e->getMessage()];
    }
}