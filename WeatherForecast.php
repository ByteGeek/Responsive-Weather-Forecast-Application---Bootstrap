<?php
header('Content-type: application/json');
$address = $_GET['address'];
$city = $_GET['city'];
$state = $_GET['state'];
$temperature = $_GET['temperature'];
$url = "https://maps.google.com/maps/api/geocode/xml?address=".$address.",".$city.",".$state."&key=AIzaSyCweOHIh0hjzOSDIIsyqnOoKmzN-5ut_VQ";
$sxml = simplexml_load_file($url);
if($sxml->status != "OK"){
   echo '<script language="javascript">';
   echo 'alert("Xml Error, Invalid Address")';
   echo '</script>';
   return;
}
//echo $sxml;
$latitude = $sxml->result->geometry->location->lat;
$longitude =$sxml->result->geometry->location->lng;

$forecastURL = "https://api.forecast.io/forecast/"."dcfddc5cc74ecb8dd37987be910d8073/".$latitude.",".$longitude."?units=".$temperature."&exclude=flags";
$json = file_get_contents($forecastURL); 
echo json_encode($json);
?>