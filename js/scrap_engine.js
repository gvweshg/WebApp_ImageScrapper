import_jquery_ajax_file();
initiallize_scraping();
set_css();
setTimeout("import_js_file()",500);

function initiallize_scraping()
{	//set overlay mask!
	if(!document.getElementById("scraping_overlay"))
	{
		var left	= (document.documentElement.offsetWidth - 44) / 2;
		
		document.body.innerHTML += "<div id='scraping_overlay'></div>";
		document.body.innerHTML += "<div id='scraping_loadingimg' style='left:" + left + "px;top:150px;'></div>";
		
		window.scrollTo(0,0);
	}
}

function import_jquery_ajax_file()
{
	var jqueryajax=document.createElement('script');
	jqueryajax.setAttribute('type','text/javascript');
	jqueryajax.setAttribute('charset','UTF-8');
	
	jqueryajax.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js');
	document.body.appendChild(jqueryajax);
}

function import_js_file()
{
	var imjs=document.createElement('script');
	imjs.setAttribute('type','text/javascript');
	imjs.setAttribute('charset','UTF-8');
	
	imjs.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js');
	document.body.appendChild(imjs);
	
	setTimeout("start_scraping()",500);
}

function set_css()
{
	if(document.createStyleSheet)
	{
		document.createStyleSheet('http://jong.fantoon.com/css/image_overlay.css');
	}
	else
	{
		var styles = "@import url('http://jong.fantoon.com/css/image_overlay.css');";
		var newSS=document.createElement('link');
		newSS.rel='stylesheet';
		newSS.href='data:text/css,'+escape(styles);
		document.getElementsByTagName("head")[0].appendChild(newSS);
	}
}

function stop_scraping()
{
	$("#scraping_overlay").remove();
	$("#scraping_overlay_body").remove();
}

function start_scraping()
{
	var img_list = get_img_list();
	
	$("#scraping_loadingimg").remove();
	
	if( img_list == "")
	{
		$("#scraping_overlay").remove();
		alert("Sorry! There aren't any images or videos that have enough image size.");
		return;
	}
	
	if(document.getElementById("scraping_overlay_body") && ($("#scraping_overlay_body").css("display") != "none"))
		return;
	
	set_mainStructure();
	show_imglist(img_list);
	
	set_dragableEnv();
}

function set_mainStructure()
{
	/* display search result */
	document.body.innerHTML += "<div id='scraping_overlay_body'><div id='scraping_overlay_header'><a href='javascript:stop_scraping();' id='close_overlay'>Close Image Scrapping</a></div><div id='scraping_img_shower'><div id='scrapping_overlay_mark'>Image Scrapping</div></div><div id='scraping_img_placedrag' class='ui-droppable'></div><div id='scrap_upload_btn'></div><input type='text' id='img_descr' onblur='set_descr(this);'><div id=sitedescr></div>";
	
	/* set main css */
	var clientHeight	= $(window).height;
	var img_showHeight	= clientHeight / 2;
	var result_Height	= clientHeight - img_showHeight - 55;
	
	$("#scraping_img_shower").css("height",img_showHeight + "px");
	$("#scraping_img_placedrag").css("height",result_Height + "px");
	
	var site_descr = $('meta[name=description]').attr("content");
	alert(site_descr);
	$("#sitedescr").css("color","red");
	$("#sitedescr").html(site_descr);	
}

function show_imglist(img_list)
{
	document.getElementById("scraping_img_shower").innerHTML += img_list;
}

function get_img_list()
{
	var listdiv = $( "img" );
	var search_result = "";
	
	listdiv.each( function( i ){
		if( $(this).css('style') != "none" )
		{
			$(this).removeAttr("width");
			$(this).removeAttr("height");

			if(this.width > 100)
			{
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
			}
		}
	});
	
	return search_result;
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

var latestParent;

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
			var left = document.documentElement.offsetWidth - 100;
	
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
	
	window.open("http://jong.fantoon.com/upload.php?img_list=" + img_list,'Uploading','height=150,width=350');
	
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
  	
  	xmlhttp.open("POST","http://jong.fantoon.com/upload.php", true);
  	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("img_11list=" + img_list);
}