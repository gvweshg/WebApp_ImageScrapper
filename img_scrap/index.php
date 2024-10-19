<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
<head>
	<link href="css/style.css" type="text/css" rel="stylesheet" />
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js" language="javascript" type="text/javascript"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js" language="javascript" type="text/javascript"></script>
	<script src="js/scrape.js" language="javascript" type="text/javascript"></script>
</head>

<script language="javascript">
$(document).ready(function(){
	$("#grabbtn").click(grab_images);
});

function grab_images()
{
	var url = $("#grab_url").val();
	
	$("#loading_progress").css('display','inline');
	
	if($("#btn_tryagain").css('display') != "none")
	{
		$("#btn_tryagain").css('display','none');
	}
	
	$.ajax({
			type: "POST",
			url: "get_data.php", 
			data: ({url : url}),
			cache: false,
			success: function(html)
			{
				if(html == "")
				{
					$("#btn_tryagain").fadeIn(500);
					$("#loading_progress").css('display','none');
					return;
				}
				
				$("#htmlcontents").html(html);
				setTimeout("show_all()",500);
			}
	});
}

function show_all()
{
	var img_list = get_img_list();
	
	if(img_list == "")
		alert("Sorry! There aren't any images that have enough size on this url!");
		
	$("#scraping_img_shower").html(img_list);
	$("#loading_progress").css('display','none');	
	
	set_dragableEnv();
}
</script>

<body>
<div id="main">
	<div id="grab_header">
		<span>URL:</span><input type="text" id="grab_url">
		<input type="button" id="grabbtn" value="Grag images">
		<input type="button" id="resetbtn" value="Restart">
		<div id="loading_progress"><img src="img/loading-bar.gif"></div>
		<div id="btn_tryagain"><a href="javascript:grab_images();">We can't connect. Try again</a></div>
	</div>
	<div id="scraping_img_shower"></div>
	<div id="scraping_img_placedrag"></div>
	<div id="htmlcontents"></div>
	<input type='text' id='img_descr' onblur='set_descr(this);'>
	<div id='scrap_upload_btn'></div>
</div>
</body>
</html>