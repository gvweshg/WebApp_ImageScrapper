
var latestParent;

function get_img_list()
{
	var listdiv = $("#htmlcontents img");
	var search_result = "";
	
	listdiv.each( function( i ){

		if( $(this).css('style') != "none" )
		{
			$(this).removeAttr("width");
			$(this).removeAttr("height");

//			if(this.width > 100)
//			{
				var margin_str 	= "";
				var img_dv		= "";

				var logic_height = this.height / this.width * 150;
				
				if(logic_height < 150)
				{
					var margin_val = (150 - logic_height) / 2;
					margin_str = "style='margin-top:" + margin_val + "px'";
				}

				img_dv = "<div class='overlay_image_class'><img src='" + this.src + "' " + margin_str + " class='imgcr_draggable ui-draggable'/></div>";
				
				if(search_result.indexOf(img_dv) == "-1")
					search_result += img_dv;
//			}
		}
	});
	
	return search_result;
}

function enter_descr(obj)
{
	latestParent	= $(obj).parent();

	var current_span= latestParent.find("span");
	var offset		= $(obj).offset();
	var parent_left= latestParent.offset().left + 5;
	
	var new_text = current_span.html();
	
	if(new_text == "Enter image description here.")
		new_text = "";
	
	$("#img_descr").val(new_text);
	$("#img_descr").css('left',parent_left + "px");
	$("#img_descr").css('top',offset.top + "px");
//	$("#img_descr").css('display',"inline");
	$("#img_descr").fadeIn(350);
	$("#img_descr").focus();
}

function set_descr()
{
	var img_tag = latestParent.find("img");
	var current_span = latestParent.find("span");
	var new_text = $("#img_descr").val();
	
	if(new_text == "")
		new_text = "Enter image description here.";
	
	$("#img_descr").fadeOut(350);
	
	img_tag.attr('alt',$("#img_descr").val())
	current_span.html(new_text);
}

function handleDropBackEvent( event, ui )
{
	var draggable = ui.draggable;
	var new_id = Math.round((new Date()).getTime() / 1000);
	var tmp_html = "";
	var span_tag = draggable.find("span");
	
	span_tag.remove();
	
	tmp_html = draggable.html();
	draggable.remove();
	
	$("#scraping_img_shower").html($("#scraping_img_shower").html() + "<div class='overlay_image_class' id='scrap_" + new_id + "' style='display:none;'>" + tmp_html + "</div>");
	
	$('#scrap_' + new_id).fadeIn('500');
	$('.overlay_image_class').draggable();
	
	set_dragImgCSS();
}

function handleDropImg_Event( event, ui )
{
	var draggable = ui.draggable;
	var new_id = Math.round((new Date()).getTime() / 1000);
	var tmp_html = ""
	var span_tag = draggable.find("span");
	
	span_tag.remove();
	
	tmp_html = draggable.html();
	tmp_html = tmp_html.replace("<br>","");
	
	draggable.remove();
	
	$("#scraping_img_placedrag").html($("#scraping_img_placedrag").html() + "<div class='overlay_image_class' id='scrap_" + new_id + "' style='display:none;'>" + tmp_html + "<br><span onclick='enter_descr(this);'>Enter image description here.</span>" + "</div>");
	
	$('#scrap_' + new_id).fadeIn('500');
	$('.overlay_image_class').draggable();
	
	set_dragImgCSS();
}

function set_dragableEnv()
{
	set_dragImgCSS();
	
	$('.overlay_image_class').draggable();
	
	$('#scraping_img_shower').droppable( {
    	drop: handleDropBackEvent
  	} );
  	
  	$('#scraping_img_placedrag').droppable({
  		drop: handleDropImg_Event
  	});
  	
//  	$('#scraping_img_placedrag').click(set_descr);
  	
  	$('#scrap_upload_btn').click(upload_images);
}

function set_dragImgCSS()
{
	$('.overlay_image_class').mousedown(function(){
		var pos = $(this).position();
		$(this).css('position','absolute');
		$(this).css('left',pos.left + "px");
		$(this).css('top',pos.top + "px");
		$(this).css('z-index',"55555");
		$(this).css('border-width',"1px 1px 1px 1px");
	});
	
	$('#scraping_img_placedrag').mouseover(function(){
		
		if($('#scraping_img_placedrag').html() != "")
		{
			var left = document.documentElement.offsetWidth - 150;
	
			$("#scrap_upload_btn").css('display',"inline");
			$("#scrap_upload_btn").css('left',left + 'px');
		}
	});
	
	$("#scrap_upload_btn").mouseover(function(){
		
			$("#scrap_upload_btn").css('display',"inline");
	});
	
	$('#scraping_img_placedrag').mouseout(function(){
		$("#scrap_upload_btn").css('display',"none");
	});
	
	$('.overlay_image_class').mouseup(function(){
		var pos = $(this).position();
		$(this).css('position','relative');
		$(this).css('left',"");
		$(this).css('top',"");
		$(this).css('z-index',"");
		$(this).css('border-width',"0px 1px 1px 0px");
	});
}

function upload_images()
{
	var listdiv = $( "#scraping_img_placedrag img" );
	var img_list = "";
	
	listdiv.each( function( i ){
		if( this.style.display != "none" )
		{
			img_list += this.src + "_1_" + this.alt + ",";
		}
	});
	
	window.open("http://jong.fantoon.com/img_scrap/upload.php?img_list=" + img_list,'Uploading','height=150,width=350');
	
	return;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
  	{
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
			alert(xmlhttp.responseText + "vvv");
	    }
  	}
  	
  	xmlhttp.open("POST","http://localhost/image_scrape/upload.php", true);
  	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("img_11list=" + img_list);
}