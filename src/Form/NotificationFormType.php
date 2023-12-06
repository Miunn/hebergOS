<?php

namespace App\Form;

use App\Entity\Notifications;
use App\Enum\NotificationType;
use NumberFormatter;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
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
            ->add('value', NumberType::class, [
                'label' => 'notifications.value.label',
                'scale' => 2,
                'rounding_mode' => NumberFormatter::ROUND_UP
            ])
            ->add('description', TextareaType::class, [
                'label' => 'notifications.reason.label',
            ])
            ->add('type', ChoiceType::class, [
                'choices' => [
                    'memory' => NotificationType::CONTAINER_MEMORY,
                    'cpu' => NotificationType::CONTAINER_CPU,
                    'delete' => NotificationType::CONTAINER_DELETE,
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