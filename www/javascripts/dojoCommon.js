// This is a JavaScript file

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

//**************************************************************************
//* method      : limitedChar()
//* describe	: page check
//* parameter	: TxtValue,checkOK
//**************************************************************************
function limitedChar(TxtValue,checkOK){
	var checkStr = TxtValue;
	var allValid = true;
	var validGroups = true;
	for (i = 0;  i < checkStr.length;  i++){
		ch = checkStr.charAt(i);
		for (j = 0;  j < checkOK.length;  j++)
			if (ch == checkOK.charAt(j))
				break;
			if (j == checkOK.length){
				allValid = false;
			break;
		}
	}
	return allValid;
}

//**************************************************************************
//* method	    : limitedLength()
//* describe	: page check
//* parameter	: TxtValue,limitedLength
//**************************************************************************
function limitedLength(TxtValue,limitedLength){
	checkValue = true;
	if (TxtValue.length < limitedLength ){
		checkValue = false;
	}
	return checkValue ;
}	

//**************************************************************************
//* method	    : trim()
//* describe	: remove blank
//* parameter	: 
//**************************************************************************
function trim(s){
    var  i,b=0,e=s.length;  
    for(i=0;i<s.length;i++) 
         if(s.charAt(i)!=' '){b=i;break;}  
    if(i==s.length)  
        return  "";  
    for(i=s.length-1;i>b;i--)  
        if(s.charAt(i)!=' '){e=i;break;}  
    return  s.substring(b,e+1);  
}	

//**************************************************************************
//* method	    : doubleClick()
//* describe	: only a commit
//* parameter	: 
//************************************************************************** 
var press = "0"; 
function doubleClick() { 
	if (press =="0") { 
		press = "1"; 
		return true; 
	}else{ 
		alert("sytem already is accept, please wait for..."); 
	} 
	return false; 
} 

	//HTTPS廃止(簡単な暗号化) ADTEC.Zhanglili 2007/10/10 ADD START
	//**************************************************************************
	//* method	    : getJspEncode()
	//* describe	: JSPファイル用暗号化メソッド
	//* parameter	: elementId 変換対象項目のID
	//************************************************************************** 
	function getJspEncode(elementId){	
		var elementSize=document.getElementsByName(elementId).length;
		var theElementValue="";
		if(elementSize>1){
			for(i=0;i<document.getElementsByName(elementId).length;i++){
				if(document.getElementsByName(elementId)[i].checked){
					theElementValue = document.getElementsByName(elementId)[i].value;
					setEncodeElementValue(elementId,theElementValue);
					break;
				}
			}
		}else{
			theElementValue = document.getElementById(elementId).value;
			setEncodeElementValue(elementId,theElementValue);
		}
	}
	
	//**************************************************************************
	//* method	    : setEncodeElementValue()
	//* describe	: 暗号化メソッド(暗号になる値を返却する)
	//* parameter	: elementId 変換対象項目のID
	//*               elementValue 変換対象項目の値
	//************************************************************************** 
	function setEncodeElementValue(elementId,elementValue){
		var elementValueBefChg = elementValue;
		var elementValueAftChg = "";
		for(i=0;i<elementValueBefChg.length;i++){
			var eachValue = elementValueBefChg.charCodeAt(i);
			var eachEncodeValue = eachValue-7;
			if(i!=0){
				elementValueAftChg=elementValueAftChg+","+eachEncodeValue;
			}else{
				elementValueAftChg=eachEncodeValue;
			}
		}
		document.getElementById(elementId+"_hid").value=elementValueAftChg;
	}
	//HTTPS廃止(簡単な暗号化) ADTEC.Zhanglili 2007/10/10 ADD END
  
  
	//**************************************************************************
	//* method	    : getEncodeElementValue()
	//* describe	: 暗号化メソッド(暗号になる値を返却する)
	//* parameter	: elementValue 変換対象項目の値
  //* return    : elementValueAftChg 変換後の値
	//************************************************************************** 
	function getEncodeElementValue(elementValue){
		var elementValueBefChg = elementValue;
		var elementValueAftChg = "";
		for(i=0;i<elementValueBefChg.length;i++){
			var eachValue = elementValueBefChg.charCodeAt(i);
			var eachEncodeValue = eachValue-7;
			if(i!=0){
				elementValueAftChg=elementValueAftChg+","+eachEncodeValue;
			}else{
				elementValueAftChg=eachEncodeValue;
			}
		}
    return elementValueAftChg;
	}