<?php namespace ubiqua\pbCortijoFontanilla;

// echo "Pono entorno de pruebas";
\ini_set('display_startup_errors', 1);
\ini_set('display_errors', 1);
\error_reporting(-1);

$app_server_root = realPath(__DIR__ );

$loader = require $app_server_root . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

// -----------------------------------------------------------------------------
// objetsc to be used
$ret_data = new ReturnData();
$mailer   = new Mailer();

// -----------------------------------------------------------------------------
// Counters
$total = 0;
$error = 0;
$ok    = 0;

// echo "request:<br>\n";
// print_r($_REQUEST);

define('CR', "\r");          // Carriage Return: Mac
define('LF', "\n");          // Line Feed: Unix
define('CRLF', "\r\n");      // Carriage Return and Line Feed: Windows
define('BR', '<br />' . LF); // HTML Break

define('COLUMNS_SEPARATOR', ';');

// Convert line enddibns to UNIX standard
$s = str_replace(CRLF, LF, $_REQUEST['content']);
$s = str_replace(CR, LF, $s);

$list_mails = \explode(LF, $s);

try {
  for ($row=0; $row<count($list_mails); $row++) {

    if (empty($list_mails[$row])) {
      continue;
    }

    $total++;
    $mailer->inicializar();

    $columns = \explode( COLUMNS_SEPARATOR, $list_mails[$row]);

    // eliminar las comillas, ya sean dobles y simples
    $name = substr($columns[0], 1 , -1);
    $email = substr($columns[1], 1 , -1);

    $ret_data->log ("Generando passbooks para " . $name . '<br />' . PHP_EOL);

    $ret_data->log (" - Enviando passbook generado a " . $email . '<br />' . PHP_EOL);
    try {

      $mailer->asunto('Passbooks Cortijo Fontanilla');
      $mailer->nuevoTo(array('mail' => $email , 'nombre' => $name));
      $mailer->textoNormal('Tenemos el placer de comunicarle que Cortijo Fontanillas le envía este passbook para su mayor disfrute y comodidad');
      $mailer->textoHTML('<p>Tenemos el placer de comunicarle que Cortijo Fontanillas le envía este passbook para su mayor disfrute y comodidad');
      // $mailer->adjuntar("fic_con_path_completo");

      $mailer->enviar();
      $ok++;

    } catch (Exception $e) {

      $error++;

    }
    $ret_data->addResponse(array(
      total   => $total,
      errors  => $errors,
      ok      => $ok
    ));

  }
} catch (Exception $e) {

  $ret_data->error->code = 5000;
  $ret_data->error->desc = 'Message could not be sent. Mailer Error: ' . $e->getMessage();

}

$ret_data->put();
