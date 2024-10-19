<?php
	ini_set("display_errors","0");
	echo '<span id="progress"><img src="img/loading-bar.gif" > Uploading...</span>';
	
	$error = 0;
	
	if(isset($_REQUEST['img_list']))
	{
		$img_arr = split(",",$_REQUEST['img_list']);
		
		for($i = 0; $i < count($img_arr); $i++)
		{
			if($img_arr[$i] != "")
			{
				$url_alt 		= split("_1_",$img_arr[$i]);
				$tmp_name_arr	= split("/",$url_alt[0]);
				$last_index		= count($tmp_name_arr) - 1;
				
				$file_name		= "uploads/".$url_alt[1]."_1_".$tmp_name_arr[$last_index];
				$img_contents	= file_get_contents($url_alt[0]);
				
				file_put_contents($file_name,$img_contents);
			}
		}
		
		echo "<font color='red' family='arial'><center>All files are successfully uploaded!</center></font>";
		echo "<br><br><center><a href='show_result.php'>View Images</a></center>";
		echo "<script>document.getElementById('progress').style.display = 'none';</script>";
	}

?>