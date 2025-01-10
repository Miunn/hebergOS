<?php

namespace App\Entity;

use App\Enum\ContainerActivityType;
use App\Repository\ContainerActivityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

#[ORM\Entity(repositoryClass: ContainerActivityRepository::class)]
class ContainerActivity implements JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $timestamp = null;

    #[ORM\Column(length: 80)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'containerActivities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Containers $container = null;

    #[ORM\Column(type: Types::STRING, length: 30, enumType: ContainerActivityType::class)]
    private ?ContainerActivityType $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimestamp(): ?\DateTimeImmutable
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeImmutable $timestamp): static
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getContainer(): ?Containers
    {
        return $this->container;
    }

    public function setContainer(?Containers $container): static
    {
        $this->container = $container;

        return $this;
    }

    public function getType(): ?ContainerActivityType
    {
        return $this->type;
    }

    public function setType(ContainerActivityType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'container' => $this->container,
            'timestamp' => $this->timestamp->getTimestamp(),
            'type' => $this->type,
        ];
    }
}
