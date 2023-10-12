<?php

namespace App\Services;

use App\Entity\ContainerActivity;
use App\Entity\Containers;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

class ContainerActivityService
{
    public function recordActivity(Containers $container, string $description, DateTimeImmutable $dateTime, EntityManagerInterface $entityManager): void {
        $activity = new ContainerActivity();
        $activity->setContainer($container);
        $activity->setDescription($description);
        $activity->setTimestamp($dateTime);
        $entityManager->persist($activity);
        $entityManager->flush();
    }
}