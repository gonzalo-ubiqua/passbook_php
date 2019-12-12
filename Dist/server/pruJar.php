<?php
$jar_name = 'passbookMaven-1.0.jar';
exec("java -cp passbook-1.0-jar-with-dependencies.jar me.compare.passbook.App 001 pp", $output);


print_r($output);
?>
