<?php

namespace App\Entity;

use App\Repository\ContainersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContainersRepository::class)]
class Containers
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private ?string $id = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'containers')]
    private Collection $user;

    #[ORM\Column(length: 30)]
    private ?string $name = null;

    public function __construct(string $id)
    {
        $this->setId($id);
        $this->user = new ArrayCollection();
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
}
