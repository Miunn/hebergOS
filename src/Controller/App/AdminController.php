<?php

namespace App\Controller\App;

use App\Entity\Containers;
use App\Entity\User;
use App\Form\UserFormType;
use App\Services\AdminService;
use App\Services\AppService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        $containers = $this->appService->getContainers($entityManager);

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

    #[Route('/container/{container_id}', name: 'app_admin_container')]
    public function container(string $container_id): Response {

        $stats = $this->appService->getContainerStats($container_id, 0);
        return $this->render('app/container-view.twig', [
            'stats' => $stats
        ]);
    }

    #[Route('/user/delete/{user}', name: 'app_admin_delete_user')]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): Response
    {
        $this->adminService->deleteUser($user, $entityManager);
        return new Response("No Content", Response::HTTP_NO_CONTENT);
    }
}