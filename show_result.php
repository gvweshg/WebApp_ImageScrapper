<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
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
		
		$exp_file = substr($final_list[$i],strlen($final_list[$i])-3,3);

		if($exp_file == "txt")
		{
			$contents = file_get_contents("uploads/".$final_list[$i]);
			$divs .= "<div id='".$id."' class='txtcon'><span>".$contents."</span></div>";
		}
		else
		{
			$descr_tmp = split("_1_",$final_list[$i]);
			$descr = $descr_tmp[0];
			
			if(($descr_tmp[1] == "") || ($descr_tmp[0] == "") || ($descr_tmp == "Enter image description here."))
				$descr = "&nbsp;";
			
			$divs .= "<div id='".$id."' class='imgcon'><a href='#'><img src='uploads/".$final_list[$i]."'/></a><span>".$descr."</span></div>";	
		}
		$id ++;
	}
?>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
<head>
</head>

<link href="css/align.css" type="text/css" rel="stylesheet" />
<script src="js/jquery-1.4.4.js" language="javascript" type="text/javascript"></script>
<script language="javascript">
jQuery(document).ready(function(){
//	window.resizeTo("800px", "600px");
//	$(window).resize(resize_div);
	arrange_div();
	layout_div();
	set_divcss();
});

var txtarr = new Array();
var imgWeqH = new Array();
var imgWltH = new Array();
var imgWgtH = new Array();

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

function set_divcss()
{
	var imgdv = $( "img" );
	
	imgdv.each( function( i ){
		if(this.width > this.height)
		{
			var new_width = $(this).parent().parent().css("width");
			new_width.replace("px","");
			
			new_width = new_width - 10;
			
			$(this).css("width",new_width + "px");
		}
	});
}
/*
function resize_div()
{
	var listdiv = $( ".scrape_result" );
	var index 	= 0;
	
	listdiv.each( function( i ){
		this.className = 'scrape_result col' + index;
		index ++;
	});
	
	set_divcss();
}*/

function arrange_div()
{
// creating lists
	var txtdiv = $(".txtcon");
	var imgdiv = $(".imgcon");
	
	txtdiv.each( function( i ){
		txtarr.push($(this).attr("id"));
	});
	
	imgdiv.each(function(i){
		var imgdv	= $(this).children().children();
		var width	= imgdv.attr("width");
		var height	= imgdv.attr("height");
		
		if((width / height > 0.83) && (width / height < 1.21))
			imgWeqH.push($(this).attr("id"));
			
		else if (width < height)
			imgWltH.push($(this).attr("id"));
			
		else if (width > height)
			imgWgtH.push($(this).attr("id"));
	});
}

function get_minnum()
{
	var chk_arr = new Array();
	
	if(txtarr.length > 0)
		chk_arr.push(txtarr[0]);
		
	if(imgWgtH.length > 0)
		chk_arr.push(imgWgtH[0]);
	
	if(imgWltH.length > 0)
		chk_arr.push(imgWltH[0]);
		
	if(imgWeqH.length > 0)
		chk_arr.push(imgWeqH[0]);
	
	ret_obj = chk_arr.min();
	
	return ret_obj;
}

function layout_div()
{
	var start_id	= "0";
	var notlay_num	= txtarr.length + imgWeqH.length + imgWltH.length + imgWgtH.length;
	var ret_str 	= "";
	
	while(notlay_num > 0)
	{
		var classid = get_class(start_id)
		var mode = select_mode(classid);
		
		ret_str += layout_mode(mode,start_id);
		
		start_id	= get_minnum();
		notlay_num	= txtarr.length + imgWeqH.length + imgWltH.length + imgWgtH.length;
	}

	$("#main").html(ret_str);
}

