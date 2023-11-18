<?php

namespace App\Enum;

enum ContainerActivityType: string
{
    case STARTED = "started";
    case RESTARTED = "restarted";
    case STOPPED = "stopped";
}
