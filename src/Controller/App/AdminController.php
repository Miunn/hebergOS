<?php

namespace App\Controller\App;

use App\Entity\Containers;
use App\Entity\User;
use App\Form\UserFormType;
use App\Services\AdminService;
use App\Services\AppService;
use App\Services\ContainerActivityService;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Role\RoleHierarchyInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use function Webmozart\Assert\Tests\StaticAnalysis\contains;

#[Route('/app/admin')]
class AdminController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService,
        private readonly AdminService $adminService,
        private readonly ContainerActivityService $containerActivityService,
        private readonly TranslatorInterface $translator,
        private readonly EntityManagerInterface $entityManager
    ) {}

    #[Route('/', name: 'app_admin_index')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $usersRepository = $entityManager->getRepository(User::class);
        $users = $usersRepository->findAll();
        $containers = $this->appService->getContainers();

        return $this->render('admin/index.twig', [
            'users' => $users,
            'containers' => $containers
        ]);
    }

    #[Route('/user/view/{user}', name: 'app_admin_view_user')]
    public function viewUser(Request $request, User $user, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager, RoleHierarchyInterface $roleHierarchy): Response
    {
        $form = $this->createForm(UserFormType::class, $user, ['roles' => $this->getParameter('security.role_hierarchy.roles')]);
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

            // Check in the update containers list if there is some to be deleted
            /*foreach ($originalContainers as $container) {
                if ($user->getContainers()->contains($container) === false) {
                    $container->getUsers()->removeUser($user);
                    $entityManager->persist($container);
                }
            }*/

            $entityManager->persist($user);
            $entityManager->flush();

            // Redirect to admin dashboard on save
            return $this->redirectToRoute('app_admin_index');
        }

        return $this->render('admin/user-view.twig', [
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
        return $this->render('admin/view/container-overview-admin.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'overview' => $overview
        ]);
    }

    #[Route('/container/stats/{container}', name: 'app_admin_container_stats')]
    public function containerStats(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        $stats = $this->appService->getStats($container, 'instant');
        return $this->render('admin/view/container-stats-admin.twig', [
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
        return $this->render('admin/view/container-shell-admin.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'shell' => "1"
        ]);
    }

    #[Route('/container/actions/{container}', name: 'app_admin_container_actions')]
    public function containerActions(Containers $container): Response {

        $containerApi = $this->appService->getContainer($container->getId());
        return $this->render('admin/view/container-actions-admin.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'actions' => "1"
        ]);
    }

    #[Route('/container/administration/{container}', name: 'app_admin_container_administration')]
    public function containerAdministration(Containers $container): Response {
        $containerApi = $this->appService->getContainer($container->getId());
        return $this->render('admin/view/container-administration-admin.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            "administration" => "1"
        ]);
    }

    /** AJAX Admin only routes */
    #[Route('/container/stats-json/{container}', name: 'app_admin_request_stats')]
    public function requestStats(Request $request, Containers $container): JsonResponse
    {
        $scale = $request->query->get('scale');

        if ($scale != 'instant' && $scale != 'day' && $scale != 'week') {
            return new JsonResponse(['error' => 'Bad scale'], 400);
        }

        return new JsonResponse($this->appService->getStats($container, $scale));
    }

    #[Route('/container/start/{container}', name: 'app_admin_container_start')]
    public function startContainer(Containers $container): Response {
        $response = $this->appService->startContainer($container);

        // Record in activities
        if ($response['success']) {
            $this->containerActivityService->recordActivity($container, $this->translator->trans('container.records.started'), new DateTimeImmutable(), $this->entityManager);
        }

        return new JsonResponse($response);
    }

    #[Route('/container/stop/{container}', name: 'app_admin_container_stop')]
    public function stopContainer(Containers $container): Response {
        $response = $this->appService->stopContainer($container);

        if ($response['success']) {
            $this->containerActivityService->recordActivity($container, $this->translator->trans('container.records.stopped'), new DateTimeImmutable(), $this->entityManager);
        }

        return new JsonResponse($response);
    }

    #[Route('/container/restart/{container}', name: 'app_admin_container_restart')]
    public function restartContainer(Containers $container): Response {
        $response = $this->appService->restartContainer($container);

        if ($response['success']) {
            $this->containerActivityService->recordActivity($container, $this->translator->trans('container.records.restarted'), new DateTimeImmutable(), $this->entityManager);
        }

        return new JsonResponse($response);
    }

    #[Route('/container/create', name: 'app_admin_container_create')]
    public function containerCreate(Request $request): Response {
        $name = $request->get('container-name');
        $basePort = $request->get('container-basePort');
        $memory = $request->get('container-memory');
        $cpu = $request->get('container-cpu');
        $ports = $request->get('container-ports');
        $commands = $request->get('container-image');

        if ($name == '' || $basePort == '' || $memory == '' || $cpu == '') {
            return new Response('Missing required fields', 400);
        }

        $ports = $ports == '' ? null: $ports;
        $commands = $commands == '' ? null: $commands;

        $result = $this->adminService->createContainer($name, $basePort, $memory, $cpu, $ports, $commands);

        return new JsonResponse($result, Response::HTTP_OK);
    }

    #[Route('/container/delete/{container}', name: 'app_admin_container_delete')]
    public function containerDelete(Containers $container): Response {
        return new JsonResponse($this->adminService->deleteContainer($container), Response::HTTP_OK);
    }
}