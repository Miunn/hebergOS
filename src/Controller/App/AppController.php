<?php

namespace App\Controller\App;

use App\Entity\User;
use App\Services\AppService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app')]
class AppController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService
    ) {}

    #[Route('/', name: 'app_app_index')]
    public function index(): Response {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        $userContainers = $this->appService->getUserContainers($user);
        dump($userContainers);
        return $this->render('app/index.twig', [
            'containers' => $userContainers,
        ]);
    }

    #[Route('/container/{container_id}', name: 'app_container')]
    public function container(string $container_id): Response {

        $stats = $this->appService->getContainerStats($container_id, 0);
        return $this->render('app/container-view.twig', [
            'stats' => $stats
        ]);
    }
}