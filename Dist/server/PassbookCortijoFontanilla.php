<?php namespace ubiqua\pbCortijoFontanilla;
require('vendor/autoload.php');

class PassbookCortijoFontanilla extends Passbook2File {
  protected $client_name          = 'Cortijo Fontanilla';
  protected $client_p12_domain    = 'pass.cortijo.fontanilla.me.123compare';
  protected $client_p12_cert      = __DIR__ . DIRECTORY_SEPARATOR . 'Certs/pass.cortijo.fontanilla.me.123compare.p12';
  protected $client_p12_cert_pwd  = '20Ubiq2018';
  /* abstract string */ protected $output_folder = __DIR__ . DIRECTORY_SEPARATOR .
                  'pkpass_generated' . DIRECTORY_SEPARATOR .
                  'CortijoFontanilla.pass';

}
