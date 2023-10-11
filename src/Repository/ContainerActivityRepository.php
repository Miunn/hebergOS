<?php

namespace App\Repository;

use App\Entity\ContainerActivity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContainerActivity>
 *
 * @method ContainerActivity|null find($id, $lockMode = null, $lockVersion = null)
 * @method ContainerActivity|null findOneBy(array $criteria, array $orderBy = null)
 * @method ContainerActivity[]    findAll()
 * @method ContainerActivity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContainerActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContainerActivity::class);
    }

//    /**
//     * @return ContainerActivity[] Returns an array of ContainerActivity objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ContainerActivity
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
