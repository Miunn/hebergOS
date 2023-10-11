<?php

namespace App\Entity;

use App\Repository\ContainersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\This;

#[ORM\Entity(repositoryClass: ContainersRepository::class)]
class Containers
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private ?string $id = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'containers', orphanRemoval: true)]
    private Collection $user;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $domain = null;

    #[ORM\OneToMany(mappedBy: 'container', targetEntity: ContainerActivity::class, orphanRemoval: true)]
    private Collection $containerActivities;

    public function __construct(string $id)
    {
        $this->setId($id);
        $this->user = new ArrayCollection();
        $this->containerActivities = new ArrayCollection();
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
}
