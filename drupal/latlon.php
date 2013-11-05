<?php
echo '<form method="post">';
echo '<textarea name="address" rows="6" cols="40" onclick="this.focus();this.select()">';
echo 'address</textarea><br />';
echo '<input type="submit" value="Convert address to latitude longitude" />';
echo '</form><br />';

/**
 * uses Google geocoding api to convert user entered address
 * to latitude & longitude
 * https://developers.google.com/maps/documentation/geocoding/#JSON
 * @param  string $string is a user entered address
 * @return array         containing 'lat', 'lon'
 */
function addressConvert($string){

  /**
   * building address string for query to Google geocoding api
   * @var string
   */
  $geocodeURL = "http://maps.googleapis.com/maps/api/geocode/json?address=";
  //remove whitespaces
  $geocodeURL .= preg_replace('/\s/', '', $string);
  $geocodeURL .= "&sensor=false";

  // testing url
  // echo $geocodeURL . '<br /><br />';

  /**
   * fetch the JSON map information
   * @var [type]
   */
  $ch = curl_init();
  // sets URL to fetch
  curl_setopt($ch, CURLOPT_URL, $geocodeURL);
  // supress printing query results
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

  /**
   * array containing Google geocoding data for submitted address
   * execute curl command storing as array
   * @var array
   */
  $response = json_decode(curl_exec($ch), TRUE);

  // If Status Code is ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED or INVALID_REQUEST
  if ($response['status'] != 'OK') {
    return NULL;
  }

  // access lat & lon
  $location = $response['results'][0]['geometry']['location'];
  $latitude = $location['lat'];
  $longitude = $location['lng'];

  // FOR DEBUGGING ONLY
  // echo 'lat: ' . $latitude;
  // echo '<br /> <br />';
  // echo 'lon: ' . $longitude;

  $array = array(
    'lat' => $latitude,
    'lon' => $longitude,
  );

  return $array;
}

while (TRUE){
  if (isset($_POST['address'])){
    $results = addressConvert($_POST['address']);
    echo 'lat/lon ' . $results['lat'] . ' ' . $results['lon'] . '<br />';
    break;
  }
}
?>
