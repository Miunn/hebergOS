<?php

namespace App\Services;

use App\Entity\ContainerActivity;
use App\Entity\Containers;
use App\Enum\ContainerActivityType;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class ContainerActivityService
{
    public function __construct(private readonly EntityManagerInterface $entityManager) {

    }
    public function recordActivity(Containers $container, ContainerActivityType $type, string $description): void {
        $activity = new ContainerActivity();
        $activity->setContainer($container);
        $activity->setType($type);
        $activity->setDescription($description);
        try {
            $activity->setTimestamp(new DateTimeImmutable('now', new DateTimeZone('Europe/Paris')),);
        } catch (Exception $e) {
            dump($e);
        }
        $this->entityManager->persist($activity);
        $this->entityManager->flush();
    }

    public function extractJsonContainerActivity(Containers $container): bool|string
    {
        $jsonActivity = [];
        foreach ($container->getContainerActivities() as $containerActivity) {
            $jsonActivity[] = $containerActivity;
        }
        return json_encode($jsonActivity);
    }
}