function layout_mode(mode_num,start_id)
{
	var ret_str = "";
	var tmp_str = "";

	switch (mode_num)
	{
		case 1://move first div to layout: copy html and delete div and then add to new div

			ret_str = "<div class='align layout1'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				ret_str += get_sublayHTML("eq",i)
			}			
				
			ret_str += "</div>";
		break;
		
		case 2:
			var req_style = "txt";
			
			ret_str = "<div class='align layout2'><div class='split1'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				if(i == 5)
					req_style = "lt";
				
				if(i == 4)
					ret_str += "</div><div class='split2'>";
					
				ret_str += get_sublayHTML(req_style,i);
			}			
			
			ret_str += "</div></div>";
		break;
		
		case 3:
			var req_style = "lt";
			
			ret_str = "<div class='align layout3'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 5; i++)
			{
				if(i == 4)
					req_style = "eq";
					
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div>";
		break;
		
		case 4:
			var req_style = "txt";
			
			ret_str = "<div class='align layout4'><div class='split1'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				if(i == 2)
					req_style = "eq";
				else if(i == 3)
				{
					req_style = "gt";
					ret_str += "</div><div class='split2'>"
				}
				else if(i == 4)
					req_style = "txt";
				else if(i == 5)
				{
					req_style = "lt";
					ret_str += "</div><div class='split3'>"
				}
				
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div></div>";
		break;
		
		case 5:
			var req_style = "eq";
			
			ret_str = "<div class='align layout5'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";

			for(var i = 2; i < 4; i++)
			{
				if(i == 3)
					req_style = "txt";
					
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div>";
		break;
		
		case 6:
			var req_style = "gt";
			
			ret_str = "<div class='align layout6'><div class='split1'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				if((i == 3) || (i == 4))
					req_style = "txt";
				else if(i == 5)
					req_style = "gt";		
					
				if(i == 3)
				{
					ret_str += "</div>"
				}
					
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div>";
		break;
		
		case 7:
			var req_style = "eq";
			
			ret_str = "<div class='align layout7'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div>";
		break;
		
		case 8:
			var req_style = "lt";
			
			ret_str = "<div class='align layout8'><div class='split1'>";
			tmp_str = $("#" + start_id).html();
			
			$("#" + start_id).remove();
			ret_str += "<div id='" + start_id + "' class='sub1'>" + tmp_str + "</div>";
			
			for(var i = 2; i < 6; i++)
			{
				if(i == 3)
				{
					req_style = "gt";
					ret_str += "</div><div class='split2'>"
				}
				else if(i == 4)
					req_style = "txt"
				else if(i == 5)
					req_style = "lt";
					
				ret_str += get_sublayHTML(req_style,i);
			}			
				
			ret_str += "</div></div>";
		break;
	}	
	
	return ret_str;
}

function get_sublayHTML(desire_class,index)
{
	var div_id	= select_subobj(desire_class);
	
	var html	= $("#" + div_id).html();

	$("#" + div_id).remove();
	return "<div id='" + div_id + "' class='sub" + index + "'>" + html + "</div>";
}

function select_subobj(require_class)
{
	switch(require_class)
	{
		case "txt":
			var ret_obj;
			
			if(txtarr.length > 0)
			{
				ret_obj = txtarr[0];
				txtarr.splice(0,1);
			}
			else
			{
				var chk_arr = new Array();
				
				if(imgWgtH.length > 0)
					chk_arr.push(imgWgtH[0]);
				
				if(imgWltH.length > 0)
					chk_arr.push(imgWltH[0]);
					
				if(imgWeqH.length > 0)
					chk_arr.push(imgWeqH[0]);
				
				ret_obj = chk_arr.min();
				
				if(ret_obj == imgWgtH[0])
					imgWgtH.splice(0,1);
					
				if(ret_obj == imgWltH[0])
					imgWltH.splice(0,1);
					
				if(ret_obj == imgWeqH[0])
					imgWeqH.splice(0,1);
			}
			
			return ret_obj;
		break;
		case "eq":
			var ret_obj;
			
			if(txtarr.length > 0)
			{
				ret_obj = imgWeqH[0];
				imgWeqH.splice(0,1);
			}
			else
			{
				var chk_arr = new Array();
				
				if(imgWgtH.length > 0)
					chk_arr.push(imgWgtH[0]);
				
				if(imgWltH.length > 0)
					chk_arr.push(imgWltH[0]);
					
				if(txtarr.length > 0)
					chk_arr.push(txtarr[0]);
				
				ret_obj = chk_arr.min();
				
				if(ret_obj == imgWgtH[0])
					imgWgtH.splice(0,1);
					
				if(ret_obj == imgWltH[0])
					imgWltH.splice(0,1);
					
				if(ret_obj == txtarr[0])
					txtarr.splice(0,1);
			}
			return ret_obj;
		break;
		case "gt":
			var ret_obj;
			
			if(imgWgtH.length > 0)
			{
				ret_obj = imgWgtH[0];
				imgWgtH.splice(0,1);
			}
			else
			{
				var chk_arr = new Array();
				
				if(txtarr.length > 0)
					chk_arr.push(txtarr[0]);
				
				if(imgWltH.length > 0)
					chk_arr.push(imgWltH[0]);
					
				if(imgWeqH.length > 0)
					chk_arr.push(imgWeqH[0]);
				
				ret_obj = chk_arr.min();
				
				if(ret_obj == txtarr[0])
					txtarr.splice(0,1);
					
				if(ret_obj == imgWltH[0])
					imgWltH.splice(0,1);
					
				if(ret_obj == txtarr[0])
					txtarr.splice(0,1);
			}
			
			return ret_obj;
		break;
		case "lt":
			var ret_obj;
			
			if(imgWltH.length > 0)
			{
				ret_obj = imgWltH[0];
				imgWltH.splice(0,1);
			}
			else
			{
				var chk_arr = new Array();
				
				if(imgWgtH.length > 0)
					chk_arr.push(imgWgtH[0]);
				
				if(txtarr.length > 0)
					chk_arr.push(txtarr[0]);
					
				if(imgWeqH.length > 0)
					chk_arr.push(imgWeqH[0]);
				
				ret_obj = chk_arr.min();
				
				if(ret_obj == imgWgtH[0])
					imgWgtH.splice(0,1);
					
				if(ret_obj == txtarr[0])
					txtarr.splice(0,1);
					
				if(ret_obj == txtarr[0])
					txtarr.splice(0,1);
			}
			
			return ret_obj;
		break;		
	}
}

