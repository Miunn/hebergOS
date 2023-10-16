<?php

namespace App\Form;

use App\Entity\Containers;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ContainerFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $availablePorts = [
            10000,
            15000,
            20000,
            25000,
            30000,
            35000,
            40000,
            45000,
            50000
        ];
        $availablePorts = array_diff($availablePorts, ...$options['usedPorts']);
        $availablePorts = array_combine(array_values($availablePorts), array_values($availablePorts));

        $builder
            ->add('name', TextType::class, [
                'label' => 'admin.container.create.name',
                'constraints' => [
                    new NotBlank()
                ]
            ])
            ->add('hostPortRoot', ChoiceType::class, [
                'label' => 'admin.container.create.basePort',
                'choices' => $availablePorts,
                'multiple' => false,
                'expanded' => false
            ])
            ->add('memoryLimit', NumberType::class, [
                'label' => 'admin.container.create.memory'
            ])
            ->add('cpuLimit', NumberType::class, [
                'label' => 'admin.container.create.cpu'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Containers::class,
            'usedPorts' => [],
        ]);
    }

}