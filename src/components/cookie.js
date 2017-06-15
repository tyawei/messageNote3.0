
function HandleCookie() {
	this.setCookie=function(cname, cvalue, exdays) {  
	    var d = new Date();  
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));  
	    var expires = "expires="+d.toString();  
	    document.cookie = cname + "=" + cvalue + "; " + expires;  
	} 

	this.getCookie=function(cname) {
		var name = cname + "=";  
	    var ca = document.cookie.split(';');  
	    for(var i=0; i<ca.length; i++) {  
	        var c = ca[i];  
	        while (c.charAt(0)==' ') c = c.substring(1);  
	        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
	    }  
	    return ""; 
	}

	this.clearCookie=function(cname, cvalue) {    
	    // setCookie(name, "", -1);
	    var exdays=-1;
	    var d = new Date();  
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));  
	    var expires = "expires="+d.toUTCString();  
	    document.cookie = cname + "=" + cvalue + "; " + expires;     
	}
}

var handleCookie=new HandleCookie()

export default handleCookie;