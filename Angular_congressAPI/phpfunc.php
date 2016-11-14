<?php

# we want text output for debugging. Either this works or you need to look into
# source in your browser (or even better, debug with the `curl` commandline client.)
//header('Content-Type: text/plain');

# For quick and dirty debugging - start to tell about if something is worth
# to warn or notice about. (do logging in production)
//error_reporting(~0); ini_set('display_errors', 1);

error_reporting(0);


	//var_dump($_GET);
	$dbtype = $_GET['dbtype'];
	$bio_id = $_GET['bio_id'];
	$bill_id = $_GET['bill_id'];

	$base_url = "http://104.198.0.197:8080/";
	$api_key="&apikey=7856a616226d46818903c54d0f3de707";

	// congress.api.sunlightfoundation.com/legislators?query=boxer&apikey=7856a616226d46818903c54d0f3de707

	function getData($url){
		$json = file_get_contents($url);
		$data = json_decode($json, true);
		return $data;

	}

	function getSomeData(){
		echo '{"results": "use dbtype as legislators or bills or comm"}';
	}

	//call the functions as per the data passed form html page
	if($dbtype == 'legislators-all'){
		//call the api for fetching data related to legislature
		$url = $base_url . "legislators?per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'legislators-house') {
		$url = $base_url . "legislators?chamber=house&per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'legislators-senate') {
		$url = $base_url . "legislators?chamber=senate&per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'bills-active') {
		$url = $base_url . "bills?history.active=true&per_page=50" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'bills-new') {
		$url = $base_url . "bills?history.active=false&per_page=50" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'comm_house'){
		$url = $base_url . "committees?chamber=house&per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'comm_senate'){
		$url = $base_url . "committees?chamber=senate&per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'comm_joint'){
		$url = $base_url . "committees?chamber=joint&per_page=all" . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'legislators-details' && $bio_id!=""){
		$url = $base_url . "legislators?bioguide_id=" . $bio_id . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'legislators-committees' && $bio_id!=""){
		$url = $base_url . "committees?per_page=5&member_ids=" . $bio_id . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'legislators-bills' && $bio_id!=""){
		$url = $base_url . "bills?per_page=5&sponsor_id=" . $bio_id . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}elseif($dbtype == 'bill_details' && $bill_id!="") {
		$url = $base_url . "bills?bill_id=" . $bill_id . $api_key;
		$json = json_encode(getData($url));
		echo $json;
	}else{
		getSomeData();
	}

	//bills?bill_id=

	$states = array(
		'Alabama'=>'AL',
		'Alaska'=>'AK',
		'Arizona'=>'AZ',
		'Arkansas'=>'AR',
		'California'=>'CA',
		'Colorado'=>'CO',
		'Connecticut'=>'CT',
		'Delaware'=>'DE',
		'District Of Columbia'=>'DC',
		'Florida'=>'FL',
		'Georgia'=>'GA',
		'Hawaii'=>'HI',
		'Idaho'=>'ID',
		'Illinois'=>'IL',
		'Indiana'=>'IN',
		'Iowa'=>'IA',
		'Kansas'=>'KS',
		'Kentucky'=>'KY',
		'Louisiana'=>'LA',
		'Maine'=>'ME',
		'Maryland'=>'MD',
		'Massachusetts'=>'MA',
		'Michigan'=>'MI',
		'Minnesota'=>'MN',
		'Mississippi'=>'MS',
		'Missouri'=>'MO',
		'Montana'=>'MT',
		'Nebraska'=>'NE',
		'Nevada'=>'NV',
		'New Hampshire'=>'NH',
		'New Jersey'=>'NJ',
		'New Mexico'=>'NM',
		'New York'=>'NY',
		'North Carolina'=>'NC',
		'North Dakota'=>'ND',
		'Ohio'=>'OH',
		'Oklahoma'=>'OK',
		'Oregon'=>'OR',
		'Pennsylvania'=>'PA',
		'Rhode Island'=>'RI',
		'South Carolina'=>'SC',
		'South Dakota'=>'SD',
		'Tennessee'=>'TN',
		'Texas'=>'TX',
		'Utah'=>'UT',
		'Vermont'=>'VT',
		'Virginia'=>'VA',
		'Washington'=>'WA',
		'West Virginia'=>'WV',
		'Wisconsin'=>'WI',
		'Wyoming'=>'WY'
	);



 ?>
