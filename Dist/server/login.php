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


//==============================================================================
//==============================================================================
class Login {


  public function validate($login_data) {
    $return_data = new ReturnData();

    try {

      $valid_logins = $this->readJSON();
      $usera = $login_data->user;
      $neededObject = null;
      foreach($valid_logins as $row) {
        if ( \strtoupper($row->user) === \strtoupper($usera) ) {
          $neededObject = $row;
        }
      }

      $ret = new \stdClass();
      $ret->valid = false;
      if ( $neededObject  ) {
        if ( $neededObject->pwd === $login_data->pwd ) {
          $ret->valid = true;
          $return_data->addResponse($ret);
        } else {
          $ret->valid = false;
          $return_data->error->code = 1010;
          $return_data->error->desc = "PWD error";
        }

      } else {
        $return_data->error->code = 1000;
        $return_data->error->desc = "User error";
      }
      $return_data->addResponse($ret);

      if ( $return_data->error->code > 1500 ) {
        throw new \Exception('Error user', $return_data->error->code);
      } else {

      }

    } catch (\Exception $e) {

      // throw new Exception($e->getMessage(), $e->getCode());
      $return_data->error = new \stdClass();
      $return_data->error->code = $e->getCode();
      $return_data->error->desc = $e->getMessage();
    }

    $return_data->put();

  }

  // ===========================================================================
  private function readJSON() {

    try {

      $data = file_get_contents('json/users.json');
      return json_decode($data);

    } catch (\Exception $e) {
      throw new Exception($e->getMessage(), $e->getCode());
    }

  }

}


$request = json_decode(file_get_contents('php://input'));
$login = new Login();
$login->validate(json_decode($request->params));
