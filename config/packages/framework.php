<?php

use Symfony\Config\FrameworkConfig;

return static function (FrameworkConfig $framework): void {
    $framework->errorController('App\Controller\ErrorController::show');
};
