<?php namespace ubiqua\pbCortijoFontanilla;

use PKPass\PKPass;
require('vendor/autoload.php');

abstract class Passbook2File extends Passbook {
  /* abstract string */ protected $output_folder = '';
// ===========================================================================
// ---------------------------------------------------------------------------
// @override
  public function create($id, $name, $direct_output = false) {

    try {
      $passbook = parent::create($id, $name, $direct_output);
      try {
        $out_file_name = $this->output_folder . DIRECTORY_SEPARATOR .
                          $id . '-' . date('Ymd') . '.pkpass';
        // echo "writting file $out_file_name\n";
        file_put_contents($out_file_name, $passbook);
      } catch(\Exception $e) {
        throw new \Exception("Error writing out file ($$out_file_name) => " . $e->getMessage(), 10200);
      }

    } catch(\Exception $e) {
      throw new \Exception($e->getMessage(), $e->getCode());
    }

  }

}
