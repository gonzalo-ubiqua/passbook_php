<?php
$tabla_cuentas = array (
	'ubiqua'		    => array(
			'nombre_emisor'	=> "Cortijo Fontanilla",
	    'emisor' => 'ubiqua.developer@gmail.com',
	    'host' => 'smtp.gmail.com',
	    'port' => 587,
	    'auth' => 'true',
	    'username' => 'ubiqua.developer@gmail.com',
	    'password' => '20Ubiq2015',
	    // 'localhost' => 'btacora.com'
	  ),
		'mundofly'		    => array(
				'nombre_emisor'	=> "Btacora",
		    'emisor' => 'volar@mundofly.com',
		    'host' => 'smtp.mundofly.com',
		    'port' => 25,
		    'auth' => 'true',
		    'username' => 'volar@mundofly.com',
		    'password' => 'Pi31415!',
		    'localhost' => 'mundofly.com'
		  ),
	);
// $mail->SMTPSecure = 'tls';
$cuenta = 'ubiqua';

?>
