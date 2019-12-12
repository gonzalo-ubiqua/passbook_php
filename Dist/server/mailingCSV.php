<?php namespace ubiqua\pbCortijoFontanilla;

// echo "Pono entorno de pruebas";
\ini_set('display_startup_errors', 1);
\ini_set('display_errors', 1);
\error_reporting(-1);

$app_server_root = realPath(__DIR__ );

$loader = require $app_server_root . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

define('CR', "\r");          // Carriage Return: Mac
define('LF', "\n");          // Line Feed: Unix
define('CRLF', "\r\n");      // Carriage Return and Line Feed: Windows
define('BR', '<br />' . LF); // HTML Break

define('COLUMNS_SEPARATOR', ';');

// =============================================================================
// =============================================================================
class PassBookManager {
  // objetsc to be used
  private $ret_data;
  private $mailer;

  private $total     = 0;
  private $errors_pb = 0;
  private $errors_ml = 0;
  private $ok        = 0;
  private $log       = array();

  // ===========================================================================
  function __construct($input) {

    $this->ret_data = new ReturnData();
    $this->mailer   = new Mailer();

    $data_list = $this->toArray( $this->convertToUnixEndLines($input) );
    $this->generatePassBooks($data_list);
    $this->sendMails($data_list);

    $this->ret_data->addResponse(array(
      'total'      => $this->total,
      'errors_pb'  => $this->errors_pb,
      'errors_ml'  => $this->errors_ml,
      'ok'         => $this->ok,
      'log'        => $this->log
    ));
    $this->ret_data->put();

  }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  // @return string
  private function convertToUnixEndLines($input_data) {

    $s = str_replace(CRLF, LF, $input_data);
    return  str_replace(CR, LF, $s);

  }

  // ---------------------------------------------------------------------------
  // @params
  //    input string
  // @return string
  private function toArray($input_data) {

    return \explode(LF, $input_data);

  }

  // ---------------------------------------------------------------------------
  // @params
  //    input array
  // @return void
  private function generatePassBooks($input_array) {
    for ($row=0; $row<count($input_array); $row++) {
      if (empty($input_array[$row])) {
        continue;
      }
      $this->total++;

      try {
        $columns = \explode( COLUMNS_SEPARATOR, $input_array[$row]);
        // eliminar las comillas, ya sean dobles y simples
        $name = substr($columns[0], 1 , -1);
        $email = substr($columns[1], 1 , -1);

        $sec = sprintf('%010u', ($row+1));


        // echo "java -cp passbook-1.0-jar-with-dependencies.jar me.compare.passbook.App $sec '$name'" . PHP_EOL;
        $output = '';
        exec("java -cp passbook-1.0-jar-with-dependencies.jar me.compare.passbook.App $sec '$name' 2> /dev/null", $output);
        // print_r($output);
        $last_response = array_pop($output);
        if ( $last_response !== 'Done!' ) {
          array_push($this->log, 'Error procesandao passbook para el usuario ' . $name . " => $last_response");
          $this->ret_data->log ( implode(PHP_EOL, $output) );
          $this->errors_pb++;
        }

      } catch (Exception $e) {

        $this->errors_pb++;

      }

    }
  }

  // ---------------------------------------------------------------------------
  // @params
  //    input array
  // @return void
  private function sendMails($input_array) {

    for ($row=0; $row<count($input_array); $row++) {
      if (empty($input_array[$row])) {
        continue;
      }

      try {

        $this->mailer->inicializar();

        $columns = \explode( COLUMNS_SEPARATOR, $input_array[$row]);

        // eliminar las comillas, ya sean dobles y simples
        $name = substr($columns[0], 1 , -1);
        $email = substr($columns[1], 1 , -1);

        // ----------------------------------
        // mail sending
        // ---------------------------------
        // $this->ret_data->log (" - Enviando passbook generado a " . $email . '<br />' . PHP_EOL);

        $this->mailer->asunto('Passbooks Cortijo Fontanilla');
        $this->mailer->nuevoTo(array('mail' => $email , 'nombre' => $name));
        $this->mailer->textoNormal('Tenemos el placer de comunicarle que Cortijo Fontanillas le envía este passbook para su mayor disfrute y comodidad');
        $this->mailer->textoHTML('<p>Tenemos el placer de comunicarle que Cortijo Fontanillas le envía este passbook para su mayor disfrute y comodidad');

        $sec = sprintf('%010u', ($row+1));
        $date = date('ymd');
        $passBook_file_name = realpath('.') . DIRECTORY_SEPARATOR .
            'pkpass_generated/CortijoFontanilla.pass' . DIRECTORY_SEPARATOR .
            "$sec-$date.pkpass";

        if ( ! file_exists($passBook_file_name) ) {
          // echo "error => No se encuentra el passbook $passBook_file_name\n";
          $this->ret_data->log ("error => No se encuentra el passbook $passBook_file_name\n");
          continue;
        }

        $this->mailer->adjuntarDoc( array(
          'fichero' => $passBook_file_name,
          'nombre'  => str_replace(' ', '_', $name) . '.passbook'
        ));
        // $this->mailer->enviar();

        unlink( $passBook_file_name );
        $this->ok++;

      } catch (Exception $e) {

        $this->errors_ml++;

      }

    }

  }

}

new PassBookManager($_REQUEST['content']);
// $file_pru = realPath('..') . DIRECTORY_SEPARATOR . 'prueba.csv';
// new PassBookManager(file_get_contents($file_pru));
