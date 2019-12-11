<?php namespace btacora\filessender;

$GLOBALS['logs'] = array();

// echo "Pono entorno de pruebas";
\ini_set('display_startup_errors', 1);
\ini_set('display_errors', 1);
\error_reporting(-1);

$app_web_root = realPath(
  __DIR__ . DIRECTORY_SEPARATOR .
  // '..'    . DIRECTORY_SEPARATOR .
  '..'
);

$loader = require $app_web_root . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

\PsLibs\entorno\Entorno::$Current = new \PsLibs\entorno\Entorno($app_web_root, __NAMESPACE__);

try {
  $mail = new BtacoraMailer();
  $mail->asunto('Prueba1');
  $mail->nuevoTo(array(
    // 'mail' => 'ggarcia@adiplustc.com',
    // 'nombre' => 'Gonzalo'
    'mail' => 'josealfonsoxperia@gmail.com',
    'nombre' => 'Jose Alfonso'

  ));
  $mail->nuevoTo(array(
    'mail' => 'ggarcia@adiplustc.com',
    'nombre' => 'Gonzalo'
  ));
  $mail->textoNormal('probando que es gerundio');
  $mail->textoHTML('<strong>probando que es gerundio</strong>');
  $mail->enviar();
} catch (Exception $e) {
  echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}
