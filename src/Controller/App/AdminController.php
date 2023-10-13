<?php

namespace App\Controller\App;

use App\Entity\Containers;
use App\Entity\User;
use App\Form\UserFormType;
use App\Services\AdminService;
use App\Services\AppService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Role\RoleHierarchyInterface;

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

    #[Route('/user/view/{user}', name: 'app_admin_view_user')]
    public function viewUser(Request $request, User $user, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager, RoleHierarchyInterface $roleHierarchy): Response
    {
        $form = $this->createForm(UserFormType::class, $user, ['roles' => $roleHierarchy->getReachableRoleNames(['ROLE_ADMIN'])]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if ($form->get('plainPassword')->getData() != "") {
                $user->setPassword(
                    $userPasswordHasher->hashPassword(
                        $user,
                        $form->get('plainPassword')->getData()
                    )
                );
            }

            $entityManager->persist($user);
            $entityManager->flush();
        }

        return $this->render('app/admin/user-view.twig', [
            'userForm' => $form->createView(),
        ]);
    }

    #[Route('/user/delete/{user}', name: 'app_admin_delete_user')]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): Response
    {
        $this->adminService->deleteUser($user, $entityManager);
        return new Response("No Content", Response::HTTP_NO_CONTENT);
    }

    #[Route('/container/overview/{container}', name: 'app_admin_container_overview')]
    public function container(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        $overview = $this->appService->getContainer($container->getId());
        return $this->render('app/view/container-overview.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'overview' => $overview
        ]);
    }

    #[Route('/container/stats/{container}', name: 'app_admin_container_stats')]
    public function containerStats(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        $stats = $this->appService->getContainerStats($container->getId(), 0);
        return $this->render('app/view/container-stats.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'data' => $stats,
            'stats' => true
        ]);
    }

    #[Route('/container/shell/{container}', name: 'app_admin_container_shell')]
    public function containerShell(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        return $this->render('app/view/container-shell.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'shell' => "1"
        ]);
    }

    #[Route('/container/actions/{container}', name: 'app_admin_container_actions')]
    public function containerActions(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        return $this->render('app/view/container-actions.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'actions' => "1"
        ]);
    }

    /** AJAX Admin only routes */
    /** Go to AppController for basic routes */
    #[Route('/container/create', name: 'app_admin_container_create')]
    public function containerCreate(Request $request): Response {
        dump($request);

        dump($request->get('container-name'));
        return new Response("OK", Response::HTTP_NO_CONTENT);
    }
}