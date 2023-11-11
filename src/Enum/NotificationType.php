<?php

namespace App\Enum;

enum NotificationType: string
{
    case CONTACT = "contact";
    case CREATE = "create";
    case CONTAINER_MEMORY = "container_memory";
    case CONTAINER_CPU = "container_cpu";
    case CONTAINER_DELETE = "container_delete";
}
