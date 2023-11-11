<?php

namespace App\Controller;

use App\Entity\Notifications;
use App\Enum\NotificationType;
use App\Form\NotificationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CoreController extends AbstractController
{
    #[Route('/', name: 'app_core_index')]
    public function index(): Response {
        return $this->render('index.twig', ['activeMain' => true]);
    }

    #[Route('/contact-us', name: 'app_app_contact_form')]
    public function contactForm(Request $request, EntityManagerInterface $entityManager): Response {
        $notification = new Notifications(NotificationType::CONTACT);
        $form = $this->createForm(NotificationFormType::class, $notification);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($notification);
            $entityManager->flush();
        }

        return $this->render('contact-us.twig', [
            'notificationForm' => $form->createView(),
        ]);
    }
}