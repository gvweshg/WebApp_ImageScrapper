init_hunt();
var ua = navigator.userAgent.toLowerCase();
var Nexter = {cur: 0, base: Math.random(), name: 'framik'};

if (ua.indexOf(" chrome/") >= 0 || ua.indexOf(" firefox/") >= 0 || ua.indexOf(' gecko/') >= 0) {
	var StringMaker = function () {
		this.str = "";
		this.length = 0;
		this.append = function (s) {
			this.str += s;
			this.length += s.length;
		}
		this.prepend = function (s) {
			this.str = s + this.str;
			this.length += s.length;
		}
		this.toString = function () {
			return this.str;
		}
	}
} else {
	var StringMaker = function () {
		this.parts = [];
		this.length = 0;
		this.append = function (s) {
			this.parts.push(s);
			this.length += s.length;
		}
		this.prepend = function (s) {
			this.parts.unshift(s);
			this.length += s.length;
		}
		this.toString = function () {
			return this.parts.join('');
		}
	}
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
	var output = new StringMaker();
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output.append(keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4));
   }
   
   return output.toString();
}

function get_next_name()
{
	Nexter.cur++;
	return Nexter.name+Nexter.cur;
}

function get_victim()
{
     result = $("#victim").prop("value");
     if (-1 == result.indexOf('http://'))
     {
          result = 'http://'+result;
     }
     return result;
}
////////////////////////////////////////////////////////////////////////////

function go_hunt()
{
	name = get_next_name();
	$fr = $('<iframe name="'+name+'" src="proxy_call/?leech='+Nexter.base+'&q='+encode64(get_victim())+'">');
     $('body').append($fr);
	return false;	
}

function go_home()
{
     location.reload();
}
////////////////////////////////////////////////////////////////////////////

function inset_window_open()
{	
    $("#scraping_img_shower .overlay_image_class").show();
    $('#scraping_img_shower').css('width', '95%');
    $('#scraping_img_shower').css('height', '300px');
    
    $('#close').show();
    $('#button').show();
    $('#open').hide();
    $('#scraping_img_placedrag').show();
}
////////////////////////////////////////////////////////////////////////////

function inset_window_close()
{	
    $("#scraping_img_shower .overlay_image_class").hide();
    $('#scraping_img_shower').css('width', '200px');
    $('#scraping_img_shower').css('height', '50px');
    $('#close').hide();
    $('#button').hide();
    $('#open').show();
    $('#scraping_img_placedrag').hide();

}

function scraping_img_placedrag_button()
{
	var im = $(document).find("#scraping_img_placedrag .imgcr_draggable");
	var cimg = '';
	var i=0;
     var data = {};
	im.each(function(){
          var row = {src: $(this).attr('src'), desc: $(this).parent().find("._sy_img_caption").html()};
          data[i++] = row;
	});
     $("#scraping_img_placedrag button").html("Saving. Please wait...");
	$.ajax({
			url:    "saveimages/?user="+username,
			type:	"POST",
			cache:  false,
			contentType: "application/x-www-form-urlencoded; utf-8", 
			data: data,
      }).complete(function() {
                    $("#scraping_img_placedrag button").html("Save");
                    $("#_sy_see_div").show();
                    $("#scraping_img_placedrag .overlay_image_class").remove();
               }
      );
	return false;
}

function imgcr_save()
{
 	var im = $(document).find("#scraping_img_placedrag .imgcr_draggable");
 	
 	if(im.length > 0)
     {
 	    	$('#scraping_img_placedrag button').show();
     }
 	else    
     {
          $('#scraping_img_placedrag button').hide();
     }
}

