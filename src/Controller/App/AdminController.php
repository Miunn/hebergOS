<?php

namespace App\Controller\App;

use App\Entity\User;
use App\Services\AdminService;
use App\Services\AppService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/app/admin')]
class AdminController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService,
        private readonly AdminService $adminService
    ) {}

    #[Route('/', name: 'app_admin_index')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $usersRepository = $entityManager->getRepository(User::class);
        $users = $usersRepository->findAll();
        $containers = $this->appService->getContainers();
        return $this->render('app/admin/index.twig', [
            'users' => $users,
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

    #[Route('/delete/user/{user}', name: 'app_admin_delete_user')]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): Response
    {
        $this->adminService->deleteUser($user, $entityManager);
        return new Response("No Content", Response::HTTP_NO_CONTENT);
    }
}