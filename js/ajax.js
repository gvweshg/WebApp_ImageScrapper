//****************************************************
//*********** GET방�?으로 전송하기
//****************************************************
function httpRequest( target_url, functionReference) {

	try {
		if( window.XMLHttpRequest ) {	// FireFox(2005.11현재 win용으로 var 1.0.7), Mac OS X �?� Safari 1.3, Opera 8.5�?서 �?�작
			http2Obj = new XMLHttpRequest();
		} else if( window.ActiveXObject) {	// IE�?서 �?�작. IE�?는 XMLHttpRequest오브�?트가 없다.
			http2Obj = new ActiveXObject( "Microsoft.XMLHTTP" );
		} else {
			http2Obj = false;
		}
	} catch( e ) {
		http2Obj = false;
	}
	if( !http2Obj ) {
		httpObjGenerateFail();
	}

	//timerId = setInterval( 'timeoutCheck()', 1000 );
	
	http2Obj.open( "GET", target_url, true );

	// onreadystatechange : 오브�?트�?� �?태가 변경�?�였�?� 때 fire�?�다.
	// 즉 여기서는 httpObj오브�?트�?� �?태가 변경�?�였�?� 때 어�? 함수를 호출하겠는가를 지정.
	http2Obj.onreadystatechange = function() {

		// readyState : request�?� 처리�?태를 표시하는 값.
		// 즉	0 : 미초기화�?태(오브�?트는 �?성�?� 있지만 open method는 호출�?�지 않�?� �?태)
		//		1 : request준비(open method는 호출�?�였지만 send methhod로 질문�?� 송신�?�지 않�?� �?태)
		//		2 : 질�?�완료(send method 로 질�?�는 송신�?�고 봉사기로 부터 �?�답�?� 기다리고 있는 �?태)
		//		3 : 수신중(봉사기로 부터 �?�답�?� 수신하고 있는 �?태. �?� 단계�?서는 수신한 �?료를 취급할수는 없다)
		//		4 : 수신완료(봉사기로 부터 모든 �?�답�?� 수신한 �?태.)
		// status : http protocol�?서 리용�?�는 �?�답코드.
		// 즉	200 : 정�?, 401 : unauthorised, 403 : Forbidden, 404 : Not Found, 500 : Internal Sever Error.
		// http2Obj.status(�?�답코드), http2Obj.statusText(�?�답메세지. 부�?�우저�? 따�?� �?� 값�?� undefind�?�수�?�)
		if ( http2Obj.readyState == 4 ) {
			//clearInterval( timerId);
			if ( http2Obj.status == 200 ) {
				functionReference( http2Obj.responseText );
			} else {
				alert( http2Obj.status + ':' + http2Obj.statusText );
				return false;
			}
		}
	}

	// GET�?� 경우�?는 봉사기�? 보내는 �?료가 없다. POST�?� 경우 �?�수를 리용하여 봉사기�? 보낼 �?료를 정�?�.
	http2Obj.send(null);
}

//콤보복스�? 서버�?서 보내온 정보를 현시
function server_requerst ( target_url, obj ) {

	var funcRef = function( msg ) {
		var array_list = msg.split("#");
		var count = array_list.length-1;

		//�?�미 들어가 있�?� 내용�?� 삭제하고
		var optgroups = obj.childNodes;
		for(i = optgroups.length - 1 ; i >= 0 ; i--)
		{
			obj.removeChild(optgroups[i]);
		}

		//새 항목�?� 추가한다
		//리스트복스�?� 처�?� 란�?� 비여있어야 함
		var new_node = document.createElement("option");
		
		try {
			obj.add(new_node, null); // standards compliant; doesn't work in IE
		}
		catch(ex) {
			obj.add(new_node); // IE only
		}

		new_node.text = '';
		new_node.value = 0;

		for (i=0; i<count; i++) {
			var new_node = document.createElement("option");

			var tmp_array_list =  array_list[i].split("|");
			var id = tmp_array_list[0];
			var val = tmp_array_list[1];

			//옵션한개 추가
			try {
				obj.add(new_node, null); // standards compliant; doesn't work in IE
			}
			catch(ex) {
				obj.add(new_node); // IE only
			}
			new_node.text = val;
			new_node.value = id;
		}
	}
	httpRequest( target_url, funcRef );
}

//****************************************************
//*********** POST방�?으로 전송하기
//****************************************************

function newXMLHTTP() {
	if(window.XMLHttpRequest) {
		try {
			xmlhttp = new XMLHttpRequest();
		} catch(e) {
			alert("XMLHTTP를 초기화할 수없습니다.");
			return false;
		}
	} else if(window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				alert("XMLHTTP를 초기화할수 없습니다.");
				return false;
			}
		}
	} else {
		alert("XMLHTTP를 초기화할수 없습니다.");
		return false;

	}
	return xmlhttp;
}

function postForm(obj, callback) {
	// XMLHTTP �?체 �?성
	var xmlhttp = newXMLHTTP();
	if(!xmlhttp) return false;

	var child = obj.elements;
	var data = new Array();
	for(i = 0; i < child.length;i++) {

		//�?� 관련 태그가 아닌 경우 무시
		if(child[i].tagName != "INPUT" && child[i].tagName != "TEXTAREA" && child[i].tagName != "SELECT") continue;

		//button 무시
		if(child[i].type == "submit" || child[i].type == "button" || child[i].type == "reset") continue;

		//CHECK, RADIO단추 처리
		if((child[i].type == "radio" || child[i].type == "checkbox") && !child[i].checked) continue;

		//text,password type�?� input�?�나 select�?서 required="required"�?�때 value가 없으면 오유
		if(child[i].getAttributeNode("required") && !child[i].value) {
			child[i].style.backgroundColor = "#FF9";
			child[i].focus();
			alert("해당 항목�?� 값�?� 없거나 잘못�?�였습니다.");
			return false;
		}

	   	data.push ( child[i].name+"="+child[i].value);

	}

	senddata = data.join("&");

	xmlhttp.open("POST", obj.action,true);
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlhttp.send(senddata);

	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				callback(xmlhttp); //콜백 함수로 수신
			} else {
				alert("�?료 전송중 오류가 발�?했습니다:\r\n\r\n"+xmlhttp.status+" "+xmlhttp.statusText);
			}
		}
	}
}
