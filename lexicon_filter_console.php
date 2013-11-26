<?php
set_time_limit(43200);
function put_file_contents($filename,$data){
  $f = @fopen($filename, 'w+');
  if (!$f) {
      return false;
  } else {
      $bytes = fwrite($f, $data);
      fclose($f);
      return $bytes;
  }
};
$myFile = file_get_contents('lexicon.js');
//remove trailing commas;
//$myFile=preg_replace('/,\s*([\]}])/m', '$1', $myFile);
//remove new lines;
//$myFile = str_replace(array("\n","\r"),"",$myFile);
//remove padding
//$myFile=preg_replace('/.+?({.+}).+/','$1',$myFile);
$myDataArr = json_decode($myFile);
var_dump($myDataArr);
$results=array();
foreach((array) $myDataArr as $rowcount => $row){
   foreach((array) $myDataArr as $nrowcount => $nrow){
     if(!isset($results[$rowcount]) && strcasecmp($rowcount,$nrowcount)!=0 && 
        (preg_match('/(\w*\W+.$rowcount.\W+\w*)|($rowcount)/',$nrowcount)==0 || preg_match('/(\w*\W+.$rowcount.\W+\w*)|($rowcount)/',$nrowcount)==false))
     {
        $results[$rowcount]=$row;
     }
   } 
}
//$myDataArr = json_encode(utf8_encode($results),true);
//put_file_contents('lexicon_out.js',$myDataArr);
?>
