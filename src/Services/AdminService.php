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

class AdminService
{
    public function __construct(
        private readonly AppService $appService,
        private readonly string $apiUrl,
        private readonly EntityManagerInterface $entityManager
    ) {}

    public function deleteUser(User $user, EntityManagerInterface $entityManager): void
    {
        $entityManager->remove($user);
        $entityManager->flush();
    }

    public function createContainer(string $name, int $basePort, float $memory, float $cpu, ?array $ports=null, ?array $commands=null): array
    {
        $requestUri = "$this->apiUrl/v1/container";

        $payload = [
            'json' => [
                'name' => $name,
                'host_port_root' => $basePort,
                'memory' => $memory,
                'cpulimit' => $cpu
            ]
        ];

        if ($ports != null) {
            $payload['json']['ports'] = $ports;
        }

        if ($commands != null) {
            $payload['json']['commands'] = $commands;
        }

        $response = $this->appService->putApi($requestUri, $payload);

        try {
            if ($response->getStatusCode() !== 200) {
                return ['status' => 'error', 'message' => $response->getContent()];
            }

            // Create the container locally
            $responseData = $response->toArray();
            return ['status' => 'success', 'data' => $responseData];

        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|DecodingExceptionInterface $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function deleteContainer(Containers $container): array {
        $requestUri = "$this->apiUrl/v1/container?id={$container->getId()}";

        $response = $this->appService->deleteApi($requestUri);
        try {
            if ($response->getStatusCode() == 204) {
                $this->entityManager->remove($container);
                $this->entityManager->flush();
                return ['status' => 'success'];
            }
            return ['status' => 'error', 'message' => $response->getContent()];
        } catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}