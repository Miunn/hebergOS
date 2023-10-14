<?php

namespace App\Form;

use App\Entity\Containers;
use App\Entity\User;
use RecursiveArrayIterator;
use RecursiveIteratorIterator;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $roles = $options['roles'];
        $rolesFlat = [];
        foreach ($roles as $roleParent=>$roleHerit) {
            $rolesFlat[$roleParent] = $roleParent;

            foreach ($roleHerit as $herit) {
                $rolesFlat[$herit] = $herit;
            }
        }
        dump($rolesFlat);

        $builder
            ->add('firstname', TextType::class, [
                'label' => 'user.firstname'
            ])
            ->add('lastname', TextType::class, [
                'label' => 'user.lastname'
            ])
            ->add('email', EmailType::class, [
                'label' => 'user.email'
            ])->add('plainPassword', PasswordType::class, [
                'label' => 'user.password',
                'required' => false,
                'mapped' => false,
                'attr' => [
                    'placeholder' => 'admin.users.password.placeholder'
                ]
            ])->add('roles', ChoiceType::class, [
                'label' => 'admin.users.roles',
                'choices' => $rolesFlat,
                'expanded' => true,
                'multiple' => true
            ])->add('containers', CollectionType::class, [
                'entry_type' => EntityType::class,
                'entry_options' => [
                    'class' => Containers::class,
                    'label' => false,
                    'choice_label' => 'name',
                    'choice_value' => 'id',
                ],
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'prototype' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'roles' => [],
        ]);
    }

}