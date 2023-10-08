<?php

namespace App\Controller\App;

use App\Services\AppService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app/admin')]
class AdminController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService
    ) {}

    #[Route('/', name: 'app_admin_index')]
    public function index(): Response
    {
        $containers = $this->appService->getContainers();
        return $this->render('app/admin/index.twig', [
            'containers' => $containers
        ]);
    }

    #[Route('/container/{container_id}', name: 'app_admin_container')]
    public function container(string $container_id): Response {

        $stats = $this->appService->getContainerStats($container_id, 0);
        return $this->render('app/container-view.twig', [
            'stats' => $stats
        ]);
    }
}