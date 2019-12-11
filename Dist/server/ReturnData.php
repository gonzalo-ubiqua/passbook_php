<?php namespace ubiqua\pbCortijoFontanilla;

class ReturnData {
  public $error = 0;
  public $datos = '';
  public $logs = array();

  function __construct() {
    $this->error = new \stdClass();
    $this->error->code = 0;
    $this->error->desc = '';
  }

  // ---------------------------------------------------------------------------
  public function addResponse($dato) {
    // echo json_encode($dato);
    $this->datos = json_encode($dato);
  }

  // ---------------------------------------------------------------------------
  public function put() {
    echo json_encode($this);
  }

  // ---------------------------------------------------------------------------
  public function log($text) {
    array_push($this->logs, json_encode($text));
  }

}
