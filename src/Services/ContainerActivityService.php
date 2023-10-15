<?php

namespace App\Services;

use App\Entity\ContainerActivity;
use App\Entity\Containers;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;

class ContainerActivityService
{
    public function __construct(private readonly EntityManagerInterface $entityManager) {

    }
    public function recordActivity(Containers $container, string $description): void {
        $activity = new ContainerActivity();
        $activity->setContainer($container);
        $activity->setDescription($description);
        $activity->setTimestamp(new DateTimeImmutable('now', new DateTimeZone('Europe/Paris')),);
        $this->entityManager->persist($activity);
        $this->entityManager->flush();
    }
}