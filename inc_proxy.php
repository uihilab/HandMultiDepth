<?php

	$url = $_GET['url']; 
	$mime = $_GET['mimetype'];
	header('Content-type: '.$mime);

	if ($_SERVER['HTTP_HOST']=='localhost') {
		readfile($url);
	} else {			
		// DC Proxy
		$opts = array('http' => array('proxy' => 'tcp://datactrproxy.iowa.uiowa.edu:8080', 'request_fulluri' => true));
		$context = stream_context_create($opts);
		$out = file_get_contents($url, False, $context);
		if ($out=='') $out = file_get_contents($url);
		echo $out;
	}

?>