<?php

namespace App\Form;

use App\Entity\Containers;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $user = $builder->getData();
        $builder
            ->add('email', EmailType::class, [
                'label' => 'user.email'
            ])->add('plainPassword', PasswordType::class, [
                'label' => 'user.password',
                'required' => false,
                'mapped' => false,
            ])->add('roles', ChoiceType::class, [
                'label' => 'admin.users.roles',
                'choices' => $options['roles'],
                'expanded' => true,
                'multiple' => true
            ])->add('containers', CollectionType::class, [
                'entry_type' => EntityType::class,
                'entry_options' => [
                    'class' => Containers::class,
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