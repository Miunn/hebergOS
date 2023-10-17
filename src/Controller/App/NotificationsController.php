<?php

namespace App\Controller\App;

use App\Entity\Notifications;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app/admin/notifications')]
class NotificationsController extends AbstractController
{
    #[Route('/', name: 'app_notifications_index')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $notificationsRepository = $entityManager->getRepository(Notifications::class);
        $notifications = $notificationsRepository->findAll();
        return $this->render('admin/notifications.twig', [
            'notifications' => $notifications
        ]);
    }
}