function img_inset_init_ui()
{
     $('#scraping_img_shower').droppable({
             tolerance : 'pointer',
             accept : '.imgcr_draggable',
             drop : function(event, ui) 
             {
               var drag = $(ui.draggable).parent();
               drag.find("._sy_img_caption").hide();
               $(this).append(drag);
               imgcr_save(); 
             }
     });
     $('#scraping_img_placedrag').droppable({
             tolerance : 'pointer',
             accept : '.imgcr_draggable',
             drop : function(event, ui) {
               var drag = $(ui.draggable).parent();
               $(this).prepend(drag);
               drag.find("._sy_img_caption").show();
               imgcr_save(); 
          }
     });

     new_img = '<div class="overlay_image_class" style="float: left; z-index: 100000; margin: 5px;"><img class="imgcr_draggable" style="display: block; border: 1px dotted gray; margin: auto; height: 100px;"><div align="center" style="display: none; font-size: 10px; font-family: Verdana;" class="_sy_img_sizes"><span class="_sy_img_width">100</span>x<span class="_sy_img_height">100</span></div><div align="center" style="display: none; font-size: 12px; font-family: Verdana; width: 150px; margin: auto; padding: 2px; background-color: #FFE; overflow-x: auto;" class="_sy_img_caption">Enter image description here</div></div>';
      /////////////
     $("#_sy_see").click(function() {$("#scraping_img_placedrag form").submit()});
}
///////////////////////////////////////////////////////////////////////////////

var exists_images = {};

function _al_check_img(el, loaded, props)
{
     if (el.altered || ((loaded.height == props.height) && (loaded.width == props.width)))
     {
          return;
     }
     el.altered = true;
     $(el).attr("src", 'proxy_call/?q='+encode64(props['url']));
}
////////////////////////////////////////////////////////////////////////////

function _img_when_ready(el, props)
{
     var img = new Image();
     $(img).load(function(){_al_check_img(el, this, props)}).attr("src", el.src);
}
////////////////////////////////////////////////////////////////////////////

function add_grabbed_image(props)
{ 	
     if (exists_images[props.url])
     {
          return false;
     }

     sh = $("#scraping_img_shower");
     $elem = $(new_img);
     $elem.find('img').attr('src', props.url).error(function(){$(this).remove()}).load(function(){_img_when_ready(this, props)});
     $elem.find("._sy_img_width").html(props.width);
     $elem.find("._sy_img_height").html(props.height);
     $elem.find("._sy_img_sizes").show();
     
     sh.prepend($elem);
     exists_images[props.url] = 'true';
}
////////////////////////////////////////////////////////////////////////////

function remove_area(el)
{
     $el = $(el);
     $area = $el.parent().find("textarea");
     $el.html($area.prop("value")).show();
     $area.remove();
}
////////////////////////////////////////////////////////////////////////////

function change_caption(el)
{
     $el = $(el);
     el.store = $el.html();
     $area = $('<textarea style="width: 100%; height: 100%; z-index: 100002; postion: absolute;"></textarea>');
     $el.hide().parent().append($area);
     $area.html(el.store).focusout(function(){remove_area(el)});
     $area.focus().select();
}
////////////////////////////////////////////////////////////////////////////

function callback_prey(data)
{
     if (data.length)
     {
          st = data;
     }
     for (test_i=0; test_i<data.length; test_i++)
     {
          add_grabbed_image(data[test_i]);
     }
     $coll = $('.imgcr_draggable').not(".ui-draggable");
     
     $coll.draggable({
                helper : 'clone',
                appendTo: 'body',
                opacity : 0.3,
                zIndex: 200000
        });

     $("._sy_img_caption").not("._sy_img_caption_already").addClass("_sy_img_caption_already").click(function(){change_caption(this)});
     setTimeout("get_my_prey()", 1500);
}
////////////////////////////////////////////////////////////////////////////

function get_my_prey()
{
     $.getScript('prey/?leech='+Nexter.base);
}
////////////////////////////////////////////////////////////////////////////

function when_window_resize()
{
     all_height = $(window).height() - $("#scraping_img_shower").position().top - $("#scraping_img_placedrag").height() - 15;
     $("#scraping_img_shower").height(all_height);
}
////////////////////////////////////////////////////////////////////////////

function init_hunt()
{
	$("#hunt").click(go_hunt)
     $("#restart").click(go_home)
     $("#close").click(inset_window_close);
     $("#open").click(inset_window_open);
     $("#scraping_img_placedrag button").click(scraping_img_placedrag_button);
     img_inset_init_ui();
//     $(window).resize(when_window_resize);
     setTimeout("get_my_prey()", 500);
//     when_window_resize();
}

