<?php namespace ubiqua\pbCortijoFontanilla;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
// use PHPMailer\PHPMailer\OAuth;
// use League\OAuth2\Client\Provider\Google;
//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Europe/Andorra');


class Mailer {
  // Funciona ok con "ISO-8859-15" y "UTF-8"
  // NO va del todo bien con "ISO8859-2" (en vez de ñ pone n acentuada (ń)
  public $codificacion = "ISO-8859-15";
  private $mail;
  private $nombre_emisor = "";


  function __construct() {
    require dirname(__FILE__) . "/mail.inc.php";
    $info_conexion = $tabla_cuentas[$cuenta];

    $this->nombre_emisor = $info_conexion['nombre_emisor'];

    $this->mail = new PHPMailer(true);                       // Passing `true` enables exceptions
    $this->mail->CharSet = $this->codificacion;
    // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $this->mail->isSMTP();                                      // Set mailer to use SMTP

    //$this->mail->SMTPDebug = 2;
    $this->mail->setLanguage('es');

    $this->mail->Host			  = $info_conexion['host'];
    $this->mail->SMTPAuth	  = $info_conexion['auth'];                               // Enable SMTP authentication
    // $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    // $this->mail->SMTPSecure = 'SSL';
    $this->mail->Username	  = $info_conexion['username'];
    $this->mail->Password	  = $info_conexion['password'];                // SMTP password

    if ( isset($info_conexion['port']) && $info_conexion['port'] !== null ) {
      $this->mail->Port	= $info_conexion['port'];
    }

    $this->mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    $this->mail->addReplyTo( $info_conexion['emisor'] , $this->nombre_emisor);

    $this->from( array(
      'mail' 		=> $info_conexion['emisor']
    ,	'nombre'	=> $this->nombre_emisor
    ));
  }

  public function inicializar() {
    $this->mail->clearAllRecipients(); // Elimina los To, CC y BCC
    $this->mail->clearAttachments();
    $this->mail->clearReplyTos();
    $this->mail->clearCustomHeaders();
  }

  // $quien_envia es un array con mail y nombre
  public function from($quien_envia) {
    //$this->mail->From		= $quien_envia['mail'];
    //$this->mail->FromName	= $quien_envia['nombre'];
    $this->mail->setFrom(
      $quien_envia['mail']
    ,	$quien_envia['nombre']
    ,	false
    );
  }

  public function responderA($quien_remite) {

    if ( ! isset($quien_remite['nombre']) ) {
      $quien_remite['nombre'] = null;
    }

    $this->mail->addReplyTo( $quien_remite['mail'], $quien_remite['nombre']);
  }

  public function mostrarError() {
    return $this->mail->ErrorInfo;
  }

  public function nuevoTo($a_quien_envia) {
    // print_r($a_quien_envia['mail']);
    $this->mail->addAddress($a_quien_envia['mail'], $a_quien_envia['nombre']);
  }

  public function nuevoCC($a_quien_envia) {
    $this->mail->addCC($a_quien_envia['mail'], $a_quien_envia['nombre']);
  }

  public function nuevoBCC($a_quien_envia) {
    $this->mail->addBCC($a_quien_envia['mail'], $a_quien_envia['nombre']);
  }

  public function adjuntarDoc($doc_con_path_completo) {
    //var_dump($doc_con_path_completo);
    $this->mail->addAttachment($doc_con_path_completo["fichero"], $doc_con_path_completo["nombre"]);
  }

  public function textoHTML($texto) {
    $this->mail->isHTML(true);
    $this->mail->Body = $this->textoEnCodificacion($texto);

  }

  public function asunto($texto) {
    $this->mail->Subject = $this->textoEnCodificacion($texto);
  }
  public function textoNormal($texto) {
    $this->mail->AltBody = $this->textoEnCodificacion($texto);
  }
  public function enviar() {
    try {
      return $this->mail->send();
    } catch (\Exception $e) {
      // print_r($this->mail->ErrorInfo);
      // print_r($e);
      throw new \Exception('Message could not be sent. Mailer Error: ' . $this->mail->ErrorInfo, 5000);

    }
  }

  public function getError() {
    return $this->mail->ErrorInfo;
  }

  protected function textoEnCodificacion($texto) {
//  			$codificacion_actual = mb_detect_encoding($texto);
//  			echo "codificacion_actual=$codificacion_actual\n";

    if ( $this->codificacion == "UTF-8") {
      if ( $this->esUTF8($texto)) {
        return $texto;
      } else {
        return utf8_encode($texto);
      }
    } else {
      // No lo queremos en UTF-8
      if ( $this->esUTF8($texto)) {
        // Es utf-8, convertimos
        return utf8_decode($texto);
      } else {
        return $texto;
      }

    }

  }

  protected function esUTF8($str) {
      return (bool) preg_match('//u', $str);
  }
}



?>
