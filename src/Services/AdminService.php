<?php

namespace App\Services;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AdminService
{
    public function deleteUser(User $user, EntityManagerInterface $entityManager) {
        $entityManager->remove($user);
        $entityManager->flush();
    }
}