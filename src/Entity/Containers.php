<?php

namespace App\Entity;

use App\Repository\ContainersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use phpDocumentor\Reflection\Types\This;

#[ORM\Entity(repositoryClass: ContainersRepository::class)]
class Containers implements JsonSerializable
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private ?string $id = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'containers')]
    private Collection $user;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $domain = null;

    #[ORM\OneToMany(mappedBy: 'container', targetEntity: ContainerActivity::class, orphanRemoval: true)]
    private Collection $containerActivities;

    #[ORM\Column(nullable: true)]
    private ?int $hostPortRoot = null;

    #[ORM\Column(nullable: true)]
    private ?float $memoryLimit = null;

    #[ORM\Column(nullable: true)]
    private ?float $cpuLimit = null;

    #[ORM\OneToMany(mappedBy: 'container', targetEntity: Notifications::class, cascade: ['remove'], orphanRemoval: true)]
    private Collection $notifications;

    public function __construct()
    {
        $this->user = new ArrayCollection();
        $this->containerActivities = new ArrayCollection();
        $this->notifications = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->user;
    }

    public function addUser(User $user): static
    {
        if (!$this->user->contains($user)) {
            $this->user->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->user->removeElement($user);

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function removeUsers(): static
    {
        foreach ($this->user->toArray() as $user) {
            $this->removeUser($user);
            $user->removeContainer($this);
        }

        return $this;
    }

    public function getDomain(): ?string
    {
        return $this->domain;
    }

    public function setDomain(?string $domain): static
    {
        $this->domain = $domain;

        return $this;
    }

    /**
     * @return Collection<int, ContainerActivity>
     */
    public function getContainerActivities(): Collection
    {
        return $this->containerActivities;
    }

    public function addContainerActivity(ContainerActivity $containerActivity): static
    {
        if (!$this->containerActivities->contains($containerActivity)) {
            $this->containerActivities->add($containerActivity);
            $containerActivity->setContainer($this);
        }

        return $this;
    }

    public function removeContainerActivity(ContainerActivity $containerActivity): static
    {
        if ($this->containerActivities->removeElement($containerActivity)) {
            // set the owning side to null (unless already changed)
            if ($containerActivity->getContainer() === $this) {
                $containerActivity->setContainer(null);
            }
        }

        return $this;
    }

    public function getHostPortRoot(): ?int
    {
        return $this->hostPortRoot;
    }

    public function setHostPortRoot(?int $hostPortRoot): static
    {
        $this->hostPortRoot = $hostPortRoot;

        return $this;
    }

    public function getMemoryLimit(): ?float
    {
        return $this->memoryLimit;
    }

    public function setMemoryLimit(?float $memoryLimit): static
    {
        $this->memoryLimit = $memoryLimit;

        return $this;
    }

    public function getCpuLimit(): ?float
    {
        return $this->cpuLimit;
    }

    public function setCpuLimit(?float $cpuLimit): static
    {
        $this->cpuLimit = $cpuLimit;

        return $this;
    }

    /**
     * @return Collection<int, Notifications>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notifications $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setContainer($this);
        }

        return $this;
    }

    public function removeNotification(Notifications $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getContainer() === $this) {
                $notification->setContainer(null);
            }
        }

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'memory' => $this->memoryLimit,
            'cpu' => $this->cpuLimit,
            'port' => $this->hostPortRoot
        ];
    }
}
