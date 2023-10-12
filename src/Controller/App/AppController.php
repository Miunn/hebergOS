<?php

namespace App\Controller\App;

use App\Entity\Containers;
use App\Entity\User;
use App\Services\AppService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app')]
class AppController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService
    ) {}

    #[Route('/', name: 'app_app_index')]
    public function index(EntityManagerInterface $entityManager): Response {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        $userContainers = $this->appService->getUserContainers($user);
        return $this->render('app/index.twig', [
            'containers' => $userContainers,
        ]);
    }

    #[Route('/container/overview/{container}', name: 'app_container_overview')]
    public function container(Containers $container): Response {
        // Ensure user is associated with it
        $user = $this->getUser();
        if (!$user instanceof User || !$user->getContainers()->contains($container)) {
            throw new AccessDeniedException();
        }

        $containerApi = $this->appService->getContainer($container->getId());
        return $this->render('app/view/container-overview.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            'overview' => true
        ]);
    }

    #[Route('/container/stats/{container}', name: 'app_container_stats')]
    public function containerStats(Containers $container): Response {
        // Ensure user is associated with it
        $user = $this->getUser();
        if (!$user instanceof User || !$user->getContainers()->contains($container)) {
            throw new AccessDeniedException();
        }

        $containerApi = $this->appService->getContainer($container->getId());
        $stats = $this->appService->getContainerStats($container->getId(), 0);
        return $this->render('app/view/container-stats.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            'data' => $stats,
            'stats' => true
        ]);
    }

    #[Route('/container/shell/{container}', name: 'app_container_shell')]
    public function containerShell(Containers $container): Response {
        // Ensure user is associated with it
        $user = $this->getUser();
        if (!$user instanceof User || !$user->getContainers()->contains($container)) {
            throw new AccessDeniedException();
        }

        $containerApi = $this->appService->getContainer($container->getId());
        $stats = $this->appService->getContainerStats($container->getId(), 0);
        return $this->render('app/view/container-shell.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            'shell' => "1"
        ]);
    }

    #[Route('/container/actions/{container}', name: 'app_container_actions')]
    public function containerActions(Containers $container): Response {
        // Ensure user is associated with it
        $user = $this->getUser();
        if (!$user instanceof User || !$user->getContainers()->contains($container)) {
            throw new AccessDeniedException();
        }

        $containerApi = $this->appService->getContainer($container->getId());
        $stats = $this->appService->getContainerStats($container->getId(), 0);
        return $this->render('app/view/container-actions.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            'actions' => "1"
        ]);
    }

    /** AJAX Routes */
    #[Route('/container/start/{container}', name: 'app_container_start')]
    public function startContainer(Containers $container): Response {
        dump("Start container");
        return new JsonResponse($this->appService->startContainer($container));
    }

    #[Route('/container/stop/{container}', name: 'app_container_stop')]
    public function stopContainer(Containers $container): Response {
        return new JsonResponse($this->appService->stopContainer($container));
    }

    #[Route('/container/restart/{container}', name: 'app_container_restart')]
    public function restartContainer(Containers $container): Response {
        return new JsonResponse($this->appService->restartContainer($container));
    }

    #[Route('/container/ask-delete/{container}', name: 'app_container_ask_delete')]
    public function askDeleteContainer(Containers $container): Response {
        return new Response("OK", 200);
    }

    #[Route('/container/ask-config/{container}', name: 'app_container_ask_config')]
    public function askConfigContainer(Containers $container): Response {
        return new Response("OK", 200);
    }
}