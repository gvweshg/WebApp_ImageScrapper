<?php

	ini_set("memory_limit","64M");
	ini_set("max_execution_time","10000");
	
	$html = get_contents($_REQUEST['url']);
	echo find_images($html);
	
	function get_contents($url)
	{
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);	// Pass HTTPS
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); 	// Pass HTTPS
	
		curl_setopt($ch, CURLOPT_POST      ,0);
	//	curl_setopt($ch, CURLOPT_POSTFIELDS    ,$postdata);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1);
		curl_setopt($ch, CURLOPT_HEADER      ,0);  // DO NOT RETURN HTTP HEADERS
		curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);  // RETURN THE CONTENTS OF THE CALL
	
		$html = curl_exec($ch);
		
		return $html;
	}
	
	function find_images($html)
	{
		$img_list = explode("<img",$html);
		$result = "";
		
		for($i = 0; $i < count($img_list); $i ++)
		{
			$img_str = $img_list[$i];
			
			if($start_pos = strpos($img_str,"src="))
			{
				$start_pos	= $start_pos + 4;
				$img_bracket= substr($img_str,$start_pos,1);
				$len		= strpos($img_str,$img_bracket,$start_pos + 2) - $start_pos - 1;
				$img_url	= substr($img_str,$start_pos + 1,$len);
				
				if(substr($img_url,0,4) != "http")
				{
					$url_array = parse_url($_REQUEST['url']);
					$img_url = $url_array['scheme']."://".$url_array['host']."/".$img_url;
				}
				
//				$img_url	= "<div class='overlay_image_class'><img src='".$img_url."' class='imgcr_draggable ui-draggable'/></div>";
				$result	.= "<img src='".$img_url."' class='imgcr_draggable ui-draggable'/>";
			}
		}
		
		return $result;
	}
?>