function select_mode1(clss_name,sid)
{
	var rand_range	= 0;
	var index		= -1;
	
	switch(clss_name)
	{
		case "text": //1,4
			var rand_num = new Array(1,4);
			
			index		= Math.floor(Math.random()*2);
			
			return rand_num[index];
		break;
		
		case "equal"://2,3,6,8
			var rand_num = new Array(2,3,6,8);
			
			index		= Math.floor(Math.random()*4);
			
			return rand_num[index];
		break;
		
		case "less":
			return 8;
		break;
		
		case "greater"://2,5,6,7
			var rand_num = new Array(2,5,6,7);
			
			index		= Math.floor(Math.random()*4);
			
			return rand_num[index];
		break;
	}
}


function select_mode(clss_name)
{
	var rand_num	= new Array();
	var rand_range	= 0;
	var index		= -1;
	
	switch(clss_name)
	{
		case "text": //1,4
			if(get_numarr() > 2)
				rand_num.push(4);
			
			if(get_numarr() > 3)
				rand_num.push(1)
			
			if(rand_num.length == 0)
				return 20;//two split layout
			
			rand_range	= rand_num.length;
			index		= Math.floor(Math.random()*rand_range);			
			
			return rand_num[index];
		break;
		
		case "equal"://2,3,6,8
/*			if((get_numarr() > 0) && (txtarr.length > 2))
				rand_num.push(2);
				
			if((get_numarr() > 2) || ((get_numarr() + txtarr.length > 2) && (get_numarr() > 0)))
				rand_num.push(3);
				
			if((get_numarr() > 1) && (txtarr.length > 1))
				rand_num.push(6);
			
			if((get_numarr() > 2) && (txtarr.length > 0))
				rand_num.push(8);
*/
			if(get_numarr() + txtarr.length > 2)
				rand_num.push(3);
				
			if(get_numarr() + txtarr.length > 2)
			{
				rand_num.push(2);
				rand_num.push(6);
				rand_num.push(8);
			}
			
			if(rand_num.length == 0)
				return 20;//two split layout
				
			rand_range	= rand_num.length;
			index		= Math.floor(Math.random()*rand_range);			
			
			return rand_num[index];
		break;
		
		case "less":
			if((get_numarr() > 2) && (txtarr.length > 0))
				return 8;
			
			return 21;
		break;
		
		case "greater"://2,5,6,7
/*			if((get_numarr() > 0) && (txtarr.length > 2))
				rand_num.push(2);
			
			if((get_numarr() > 0) && (txtarr.length > 0))
				rand_num.push(5);
				
			if((get_numarr() > 1) && (txtarr.length > 1))
				rand_num.push(6);
				
			if((get_numarr() > 2) && (txtarr.length > 0))
				rand_num.push(7);
*/
			if(get_numarr() + txtarr.length > 1)
				rand_num.push(5);
			
			if(get_numarr() + txtarr.length > 3)
			{
				rand_num.push(2);
				rand_num.push(6);
				rand_num.push(7);
			}
						
			if(rand_num.length == 0)
				return 21;//two split layout
			
			rand_range	= rand_num.length;
			index		= Math.floor(Math.random()*rand_range);			
			
			return rand_num[index];
		break;
	}
}

function get_numarr()
{
	return imgWgtH.length + imgWltH.length + imgWeqH.length;
}

function get_class(element)
{
	for(i = 0; i < txtarr.length; i ++)
	{
		if(txtarr[i] == element)
		{
			txtarr.splice(i,1);//remove index
			return "text";
		}
	}
	
	for(i = 0; i < imgWeqH.length; i ++)
	{
		if(imgWeqH[i] == element)
		{
			imgWeqH.splice(i,1);
			return "equal";
		}
	}
	
	for(i = 0; i < imgWltH.length; i ++)
	{
		if(imgWltH[i] == element)
		{
			imgWltH.splice(i,1);
			return "less";
		}
	}
	
	for(i = 0; i < imgWgtH.length; i ++)
	{
		if(imgWgtH[i] == element)
		{
			imgWgtH.splice(i,1);
			return "greater";
		}
	}
	
	return 0;
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