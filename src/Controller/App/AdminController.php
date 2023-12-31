<?php

namespace App\Controller\App;

use App\Entity\Containers;
use App\Entity\Notifications;
use App\Entity\User;
use App\Enum\ContainerActivityType;
use App\Form\ContainerFormType;
use App\Form\NotificationFormType;
use App\Form\UserFormType;
use App\Services\AdminService;
use App\Services\AppService;
use App\Services\ContainerActivityService;
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
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        $usersRepository = $entityManager->getRepository(User::class);
        $users = $usersRepository->findAll();
        $containers = $this->appService->getContainers();
        // Get all used root ports just after synchronization
        $containerRepository = $entityManager->getRepository(Containers::class);
        $usedPorts = $containerRepository->getUsedPortsRoot();

        $newContainer = new Containers();

        $newContainerForm = $this->createForm(ContainerFormType::class, $newContainer, ['usedPorts' => $usedPorts]);
        $newContainerForm->handleRequest($request);


        if ($newContainerForm->isSubmitted() && $newContainerForm->isValid()) {
            // API Call
            $result = $this->adminService->createContainer(
                $newContainerForm->get('name')->getData(),
                $newContainerForm->get('hostPortRoot')->getData(),
                $newContainerForm->get('memoryLimit')->getData(),
                $newContainerForm->get('cpuLimit')->getData()
            );

            if ($result['status'] !== 'success') {
                return new JsonResponse(['errors' => $result['message']], 400);
            }

            $newContainer->setId($result['data']['Id']);
            $newContainer->setName('/'.$newContainer->getName());
            $entityManager->persist($newContainer);
            $entityManager->flush();
            return new JsonResponse(['errors' => []], 201);
        } else if ($newContainerForm->isSubmitted() && !$newContainerForm->isValid()) {
            return new JsonResponse(['errors' => $newContainerForm->getErrors()], 400);
        }

        return $this->render('admin/index.twig', [
            'users' => $users,
            'containers' => $containers,
            'newContainerForm' => $newContainerForm->createView()
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
    public function containerActions(Containers $container, Request $request): Response {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        $containerApi = $this->appService->getContainer($container->getId());

        $newNotification = new Notifications();
        $newNotification->setUser($user);
        $newNotification->setContainer($container);
        $notificationForm = $this->createForm(NotificationFormType::class, $newNotification);
        $notificationForm->handleRequest($request);

        if ($notificationForm->isSubmitted() && $notificationForm->isValid()) {
            $this->entityManager->persist($newNotification);
            $this->entityManager->flush();
        }

        return $this->render('admin/view/container-actions-admin.twig', [
            'admin' => true,
            'container' => $container,
            'containerApi' => $containerApi,
            'actions' => "1",
            'notificationForm' => $notificationForm->createView(),
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

    #[Route('/container/notifications/{container}', name: 'app_admin_container_notifications')]
    public function containerNotifications(Containers $container): Response {
        $containerApi = $this->appService->getContainer($container->getId());

        return $this->render('admin/view/container-notifications-admin.twig', [
            'container' => $container,
            'containerApi' => $containerApi,
            'notifications' => '1',
     ]);
    }

    /** AJAX Admin only routes */

    #[Route('/container/change-domain/{container}', name: 'app_admin_change_domain')]
    public function changeDomain(Request $request, Containers $container): JsonResponse
    {
        $container->setDomain($request->request->get('domain'));
        $this->entityManager->persist($container);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'success']);
    }

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
            $this->containerActivityService->recordActivity($container, ContainerActivityType::STARTED, $this->translator->trans('container.records.started'));
        }

        return new JsonResponse($response);
    }

    #[Route('/container/stop/{container}', name: 'app_admin_container_stop')]
    public function stopContainer(Containers $container): Response {
        $response = $this->appService->stopContainer($container);

        if ($response['success']) {
            $this->containerActivityService->recordActivity($container, ContainerActivityType::STOPPED, $this->translator->trans('container.records.stopped'));
        }

        return new JsonResponse($response);
    }

    #[Route('/container/restart/{container}', name: 'app_admin_container_restart')]
    public function restartContainer(Containers $container): Response {
        $response = $this->appService->restartContainer($container);

        if ($response['success']) {
            $this->containerActivityService->recordActivity($container, ContainerActivityType::RESTARTED, $this->translator->trans('container.records.restarted'));
        }

        return new JsonResponse($response);
    }

    #[Route('/container/delete/{container}', name: 'app_admin_container_delete')]
    public function containerDelete(Containers $container): Response {
        return new JsonResponse($this->adminService->deleteContainer($container), Response::HTTP_OK);
    }

    #[Route('/container/config/{container}/memory', name: 'app_admin_container_config_memory')]
    public function containerConfigMemory(Containers $container, Request $request): Response
    {
        $value = $request->query->get('value');

        if ($value == null) {
            return new JsonResponse(['status' => 'error', 'message' => 'Missing value param'], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse($this->adminService->configMemoryContainer($container, $value), Response::HTTP_OK);
    }

    #[Route('/container/config/{container}/cpu', name: 'app_admin_container_config_cpu')]
    public function containerConfigCpu(Containers $container, Request $request): Response
    {
        $value = $request->query->get('value');

        if ($value == null) {
            return new JsonResponse(['status' => 'error', 'message' => 'Missing value param'], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse($this->adminService->configCpuContainer($container, $value), Response::HTTP_OK);
    }

    #[Route('/notifications/delete/{notification}', name: 'app_admin_delete_notification')]
    public function deleteNotification(Notifications $notification): Response {
        $this->entityManager->remove($notification);
        $this->entityManager->flush();

        return new Response("No Content", 204);
    }
}