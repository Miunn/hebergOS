<?php

namespace App\Services;

use App\Entity\ContainerActivity;
use App\Entity\Containers;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

class ContainerActivityService
{
    public function __construct(private readonly EntityManagerInterface $entityManager) {

    }
    public function recordActivity(Containers $container, string $description): void {
        $activity = new ContainerActivity();
        $activity->setContainer($container);
        $activity->setDescription($description);
        try {
            $activity->setTimestamp(new DateTimeImmutable('now', new DateTimeZone('Europe/Paris')),);
        } catch (Exception $e) {
            dump($e);
        }
        $this->entityManager->persist($activity);
        $this->entityManager->flush();
    }
}