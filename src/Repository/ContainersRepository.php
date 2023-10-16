<?php

namespace App\Repository;

use App\Entity\Containers;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Containers>
 *
 * @method Containers|null find($id, $lockMode = null, $lockVersion = null)
 * @method Containers|null findOneBy(array $criteria, array $orderBy = null)
 * @method Containers[]    findAll()
 * @method Containers[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContainersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Containers::class);
    }

    public function getUsedPortsRoot() {
        return $this->createQueryBuilder('C')
            ->select('C.hostPortRoot')
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Containers[] Returns an array of Containers objects
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

//    public function findOneBySomeField($value): ?Containers
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
