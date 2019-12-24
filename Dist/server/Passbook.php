<?php namespace ubiqua\pbCortijoFontanilla;
          // https://github.com/tschoffelen/PHP-PKPass
use PKPass\PKPass;
require('vendor/autoload.php');

abstract class Passbook {
  /* abstract */ protected $client_name         = ''; // *
  /* abstract */ protected $client_p12_domain   = '';
  /* abstract */ protected $client_p12_cert     = ''; // *
  /* abstract */ protected $client_p12_cert_pwd = ''; // *
  // /* abstract */ protected $template_folder   = '';
  // /* abstract */ protected $style             = null;

  private $PKClass           = null;
  private $ubiqua_team_name	 = 'Ubiqua Instant Response S.L.';
  private $ubiqua_team_id		 = "SKYJ3N6G25";
  private $appleWWDRCA		   = __DIR__ . DIRECTORY_SEPARATOR .
                               'Certs' . DIRECTORY_SEPARATOR .
                               "AppleWWDRCA.cer";
	private $private_key			 = "20Ubiq2018";

  private $data              = array();
  private static $serial     = 1;

  function __construct(string $template_folder) {

    $this->PKClass = new PKPass($this->client_p12_cert, $this->client_p12_cert_pwd);
    $this->initDataStructure();
    $this->addTemplate($template_folder);
    // print_r($this->data);
    // $this->PKClass->setData($this->data);

  }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  public function create($id, $name, $direct_output = true) {

    $this->addPrimaryField("Name", $name, "l");
    $this->addSecondaryField("Member #", $id, "l");
    $this->data['barcodes'][0]['message'] = $id;

    try {
      $this->PKClass->setData($this->data);
      if(!($ret_data = $this->PKClass->create($direct_output))) {
        echo 'Error: ' . $this->PKClass->getError();
        throw new \Exception($this->PKClass->getError(), 10000);
      }
      return $ret_data;
    } catch(\Exception $e) {
      throw new \Exception($e->getMessage(), $e->getCode());
    }

  }

  // ===========================================================================
  // ---------------------------------------------------------------------------
  private function initDataStructure() {
    $this->data = [
        'description'         => $this->ubiqua_team_name . ' pass',
        'formatVersion'       => 1,
        'organizationName'    => $this->ubiqua_team_name,
        'passTypeIdentifier'  => $this->client_p12_domain,
        'serialNumber'        => self::$serial++,
        'teamIdentifier'      => $this->ubiqua_team_id,
        'boardingPass'        => [
            'primaryFields'   => array(),
            'secondaryFields' => array(),
            'backFields'      => array(),
            'transitType' => 'PKTransitTypeAir',
        ],
        'barcodes' => [
            'format' => 'PKBarcodeFormatQR',
            'message' => '',
            'messageEncoding' => 'UTF-8',
        ],
        // 'backgroundColor' => this.style.background_color,
        // 'foregroundColor' => this.style.foreground_color,
        // 'labelColor'      => this.style.label_color,
        'logoText'        => $this->ubiqua_team_name,
        'relevantDate'    => date('Y-m-d\TH:i:sP')
    ];

  }

  // ---------------------------------------------------------------------------
  protected function addPrimaryField($name, $value, $align='L' ) {

      array_push($this->data['generic']['primaryFields'], array(
        'key'     => $name,
        'label'   => $name,
        'value'   => $value,
        "textAlignment" => ($align ==='R' ? 'PKTextAlignmentRight' : "PKTextAlignmentLeft")
      ));

  }

  // ---------------------------------------------------------------------------
  protected function addSecondaryField($name, $value, $align ) {

      array_push($this->data['generic']['secondaryFields'], array(
        'key'     => $name,
        'label'   => $name,
        'value'   => $value,
        "textAlignment" => ($align ==='R' ? 'PKTextAlignmentRight' : "PKTextAlignmentLeft")
      ));

  }

  // ---------------------------------------------------------------------------
  protected function addBackField($name, $value, $align ) {

      array_push($this->data['generic']['backFields'], array(
        'key'     => $name,
        'label'   => $name,
        'value'   => $value,
        "textAlignment" => ($align ==='R' ? 'PKTextAlignmentRight' : "PKTextAlignmentLeft")
      ));

  }

  // ---------------------------------------------------------------------------
  // Add al png in the folder to current passbook
  protected function addTemplate(string $folder_name) {

    if ( \file_exists($folder_name) || \is_dir($folder_name) ) {

      // get all png files with a .txt extension.
      $json_name = $folder_name . DIRECTORY_SEPARATOR . 'pass.json';
      if ( \file_exists($json_name) ) {
        $this->data = json_decode (file_get_contents($json_name), true);
      }

      $imgs = glob($folder_name . DIRECTORY_SEPARATOR . "*.png");
      foreach($imgs as $img) {
        $this->PKClass->addFile($img);
      }

    } else {
      throw new \Exception("Template $folder_name not found", "10100");
    }

  }

}
