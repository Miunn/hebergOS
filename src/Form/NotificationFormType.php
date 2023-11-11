<?php

namespace App\Form;

use App\Entity\Notifications;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NotificationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'notifications.form.title',
                'attr' => [
                    'placeholder' => 'notifications.form.title.placeholder'
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'notifications.form.description',
                'attr' => [
                    'placeholder' => 'notifications.form.description.placeholder'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Notifications::class
        ]);
    }
}