<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/app')]
class AppController extends AbstractController
{
    public function __construct(
        private HttpClientInterface $httpClient,
    )
    {}

    #[Route('/', name: 'app_app_index')]
    public function index(): Response {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        $userContainers = [];
        $requestUri = 'localhost:7000/v1/container?';
        foreach ($user->getContainers() as $container) {
            $requestUri = $requestUri . 'id=' . $container->getDockerId();
        }

        try {
            $response = $this->httpClient->request(
                'GET',
                $requestUri
            );
            $userContainers[] = $response->getContent();
        } catch (ClientExceptionInterface|TransportExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e) {
            dump($e);
        }

        return $this->render('app/index.twig', [
            'containers' => $userContainers,
        ]);
    }
}