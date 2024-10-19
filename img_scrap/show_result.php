<?php
	$handle=opendir("uploads");
	$divs = "";
	$id = 0;
	$num = 0;

	$img_list = array();
	$final_list = array();
	
	while (($file = readdir($handle))!==false)
	{
		if(($file != '.') && ($file != '..') && ($file != 'Thumbs.db') && ($file != ''))
		{
			$lastModified = filemtime("uploads/".$file);
			$img_list[$file] = $lastModified;
		}			
	}
	
	asort($img_list);
	
	foreach ($img_list as $key=>$val)
	{
		$final_list[$num] = $key;
		$num ++;
	}
	
	for($i = $num; $i > -1; $i --)
	{
		if($final_list[$i] == "")
			continue;
			
		$descr_tmp = split("_1_",$final_list[$i]);
		
		$descr = $descr_tmp[0];
		
		if(($descr_tmp[1] == "") || ($descr_tmp[0] == "") || ($descr_tmp == "Enter image description here."))
			$descr = "&nbsp;";
		
		$divs .= "<div class='scrape_result col".$id."'><a href='#'><img src='uploads/".$final_list[$i]."'/></a><span>".$descr."</span></div>";	
		$id ++;
	}
?>
<html>
<head>
</head>
<script src="js/jquery-1.4.4.js" language="javascript" type="text/javascript"></script>
<script language="javascript">
jQuery(document).ready(function(){
//	window.resizeTo("800px", "600px");
	set_divcss();
	$(window).resize(resize_div);
});

function set_divcss()
{
	var win_width	= document.documentElement.offsetWidth;
	var win_height  = document.documentElement.offsetHeight;
	var num_per_row = parseInt(win_width * 1 / 207) - 1;
	
	var listdiv = $( ".scrape_result" );
	var colsleft	= 20;
	var colstop 	= 20;
	var counter	= 0;
	
	$("#main").css("height",win_height + "px");
	listdiv.each( function( i ){

		var org_id	= $(this).attr('class').replace('scrape_result col','');
		var new_id	= org_id * 1 % num_per_row;
		var real_max_row_num = num_per_row - 1;
		
		if(counter > real_max_row_num)
		{
			var colsdiv = $( ".col" + new_id + " img");
			colstop = 20;
			
			colsdiv.each( function( i ){
				colstop = colstop + (this.height * 1) + 75;
			});
		}

//		alert(colstop);
		$(this).css('left',colsleft + 'px');
		$(this).css('top',colstop + 'px');
		this.className = 'scrape_result col' + new_id;
		
		colsleft += 232;
		
		if(counter % num_per_row == real_max_row_num)
		{
			colsleft = 20;
		}
		
		counter ++;
	});
}

function resize_div()
{
	var listdiv = $( ".scrape_result" );
	var index 	= 0;
	
	listdiv.each( function( i ){
		this.className = 'scrape_result col' + index;
		index ++;
	});
	
	set_divcss();
}
</script>
<style>
body {background-color:#E8EBF2;}

.scrape_result
{
	width			: 192px;
	position		: absolute;
	border			: 1px solid #CDD1DD;
	padding			: 12px;
	background-color: white;
	color			: #596EA6;
	text-align		: center;
	overflow		: hidden;
}

.scrape_result span
{
	font-family		: Times New Roman;
	font-size		: 14px;
	line-height		: 35px;
}

#main {width:100%; margin:0 auto; min-height:500px; min-width:692px; position:relative;}

body div img {width: 192px; border:1px solid #9C9C9A;}
</style>
<body>
<div id="main">
	<?php echo $divs; ?>
</div>

</body>
</html>