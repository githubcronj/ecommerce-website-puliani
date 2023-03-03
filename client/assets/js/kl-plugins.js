/*

Easy video background jquery plugin

 */

(function(){function h(){var a=navigator.userAgent.toLowerCase();return-1!=a.indexOf("msie")?parseInt(a.split("msie")[1]):!1}if(void 0==jQuery)console.log("Jquery not included!");else if(void 0==Modernizr.video)console.log("Modernizr not included!");else{var b=jQuery,k=h(),g=0,e=0;jQuery.fn.extend({ensureLoad:function(a){return this.each(function(){this.complete||4===this.readyState?a.call(this):"uninitialized"===this.readyState&&0===this.src.indexOf("data:")?(b(this).trigger("error"),a.call(this)):

(b(this).one("load",a),k&&(void 0!=this.src&&-1==this.src.indexOf("?"))&&(this.src=this.src+"?"+(new Date).getTime()))})}});video_background=function(a,f){this.hidden=!1;this.$holder=a;this.id="video_background_video_"+g;g++;this.parameters={position:"absolute","z-index":"-1",video_ratio:!1,loop:!0,autoplay:!0,muted:!1,mp4:!1,webm:!1,ogg:!1,flv:!1,youtube:!1,priority:"html5",fallback_image:!1,sizing:"fill",start:0};b.each(f,b.proxy(function(a,b){this.parameters[a]=b},this));this.$video_holder=b('<div id="'+

this.id+'"></div>').appendTo(a).css({"z-index":this.parameters["z-index"],position:this.parameters.position,top:0,left:0,right:0,bottom:0,overflow:"hidden"});this.ismobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);this.supports_flash=9<swfobject.getFlashPlayerVersion().major&&(!1!==this.parameters.mp4||!1!==this.parameters.flv);this.supports_video=Modernizr.video&&(Modernizr.video.h264&&!1!==this.parameters.mp4||Modernizr.video.ogg&&!1!==this.parameters.ogg||Modernizr.video.webm&&

!1!==this.parameters.webm);this.decision="image";this.ismobile||!this.supports_flash&&!this.supports_video&&!1===this.parameters.youtube||(this.decision=this.parameters.priority,!1!==this.parameters.youtube?this.decision="youtube":"flash"==this.parameters.priority&&this.supports_flash?this.decision="flash":"html5"==this.parameters.priority&&this.supports_video?this.decision="html5":this.supports_flash?this.decision="flash":this.supports_video&&(this.decision="html5"));"image"==this.decision?this.make_image():

"youtube"==this.decision?this.make_youtube():"html5"==this.decision?this.make_video():this.make_flash();return this};video_background.prototype={make_video:function(){var a='<video width="100%" height="100%" '+((this.parameters.autoplay?"autoplay ":"")+(this.parameters.loop?'loop onended="this.play()" ':""))+">";!1!==this.parameters.mp4&&(a+='<source src="'+this.parameters.mp4+'" type="video/mp4"></source>');!1!==this.parameters.webm&&(a+='<source src="'+this.parameters.webm+'" type="video/webm"></source>');

!1!==this.parameters.ogg&&(a+='<source src="'+this.parameters.ogg+'" type="video/ogg"></source>');this.$video=b(a+"</video>").css({position:"absolute"});this.$video_holder.append(this.$video);this.video=this.$video.get(0);!1!==this.parameters.video_ratio&&(this.resize_timeout=!1,b(window).resize(b.proxy(function(){clearTimeout(this.resize_timeout);this.resize_timeout=setTimeout(b.proxy(this.video_resize,this),10)},this)),this.video_resize());this.parameters.muted&&this.mute()},video_resize:function(){var a=

this.$video_holder.width(),b=this.$video_holder.height(),c=a,d=a/this.parameters.video_ratio;d<b&&(d=b,c=b*this.parameters.video_ratio);d=Math.ceil(d);c=Math.ceil(c);b=Math.round(b/2-d/2);a=Math.round(a/2-c/2);this.$video.attr("width",c);this.$video.attr("height",d);this.$video.css({top:b+"px",left:a+"px"})},make_youtube:function(){var a=b("html");this.$video=b('<div id="'+this.id+'_yt"></div>').appendTo(this.$video_holder).css({position:"absolute"});this.youtube_ready=!1;if(0==e){var f=document.createElement("script");

f.src="https://www.youtube.com/iframe_api";var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(f,c);e=1;window.onYouTubeIframeAPIReady=b.proxy(function(){a.trigger("yt_loaded");this.build_youtube();e=2},this)}else 1==e?a.bind("yt_loaded",b.proxy(this.build_youtube,this)):2==e&&this.build_youtube()},build_youtube:function(){var a={loop:this.parameters.loop?1:0,start:this.parameters.start,autoplay:this.parameters.autoplay?1:0,controls:0,showinfo:0,wmode:"transparent",iv_load_policy:3,

modestbranding:1,rel:0};this.parameters.loop&&(a.playlist=this.parameters.youtube);this.player=new YT.Player(this.id+"_yt",{height:"100%",width:"100%",playerVars:a,videoId:this.parameters.youtube,events:{onReady:b.proxy(this.youtube_ready_fun,this)}})},youtube_ready_fun:function(a){this.youtube_ready=!0;this.$video=b("#"+this.id+"_yt");!1!==this.parameters.video_ratio&&(this.resize_timeout=!1,b(window).resize(b.proxy(function(){clearTimeout(this.resize_timeout);this.resize_timeout=setTimeout(b.proxy(this.video_resize,

this),10)},this)),this.video_resize());this.parameters.muted&&this.mute()},make_flash:function(){var a={url:!1!=this.parameters.mp4?this.parameters.mp4:this.parameters.flv,loop:this.parameters.loop,autoplay:this.parameters.autoplay,muted:this.parameters.muted};this.$video_holder.append('<div id="'+this.id+'_flash"></div>');swfobject.embedSWF("flash/video.swf",this.id+"_flash","100%","100%","9.0",null,a,{allowfullscreen:!0,allowScriptAccess:"always",wmode:"transparent"},{name:"background-video-swf"},

b.proxy(this.flash_callback,this))},flash_callback:function(a){this.video=b(a.target).get(0);this.parameters.muted&&this.mute()},make_image:function(){!1!==this.parameters.fallback_image&&(this.$img=b('<img src="'+this.parameters.fallback_image+'" alt=""/>').appendTo(this.$video_holder).css({position:"absolute"}),this.$img.ensureLoad(b.proxy(this.image_loaded,this)))},image_loaded:function(){this.original_width=this.$img.width();this.original_height=this.$img.height();this.resize_timeout=!1;b(window).resize(b.proxy(function(){clearTimeout(this.resize_timeout);

this.resize_timeout=setTimeout(b.proxy(this.image_resize,this),10)},this));this.image_resize()},image_resize:function(){var a=this.$video_holder.width(),b=this.$video_holder.height(),c=a,d=this.original_height/(this.original_width/a);if("adjust"==this.parameters.sizing&&d>b||"fill"==this.parameters.sizing&&d<b)d=b,c=this.original_width/(this.original_height/b);d=Math.ceil(d);c=Math.ceil(c);b=Math.round(b/2-d/2);a=Math.round(a/2-c/2);this.$img.css({width:c+"px",height:d+"px",top:b+"px",left:a+"px"})},

isPlaying:function(){return"html5"==this.decision?!this.video.paused:"flash"==this.decision?video.isPlaying():"youtube"==this.decision&&this.youtube_ready?1===this.player.getPlayerState():!1},play:function(){"html5"==this.decision?this.video.play():"flash"==this.decision?this.video.resume():"youtube"==this.decision&&this.youtube_ready&&this.player.playVideo()},pause:function(){"html5"==this.decision||"flash"==this.decision?this.video.pause():"youtube"==this.decision&&this.youtube_ready&&this.player.pauseVideo()},

toggle_play:function(){this.isPlaying()?this.pause():this.play()},isMuted:function(){return"html5"==this.decision?!this.video.volume:"flash"==this.decision?video.isMute():"youtube"==this.decision&&this.youtube_ready?this.player.isMuted():!1},mute:function(){"html5"==this.decision?this.video.volume=0:"flash"==this.decision?this.video.mute():"youtube"==this.decision&&this.youtube_ready&&this.player.mute()},unmute:function(){"html5"==this.decision?this.video.volume=1:"flash"==this.decision?this.video.unmute():

"youtube"==this.decision&&this.youtube_ready&&this.player.unMute()},toggle_mute:function(){this.isMuted()?this.unmute():this.mute()},hide:function(){this.pause();this.$video_holder.stop().fadeTo(700,0);this.hidden=!0},show:function(){this.play();this.$video_holder.stop().fadeTo(700,1);this.hidden=!1},toogle_hidden:function(){this.hidden?this.show():this.hide()},rewind:function(){"html5"==this.decision?this.video.currentTime=0:"flash"==this.decision?this.video.rewind():"youtube"==this.decision&&this.youtube_ready&&

this.player.seekTo(0)}}}})(void 0);



/* SWF Object */

var swfobject=function(){function x(){if(!v){try{var a=d.getElementsByTagName("body")[0].appendChild(d.createElement("span"));a.parentNode.removeChild(a)}catch(b){return}v=!0;for(var a=A.length,c=0;c<a;c++)A[c]()}}function O(a){v?a():A[A.length]=a}function P(a){if(typeof p.addEventListener!=k)p.addEventListener("load",a,!1);else if(typeof d.addEventListener!=k)d.addEventListener("load",a,!1);else if(typeof p.attachEvent!=k)X(p,"onload",a);else if("function"==typeof p.onload){var b=p.onload;p.onload=

function(){b();a()}}else p.onload=a}function Y(){var a=d.getElementsByTagName("body")[0],b=d.createElement(u);b.setAttribute("type",B);var c=a.appendChild(b);if(c){var f=0;(function(){if(typeof c.GetVariable!=k){var g=c.GetVariable("$version");g&&(g=g.split(" ")[1].split(","),e.pv=[parseInt(g[0],10),parseInt(g[1],10),parseInt(g[2],10)])}else if(10>f){f++;setTimeout(arguments.callee,10);return}a.removeChild(b);c=null;G()})()}else G()}function G(){var a=s.length;if(0<a)for(var b=0;b<a;b++){var c=s[b].id,

f=s[b].callbackFn,g={success:!1,id:c};if(0<e.pv[0]){var d=q(c);if(d)if(!C(s[b].swfVersion)||e.wk&&312>e.wk)if(s[b].expressInstall&&H()){g={};g.data=s[b].expressInstall;g.width=d.getAttribute("width")||"0";g.height=d.getAttribute("height")||"0";d.getAttribute("class")&&(g.styleclass=d.getAttribute("class"));d.getAttribute("align")&&(g.align=d.getAttribute("align"));for(var h={},d=d.getElementsByTagName("param"),l=d.length,m=0;m<l;m++)"movie"!=d[m].getAttribute("name").toLowerCase()&&(h[d[m].getAttribute("name")]=

d[m].getAttribute("value"));I(g,h,c,f)}else Z(d),f&&f(g);else w(c,!0),f&&(g.success=!0,g.ref=J(c),f(g))}else w(c,!0),f&&((c=J(c))&&typeof c.SetVariable!=k&&(g.success=!0,g.ref=c),f(g))}}function J(a){var b=null;(a=q(a))&&"OBJECT"==a.nodeName&&(typeof a.SetVariable!=k?b=a:(a=a.getElementsByTagName(u)[0])&&(b=a));return b}function H(){return!D&&C("6.0.65")&&(e.win||e.mac)&&!(e.wk&&312>e.wk)}function I(a,b,c,f){D=!0;K=f||null;Q={success:!1,id:c};var g=q(c);if(g){"OBJECT"==g.nodeName?(z=L(g),E=null):

(z=g,E=c);a.id=R;if(typeof a.width==k||!/%$/.test(a.width)&&310>parseInt(a.width,10))a.width="310";if(typeof a.height==k||!/%$/.test(a.height)&&137>parseInt(a.height,10))a.height="137";d.title=d.title.slice(0,47)+" - Flash Player Installation";f=e.ie&&e.win?"ActiveX":"PlugIn";f="MMredirectURL="+p.location.toString().replace(/&/g,"%26")+"&MMplayerType="+f+"&MMdoctitle="+d.title;b.flashvars=typeof b.flashvars!=k?b.flashvars+("&"+f):f;e.ie&&(e.win&&4!=g.readyState)&&(f=d.createElement("div"),c+="SWFObjectNew",

f.setAttribute("id",c),g.parentNode.insertBefore(f,g),g.style.display="none",function(){4==g.readyState?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}());M(a,b,c)}}function Z(a){if(e.ie&&e.win&&4!=a.readyState){var b=d.createElement("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(L(a),b);a.style.display="none";(function(){4==a.readyState?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)})()}else a.parentNode.replaceChild(L(a),a)}function L(a){var b=d.createElement("div");

if(e.win&&e.ie)b.innerHTML=a.innerHTML;else if(a=a.getElementsByTagName(u)[0])if(a=a.childNodes)for(var c=a.length,f=0;f<c;f++)1==a[f].nodeType&&"PARAM"==a[f].nodeName||8==a[f].nodeType||b.appendChild(a[f].cloneNode(!0));return b}function M(a,b,c){var f,g=q(c);if(e.wk&&312>e.wk)return f;if(g)if(typeof a.id==k&&(a.id=c),e.ie&&e.win){var r="",h;for(h in a)a[h]!=Object.prototype[h]&&("data"==h.toLowerCase()?b.movie=a[h]:"styleclass"==h.toLowerCase()?r+=' class="'+a[h]+'"':"classid"!=h.toLowerCase()&&

(r+=" "+h+'="'+a[h]+'"'));h="";for(var l in b)b[l]!=Object.prototype[l]&&(h+='<param name="'+l+'" value="'+b[l]+'" />');g.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+r+">"+h+"</object>";F[F.length]=a.id;f=q(a.id)}else{l=d.createElement(u);l.setAttribute("type",B);for(var m in a)a[m]!=Object.prototype[m]&&("styleclass"==m.toLowerCase()?l.setAttribute("class",a[m]):"classid"!=m.toLowerCase()&&l.setAttribute(m,a[m]));for(r in b)b[r]!=Object.prototype[r]&&"movie"!=r.toLowerCase()&&

(a=l,h=r,m=b[r],c=d.createElement("param"),c.setAttribute("name",h),c.setAttribute("value",m),a.appendChild(c));g.parentNode.replaceChild(l,g);f=l}return f}function S(a){var b=q(a);b&&"OBJECT"==b.nodeName&&(e.ie&&e.win?(b.style.display="none",function(){if(4==b.readyState){var c=q(a);if(c){for(var f in c)"function"==typeof c[f]&&(c[f]=null);c.parentNode.removeChild(c)}}else setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function q(a){var b=null;try{b=d.getElementById(a)}catch(c){}return b}

function X(a,b,c){a.attachEvent(b,c);y[y.length]=[a,b,c]}function C(a){var b=e.pv;a=a.split(".");a[0]=parseInt(a[0],10);a[1]=parseInt(a[1],10)||0;a[2]=parseInt(a[2],10)||0;return b[0]>a[0]||b[0]==a[0]&&b[1]>a[1]||b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]?!0:!1}function T(a,b,c,f){if(!e.ie||!e.mac){var g=d.getElementsByTagName("head")[0];g&&(c=c&&"string"==typeof c?c:"screen",f&&(N=n=null),n&&N==c||(f=d.createElement("style"),f.setAttribute("type","text/css"),f.setAttribute("media",c),n=g.appendChild(f),

e.ie&&(e.win&&typeof d.styleSheets!=k&&0<d.styleSheets.length)&&(n=d.styleSheets[d.styleSheets.length-1]),N=c),e.ie&&e.win?n&&typeof n.addRule==u&&n.addRule(a,b):n&&typeof d.createTextNode!=k&&n.appendChild(d.createTextNode(a+" {"+b+"}")))}}function w(a,b){if(U){var c=b?"visible":"hidden";v&&q(a)?q(a).style.visibility=c:T("#"+a,"visibility:"+c)}}function V(a){return null!=/[\\\"<>\.;]/.exec(a)&&typeof encodeURIComponent!=k?encodeURIComponent(a):a}var k="undefined",u="object",B="application/x-shockwave-flash",

R="SWFObjectExprInst",p=window,d=document,t=navigator,W=!1,A=[function(){W?Y():G()}],s=[],F=[],y=[],z,E,K,Q,v=!1,D=!1,n,N,U=!0,e=function(){var a=typeof d.getElementById!=k&&typeof d.getElementsByTagName!=k&&typeof d.createElement!=k,b=t.userAgent.toLowerCase(),c=t.platform.toLowerCase(),f=c?/win/.test(c):/win/.test(b),c=c?/mac/.test(c):/mac/.test(b),b=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,g=!+"\v1",e=[0,0,0],h=null;if(typeof t.plugins!=k&&typeof t.plugins["Shockwave Flash"]==

u)!(h=t.plugins["Shockwave Flash"].description)||typeof t.mimeTypes!=k&&t.mimeTypes[B]&&!t.mimeTypes[B].enabledPlugin||(W=!0,g=!1,h=h.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),e[0]=parseInt(h.replace(/^(.*)\..*$/,"$1"),10),e[1]=parseInt(h.replace(/^.*\.(.*)\s.*$/,"$1"),10),e[2]=/[a-zA-Z]/.test(h)?parseInt(h.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof p.ActiveXObject!=k)try{var l=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");l&&(h=l.GetVariable("$version"))&&(g=!0,h=h.split(" ")[1].split(","),

e=[parseInt(h[0],10),parseInt(h[1],10),parseInt(h[2],10)])}catch(m){}return{w3:a,pv:e,wk:b,ie:g,win:f,mac:c}}();(function(){e.w3&&((typeof d.readyState!=k&&"complete"==d.readyState||typeof d.readyState==k&&(d.getElementsByTagName("body")[0]||d.body))&&x(),v||(typeof d.addEventListener!=k&&d.addEventListener("DOMContentLoaded",x,!1),e.ie&&e.win&&(d.attachEvent("onreadystatechange",function(){"complete"==d.readyState&&(d.detachEvent("onreadystatechange",arguments.callee),x())}),p==top&&function(){if(!v){try{d.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,

0);return}x()}}()),e.wk&&function(){v||(/loaded|complete/.test(d.readyState)?x():setTimeout(arguments.callee,0))}(),P(x)))})();(function(){e.ie&&e.win&&window.attachEvent("onunload",function(){for(var a=y.length,b=0;b<a;b++)y[b][0].detachEvent(y[b][1],y[b][2]);a=F.length;for(b=0;b<a;b++)S(F[b]);for(var c in e)e[c]=null;e=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})})();return{registerObject:function(a,b,c,f){if(e.w3&&a&&b){var d={};d.id=a;d.swfVersion=b;d.expressInstall=c;d.callbackFn=

f;s[s.length]=d;w(a,!1)}else f&&f({success:!1,id:a})},getObjectById:function(a){if(e.w3)return J(a)},embedSWF:function(a,b,c,d,g,r,h,l,m,p){var q={success:!1,id:b};e.w3&&!(e.wk&&312>e.wk)&&a&&b&&c&&d&&g?(w(b,!1),O(function(){c+="";d+="";var e={};if(m&&typeof m===u)for(var n in m)e[n]=m[n];e.data=a;e.width=c;e.height=d;n={};if(l&&typeof l===u)for(var s in l)n[s]=l[s];if(h&&typeof h===u)for(var t in h)n.flashvars=typeof n.flashvars!=k?n.flashvars+("&"+t+"="+h[t]):t+"="+h[t];if(C(g))s=M(e,n,b),e.id==

b&&w(b,!0),q.success=!0,q.ref=s;else{if(r&&H()){e.data=r;I(e,n,b,p);return}w(b,!0)}p&&p(q)})):p&&p(q)},switchOffAutoHideShow:function(){U=!1},ua:e,getFlashPlayerVersion:function(){return{major:e.pv[0],minor:e.pv[1],release:e.pv[2]}},hasFlashPlayerVersion:C,createSWF:function(a,b,c){if(e.w3)return M(a,b,c)},showExpressInstall:function(a,b,c,d){e.w3&&H()&&I(a,b,c,d)},removeSWF:function(a){e.w3&&S(a)},createCSS:function(a,b,c,d){e.w3&&T(a,b,c,d)},addDomLoadEvent:O,addLoadEvent:P,getQueryParamValue:function(a){var b=

d.location.search||d.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(null==a)return V(b);for(var b=b.split("&"),c=0;c<b.length;c++)if(b[c].substring(0,b[c].indexOf("="))==a)return V(b[c].substring(b[c].indexOf("=")+1))}return""},expressInstallCallback:function(){if(D){var a=q(R);a&&z&&(a.parentNode.replaceChild(z,a),E&&(w(E,!0),e.ie&&e.win&&(z.style.display="block")),K&&K(Q));D=!1}}}}();





/*

 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/

 *

 * Uses the built in easing capabilities added In jQuery 1.1

 * to offer multiple easing options

 *

 * TERMS OF USE - jQuery Easing

 * 

 * Open source under the BSD License. 

 * 

 * Copyright Â© 2008 George McGinley Smith

 * All rights reserved.

 * 

 * Redistribution and use in source and binary forms, with or without modification, 

 * are permitted provided that the following conditions are met:

 * 

 * Redistributions of source code must retain the above copyright notice, this list of 

 * conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this list 

 * of conditions and the following disclaimer in the documentation and/or other materials 

 * provided with the distribution.

 * 

 * Neither the name of the author nor the names of contributors may be used to endorse 

 * or promote products derived from this software without specific prior written permission.

 * 

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 

 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF

 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE

 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,

 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE

 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 

 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING

 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 

 * OF THE POSSIBILITY OF SUCH DAMAGE. 

 *

*/



// t: current time, b: begInnIng value, c: change In value, d: duration

jQuery.easing['jswing'] = jQuery.easing['swing'];



jQuery.extend( jQuery.easing,

{

	def: 'easeOutQuad',

	swing: function (x, t, b, c, d) {

		//alert(jQuery.easing.default);

		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);

	},

	easeInQuad: function (x, t, b, c, d) {

		return c*(t/=d)*t + b;

	},

	easeOutQuad: function (x, t, b, c, d) {

		return -c *(t/=d)*(t-2) + b;

	},

	easeInOutQuad: function (x, t, b, c, d) {

		if ((t/=d/2) < 1) return c/2*t*t + b;

		return -c/2 * ((--t)*(t-2) - 1) + b;

	},

	easeInCubic: function (x, t, b, c, d) {

		return c*(t/=d)*t*t + b;

	},

	easeOutCubic: function (x, t, b, c, d) {

		return c*((t=t/d-1)*t*t + 1) + b;

	},

	easeInOutCubic: function (x, t, b, c, d) {

		if ((t/=d/2) < 1) return c/2*t*t*t + b;

		return c/2*((t-=2)*t*t + 2) + b;

	},

	easeInQuart: function (x, t, b, c, d) {

		return c*(t/=d)*t*t*t + b;

	},

	easeOutQuart: function (x, t, b, c, d) {

		return -c * ((t=t/d-1)*t*t*t - 1) + b;

	},

	easeInOutQuart: function (x, t, b, c, d) {

		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;

		return -c/2 * ((t-=2)*t*t*t - 2) + b;

	},

	easeInQuint: function (x, t, b, c, d) {

		return c*(t/=d)*t*t*t*t + b;

	},

	easeOutQuint: function (x, t, b, c, d) {

		return c*((t=t/d-1)*t*t*t*t + 1) + b;

	},

	easeInOutQuint: function (x, t, b, c, d) {

		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;

		return c/2*((t-=2)*t*t*t*t + 2) + b;

	},

	easeInSine: function (x, t, b, c, d) {

		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;

	},

	easeOutSine: function (x, t, b, c, d) {

		return c * Math.sin(t/d * (Math.PI/2)) + b;

	},

	easeInOutSine: function (x, t, b, c, d) {

		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;

	},

	easeInExpo: function (x, t, b, c, d) {

		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;

	},

	easeOutExpo: function (x, t, b, c, d) {

		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;

	},

	easeInOutExpo: function (x, t, b, c, d) {

		if (t==0) return b;

		if (t==d) return b+c;

		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;

		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;

	},

	easeInCirc: function (x, t, b, c, d) {

		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;

	},

	easeOutCirc: function (x, t, b, c, d) {

		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;

	},

	easeInOutCirc: function (x, t, b, c, d) {

		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;

		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;

	},

	easeInElastic: function (x, t, b, c, d) {

		var s=1.70158;var p=0;var a=c;

		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;

		if (a < Math.abs(c)) { a=c; var s=p/4; }

		else var s = p/(2*Math.PI) * Math.asin (c/a);

		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

	},

	easeOutElastic: function (x, t, b, c, d) {

		var s=1.70158;var p=0;var a=c;

		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;

		if (a < Math.abs(c)) { a=c; var s=p/4; }

		else var s = p/(2*Math.PI) * Math.asin (c/a);

		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;

	},

	easeInOutElastic: function (x, t, b, c, d) {

		var s=1.70158;var p=0;var a=c;

		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);

		if (a < Math.abs(c)) { a=c; var s=p/4; }

		else var s = p/(2*Math.PI) * Math.asin (c/a);

		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;

	},

	easeInBack: function (x, t, b, c, d, s) {

		if (s == undefined) s = 1.70158;

		return c*(t/=d)*t*((s+1)*t - s) + b;

	},

	easeOutBack: function (x, t, b, c, d, s) {

		if (s == undefined) s = 1.70158;

		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

	},

	easeInOutBack: function (x, t, b, c, d, s) {

		if (s == undefined) s = 1.70158; 

		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;

		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;

	},

	easeInBounce: function (x, t, b, c, d) {

		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;

	},

	easeOutBounce: function (x, t, b, c, d) {

		if ((t/=d) < (1/2.75)) {

			return c*(7.5625*t*t) + b;

		} else if (t < (2/2.75)) {

			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;

		} else if (t < (2.5/2.75)) {

			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;

		} else {

			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;

		}

	},

	easeInOutBounce: function (x, t, b, c, d) {

		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;

		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;

	}

});



/*

 *

 * TERMS OF USE - EASING EQUATIONS

 * 

 * Open source under the BSD License. 

 * 

 * Copyright Â© 2001 Robert Penner

 * All rights reserved.

 * 

 * Redistribution and use in source and binary forms, with or without modification, 

 * are permitted provided that the following conditions are met:

 * 

 * Redistributions of source code must retain the above copyright notice, this list of 

 * conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this list 

 * of conditions and the following disclaimer in the documentation and/or other materials 

 * provided with the distribution.

 * 

 * Neither the name of the author nor the names of contributors may be used to endorse 

 * or promote products derived from this software without specific prior written permission.

 * 

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 

 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF

 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE

 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,

 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE

 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 

 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING

 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 

 * OF THE POSSIBILITY OF SUCH DAMAGE. 

 *

 */

 

 /*!

 * imagesLoaded PACKAGED v3.1.4

 * JavaScript is all like "You images are done yet or what?"

 * MIT License

 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("eventEmitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(this,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function c(e){this.img=e}function f(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},s.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),c.prototype=new t,c.prototype.check=function(){var e=v[this.img.src]||new f(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},c.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return f.prototype=new t,f.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},f.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},f.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},f.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},f.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},f.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});





/*********************************************************************

*  #### Twitter Post Fetcher v9.0 ####

*  Coded by Jason Mayes 2013. A present to all the developers out there.

*  www.jasonmayes.com

*  Please keep this disclaimer with my code if you use it. Thanks. :-)

*  Got feedback or questions, ask here: 

*  http://www.jasonmayes.com/projects/twitterApi/

*  Updates will be posted to this site.

*********************************************************************/

var twitterFetcher=function(){function v(e){return e.replace(/<b[^>]*>(.*?)<\/b>/gi,function(c,e){return e}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,"")}function m(e,c){for(var g=[],f=RegExp("(^| )"+c+"( |$)"),a=e.getElementsByTagName("*"),d=0,b=a.length;d<b;d++)f.test(a[d].className)&&g.push(a[d]);return g}var w="",j=20,q=!0,h=[],r=!1,n=!0,p=!0,s=null,t=!0,x=!0,u=null;return{fetch:function(e,c,g,f,a,d,b,k,l){void 0===g&&(g=20);void 0===f&&(q=!0);void 0===a&&(a=!0);void 0===

d&&(d=!0);void 0===b&&(b="default");void 0===k&&(k=!0);void 0===l&&(l=null);r?h.push({id:e,domId:c,maxTweets:g,enableLinks:f,showUser:a,showTime:d,dateFunction:b,showRt:k,customCallback:l}):(r=!0,w=c,j=g,q=f,p=a,n=d,x=k,s=b,u=l,c=document.createElement("script"),c.type="text/javascript",c.src="//cdn.syndication.twimg.com/widgets/timelines/"+e+"?&lang=en&callback=twitterFetcher.callback&suppress_response_codes=true&rnd="+Math.random(),document.getElementsByTagName("head")[0].appendChild(c))},callback:function(e){var c=

document.createElement("div");c.innerHTML=e.body;"undefined"===typeof c.getElementsByClassName&&(t=!1);e=[];var g=[],f=[],a=[],d=0;if(t)for(c=c.getElementsByClassName("tweet");d<c.length;){0<c[d].getElementsByClassName("retweet-credit").length?a.push(!0):a.push(!1);if(!a[d]||a[d]&&x)e.push(c[d].getElementsByClassName("e-entry-title")[0]),g.push(c[d].getElementsByClassName("p-author")[0]),f.push(c[d].getElementsByClassName("dt-updated")[0]);d++}else for(c=m(c,"tweet");d<c.length;)e.push(m(c[d],"e-entry-title")[0]),

g.push(m(c[d],"p-author")[0]),f.push(m(c[d],"dt-updated")[0]),0<m(c[d],"retweet-credit").length?a.push(!0):a.push(!1),d++;e.length>j&&(e.splice(j,e.length-j),g.splice(j,g.length-j),f.splice(j,f.length-j),a.splice(j,a.length-j));c=[];d=e.length;for(a=0;a<d;){if("string"!==typeof s){var b=new Date(f[a].getAttribute("datetime").replace(/-/g,"/").replace("T"," ").split("+")[0]),b=s(b);f[a].setAttribute("aria-label",b);if(e[a].innerText)if(t)f[a].innerText=b;else{var k=document.createElement("p"),l=document.createTextNode(b);

k.appendChild(l);k.setAttribute("aria-label",b);f[a]=k}else f[a].textContent=b}q?(b="",p&&(b+='<div class="user">'+v(g[a].innerHTML)+"</div>"),b+='<p class="tweet">'+v(e[a].innerHTML)+"</p>",n&&(b+='<p class="timePosted">'+f[a].getAttribute("aria-label")+"</p>")):e[a].innerText?(b="",p&&(b+='<p class="user">'+g[a].innerText+"</p>"),b+='<p class="tweet">'+e[a].innerText+"</p>",n&&(b+='<p class="timePosted">'+f[a].innerText+"</p>")):(b="",p&&(b+='<p class="user">'+g[a].textContent+"</p>"),b+='<p class="tweet">'+

e[a].textContent+"</p>",n&&(b+='<p class="timePosted">'+f[a].textContent+"</p>"));c.push(b);a++}if(null==u){e=c.length;g=0;f=document.getElementById(w);for(d="<ul>";g<e;)d+="<li>"+c[g]+"</li>",g++;f.innerHTML=d+"</ul>"}else u(c);r=!1;0<h.length&&(twitterFetcher.fetch(h[0].id,h[0].domId,h[0].maxTweets,h[0].enableLinks,h[0].showUser,h[0].showTime,h[0].dateFunction,h[0].showRt,h[0].customCallback),h.splice(0,1))}}}();



/**

 * h5Validate

 * @version v0.9.0

 * Using semantic versioning: http://semver.org/

 * @author Eric Hamilton http://ericleads.com/

 * @copyright 2010 - 2012 Eric Hamilton

 * Dual licensed under the MIT and GPL licenses:

 * http://www.opensource.org/licenses/mit-license.php

 * http://www.gnu.org/licenses/gpl.html

 *

 * Developed under the sponsorship of RootMusic, Zumba Fitness, LLC, and Rese Property Management

 */

(function(e){"use strict";var t=window.console||function(){},n={defaults:{debug:false,RODom:false,patternLibrary:{phone:/([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{1,6}[\)])?([0-9A-Za-z \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)/,email:/((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,url:/(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,number:/-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,dateISO:/\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,alpha:/[a-zA-Z]+/,alphaNumeric:/\w+/,integer:/-?\d+/},classPrefix:"h5-",errorClass:"ui-state-error",validClass:"ui-state-valid",activeClass:"active",requiredClass:"required",requiredAttribute:"required",patternAttribute:"pattern",errorAttribute:"data-h5-errorid",customEvents:{validate:true},kbSelectors:":input:not(:button):not(:disabled):not(.novalidate)",focusout:true,focusin:false,change:true,keyup:false,activeKeyup:true,mSelectors:'[type="range"]:not(:disabled):not(.novalidate), :radio:not(:disabled):not(.novalidate), :checkbox:not(:disabled):not(.novalidate), select:not(:disabled):not(.novalidate), option:not(:disabled):not(.novalidate)',click:true,requiredVar:"h5-required",patternVar:"h5-pattern",stripMarkup:true,submit:true,focusFirstInvalidElementOnSubmit:true,validateOnSubmit:true,invalidCallback:function(){},validCallback:function(){},allValidSelectors:":input:visible:not(:button):not(:disabled):not(.novalidate)",markInvalid:function(n){var r=e(n.element),i=e(n.errorID);r.addClass(n.errorClass).removeClass(n.validClass);r.addClass(n.settings.activeClass);if(i.length){if(r.attr("title")){i.text(r.attr("title"))}i.show()}r.data("valid",false);n.settings.invalidCallback.call(n.element,n.validity);return r},markValid:function(n){var r=e(n.element),i=e(n.errorID);r.addClass(n.validClass).removeClass(n.errorClass);if(i.length){i.hide()}r.data("valid",true);n.settings.validCallback.call(n.element,n.validity);return r},unmark:function(n){var r=e(n.element);r.removeClass(n.errorClass).removeClass(n.validClass);r.form.find("#"+n.element.id).removeClass(n.errorClass).removeClass(n.validClass);return r}}},r=n.defaults,i=r.patternLibrary,s=function(n){return e.extend({customError:n.customError||false,patternMismatch:n.patternMismatch||false,rangeOverflow:n.rangeOverflow||false,rangeUnderflow:n.rangeUnderflow||false,stepMismatch:n.stepMismatch||false,tooLong:n.tooLong||false,typeMismatch:n.typeMismatch||false,valid:n.valid||true,valueMissing:n.valueMissing||false},n)},o={isValid:function(t,n){var r=e(this);n=t&&n||{};if(n.revalidate!==false){r.trigger("validate")}return r.data("valid")},allValid:function(t,n){var r=true,i=[],s=e(this),o,u,a=[],f=function(t,n){n.e=t;i.push(n)},l=e.extend({},t,n);n=n||{};s.trigger("formValidate",{settings:e.extend(true,{},l)});s.undelegate(l.allValidSelectors,".allValid",f);s.delegate(l.allValidSelectors,"validated.allValid",f);o=s.find(l.allValidSelectors);u=o.filter(function(e){var t;if(this.tagName==="INPUT"&&this.type==="radio"){t=this.name;if(a[t]===true){return false}a[t]=true}return true});u.each(function(){var t=e(this);r=t.h5Validate("isValid",n)&&r});s.trigger("formValidated",{valid:r,elements:i});return r},validate:function(n){var r=e(this),i=r.filter("[pattern]")[0]?r.attr("pattern"):false,o=new RegExp("^(?:"+i+")$"),u=null,a=r.is("[type=checkbox]")?r.is(":checked"):r.is("[type=radio]")?(u=r.parents("form").find('input[name="'+r.attr("name")+'"]')).filter(":checked").length>0:r.val(),f=n.errorClass,l=n.validClass,c=r.attr(n.errorAttribute)||false,h=c?"#"+c.replace(/(:|\.|\[|\])/g,"\\$1"):false,p=false,d=s({element:this,valid:true}),v=e("<input required>"),m;if(v.filter("[required]")&&v.filter("[required]").length){p=r.filter("[required]").length&&r.attr("required")!=="false"}else{p=r.attr("required")!==undefined}if(n.debug&&window.console){t.log('Validate called on "'+a+'" with regex "'+o+'". Required: '+p);t.log("Regex test: "+o.test(a)+", Pattern: "+i)}m=parseInt(r.attr("maxlength"),10);if(!isNaN(m)&&a.length>m){d.valid=false;d.tooLong=true}if(p&&!a){d.valid=false;d.valueMissing=true}else if(i&&!o.test(a)&&a){d.valid=false;d.patternMismatch=true}else{if(!n.RODom){n.markValid({element:this,validity:d,errorClass:f,validClass:l,errorID:h,settings:n})}}if(!d.valid){if(!n.RODom){n.markInvalid({element:this,validity:d,errorClass:f,validClass:l,errorID:h,settings:n})}}r.trigger("validated",d);if(u!==null&&n.alreadyCheckingRelatedRadioButtons!==true){n.alreadyCheckingRelatedRadioButtons=true;u.not(r).trigger("validate");n.alreadyCheckingRelatedRadioButtons=false}},delegateEvents:function(t,n,r,i){var s={},o=0,u=function(){i.validate.call(this,i)};e.each(n,function(e,t){if(t){s[e]=e}});for(o in s){if(s.hasOwnProperty(o)){e(r).delegate(t,s[o]+".h5Validate",u)}}return r},bindDelegation:function(t){var n=e(this),r;e.each(i,function(n,r){var i=r.toString();i=i.substring(1,i.length-1);e("."+t.classPrefix+n).attr("pattern",i)});r=n.filter("form").add(n.find("form")).add(n.parents("form"));r.attr("novalidate","novalidate").submit(u);r.find("input[formnovalidate][type='submit']").click(function(){e(this).closest("form").unbind("submit",u)});return this.each(function(){var e={focusout:t.focusout,focusin:t.focusin,change:t.change,keyup:t.keyup},n={click:t.click},r={keyup:t.activeKeyup};t.delegateEvents(":input",t.customEvents,this,t);t.delegateEvents(t.kbSelectors,e,this,t);t.delegateEvents(t.mSelectors,n,this,t);t.delegateEvents(t.activeClassSelector,r,this,t);t.delegateEvents("textarea[maxlength]",{keyup:true},this,t)})}},u=function(t){var n,r=l.call(this),i;if(r.submit!==true){return}n=e(this);i=n.h5Validate("allValid",{revalidate:r.validateOnSubmit===true});if(i!==true){t.preventDefault();if(r.focusFirstInvalidElementOnSubmit===true){var s=e(r.allValidSelectors,n).filter(function(t){return e(this).h5Validate("isValid",{revalidate:false})!==true});s.first().focus()}}return i},a=[],f=function(n){var i=e.extend({},r,n,o),s=i.classPrefix+i.activeClass;return e.extend(i,{activeClass:s,activeClassSelector:"."+s,requiredClass:i.classPrefix+i.requiredClass,el:this})},l=function(){var n=e(this).closest("[data-h5-instanceId]");return a[n.attr("data-h5-instanceId")]},c=function(n){var r=a.push(n)-1;if(n.RODom!==true){e(this).attr("data-h5-instanceId",r)}e(this).trigger("instance",{"data-h5-instanceId":r})};e.h5Validate={addPatterns:function(e){var t=r.patternLibrary,n;for(n in e){if(e.hasOwnProperty(n)){t[n]=e[n]}}return t},validValues:function(t,n){var r=0,i=n.length,s="",o;for(r=0;r<i;r+=1){s=s?s+"|"+n[r]:n[r]}o=new RegExp("^(?:"+s+")$");e(t).data("regex",o)}};e.fn.h5Validate=function(n){var r,i,s;if(typeof n==="string"&&typeof o[n]==="function"){s=l.call(this);i=[].slice.call(arguments,0);r=n;i.shift();i=e.merge([s],i);return s[r].apply(this,i)}s=f.call(this,n);c.call(this,s);return o.bindDelegation.call(this,s)}})(jQuery);

/* jQuery SmartScroll - Debounced scroll event library for jQuery.
* https://github.com/peschee/jquery-smartscroll
*/
;(function(e,t){var n=function(e,t,n){var r;return function(){function u(){if(!n)e.apply(s,o);r=null}var s=this,o=arguments;if(r)clearTimeout(r);else if(n)e.apply(s,o);r=setTimeout(u,t||100)}};jQuery.fn[t]=function(e,r){return e?this.bind("scroll",n(e,r)):this.trigger(t)}})(jQuery,"smartscroll");

/* jQuery cookie */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function t(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function r(n,o){var i=u.raw?n:t(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(t,c,s){if(arguments.length>1&&!e.isFunction(c)){if(s=e.extend({},u.defaults,s),"number"==typeof s.expires){var a=s.expires,d=s.expires=new Date;d.setMilliseconds(d.getMilliseconds()+864e5*a)}return document.cookie=[n(t),"=",i(c),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var f=t?void 0:{},p=document.cookie?document.cookie.split("; "):[],l=0,m=p.length;m>l;l++){var x=p[l].split("="),g=o(x.shift()),j=x.join("=");if(t===g){f=r(j,c);break}t||void 0===(j=r(j))||(f[g]=j)}return f};u.defaults={},e.removeCookie=function(n,o){return e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n)}});

/*!
 * parallax.js v1.3.1 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2015 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
!function(t,i,e,s){function o(i,e){var h=this;"object"==typeof e&&(delete e.refresh,delete e.render,t.extend(this,e)),this.$element=t(i),!this.imageSrc&&this.$element.is("img")&&(this.imageSrc=this.$element.attr("src"));var r=(this.position+"").toLowerCase().match(/\S+/g)||[];return r.length<1&&r.push("center"),1==r.length&&r.push(r[0]),("top"==r[0]||"bottom"==r[0]||"left"==r[1]||"right"==r[1])&&(r=[r[1],r[0]]),this.positionX!=s&&(r[0]=this.positionX.toLowerCase()),this.positionY!=s&&(r[1]=this.positionY.toLowerCase()),h.positionX=r[0],h.positionY=r[1],"left"!=this.positionX&&"right"!=this.positionX&&(this.positionX=isNaN(parseInt(this.positionX))?"center":parseInt(this.positionX)),"top"!=this.positionY&&"bottom"!=this.positionY&&(this.positionY=isNaN(parseInt(this.positionY))?"center":parseInt(this.positionY)),this.position=this.positionX+(isNaN(this.positionX)?"":"px")+" "+this.positionY+(isNaN(this.positionY)?"":"px"),navigator.userAgent.match(/(iPod|iPhone|iPad)/)?(this.iosFix&&!this.$element.is("img")&&this.$element.css({backgroundImage:"url("+this.imageSrc+")",backgroundSize:"cover",backgroundPosition:this.position}),this):navigator.userAgent.match(/(Android)/)?(this.androidFix&&!this.$element.is("img")&&this.$element.css({backgroundImage:"url("+this.imageSrc+")",backgroundSize:"cover",backgroundPosition:this.position}),this):(this.$mirror=t("<div />").prependTo("body"),this.$slider=t("<img />").prependTo(this.$mirror),this.$mirror.addClass("parallax-mirror").css({visibility:"hidden",zIndex:this.zIndex,position:"fixed",top:0,left:0,overflow:"hidden"}),this.$slider.addClass("parallax-slider").one("load",function(){h.naturalHeight&&h.naturalWidth||(h.naturalHeight=this.naturalHeight||this.height||1,h.naturalWidth=this.naturalWidth||this.width||1),h.aspectRatio=h.naturalWidth/h.naturalHeight,o.isSetup||o.setup(),o.sliders.push(h),o.isFresh=!1,o.requestRender()}),this.$slider[0].src=this.imageSrc,void((this.naturalHeight&&this.naturalWidth||this.$slider[0].complete)&&this.$slider.trigger("load")))}function h(s){return this.each(function(){var h=t(this),r="object"==typeof s&&s;this==i||this==e||h.is("body")?o.configure(r):h.data("px.parallax")||(r=t.extend({},h.data(),r),h.data("px.parallax",new o(this,r))),"string"==typeof s&&o[s]()})}!function(){for(var t=0,e=["ms","moz","webkit","o"],s=0;s<e.length&&!i.requestAnimationFrame;++s)i.requestAnimationFrame=i[e[s]+"RequestAnimationFrame"],i.cancelAnimationFrame=i[e[s]+"CancelAnimationFrame"]||i[e[s]+"CancelRequestAnimationFrame"];i.requestAnimationFrame||(i.requestAnimationFrame=function(e){var s=(new Date).getTime(),o=Math.max(0,16-(s-t)),h=i.setTimeout(function(){e(s+o)},o);return t=s+o,h}),i.cancelAnimationFrame||(i.cancelAnimationFrame=function(t){clearTimeout(t)})}(),t.extend(o.prototype,{speed:.2,bleed:0,zIndex:-100,iosFix:!0,androidFix:!0,position:"center",overScrollFix:!1,refresh:function(){this.boxWidth=this.$element.outerWidth(),this.boxHeight=this.$element.outerHeight()+2*this.bleed,this.boxOffsetTop=this.$element.offset().top-this.bleed,this.boxOffsetLeft=this.$element.offset().left,this.boxOffsetBottom=this.boxOffsetTop+this.boxHeight;var t=o.winHeight,i=o.docHeight,e=Math.min(this.boxOffsetTop,i-t),s=Math.max(this.boxOffsetTop+this.boxHeight-t,0),h=this.boxHeight+(e-s)*(1-this.speed)|0,r=(this.boxOffsetTop-e)*(1-this.speed)|0;if(h*this.aspectRatio>=this.boxWidth){this.imageWidth=h*this.aspectRatio|0,this.imageHeight=h,this.offsetBaseTop=r;var n=this.imageWidth-this.boxWidth;this.offsetLeft="left"==this.positionX?0:"right"==this.positionX?-n:isNaN(this.positionX)?-n/2|0:Math.max(this.positionX,-n)}else{this.imageWidth=this.boxWidth,this.imageHeight=this.boxWidth/this.aspectRatio|0,this.offsetLeft=0;var n=this.imageHeight-h;this.offsetBaseTop="top"==this.positionY?r:"bottom"==this.positionY?r-n:isNaN(this.positionY)?r-n/2|0:r+Math.max(this.positionY,-n)}},render:function(){var t=o.scrollTop,i=o.scrollLeft,e=this.overScrollFix?o.overScroll:0,s=t+o.winHeight;this.visibility=this.boxOffsetBottom>t&&this.boxOffsetTop<s?"visible":"hidden",this.mirrorTop=this.boxOffsetTop-t,this.mirrorLeft=this.boxOffsetLeft-i,this.offsetTop=this.offsetBaseTop-this.mirrorTop*(1-this.speed),this.$mirror.css({transform:"translate3d(0px, 0px, 0px)",visibility:this.visibility,top:this.mirrorTop-e,left:this.mirrorLeft,height:this.boxHeight,width:this.boxWidth}),this.$slider.css({transform:"translate3d(0px, 0px, 0px)",position:"absolute",top:this.offsetTop,left:this.offsetLeft,height:this.imageHeight,width:this.imageWidth,maxWidth:"none"})}}),t.extend(o,{scrollTop:0,scrollLeft:0,winHeight:0,winWidth:0,docHeight:1<<30,docWidth:1<<30,sliders:[],isReady:!1,isFresh:!1,isBusy:!1,setup:function(){if(!this.isReady){var s=t(e),h=t(i);h.on("scroll.px.parallax load.px.parallax",function(){var t=o.docHeight-o.winHeight,i=o.docWidth-o.winWidth;o.scrollTop=Math.max(0,Math.min(t,h.scrollTop())),o.scrollLeft=Math.max(0,Math.min(i,h.scrollLeft())),o.overScroll=Math.max(h.scrollTop()-t,Math.min(h.scrollTop(),0)),o.requestRender()}).on("resize.px.parallax load.px.parallax",function(){o.winHeight=h.height(),o.winWidth=h.width(),o.docHeight=s.height(),o.docWidth=s.width(),o.isFresh=!1,o.requestRender()}),this.isReady=!0}},configure:function(i){"object"==typeof i&&(delete i.refresh,delete i.render,t.extend(this.prototype,i))},refresh:function(){t.each(this.sliders,function(){this.refresh()}),this.isFresh=!0},render:function(){this.isFresh||this.refresh(),t.each(this.sliders,function(){this.render()})},requestRender:function(){var t=this;this.isBusy||(this.isBusy=!0,i.requestAnimationFrame(function(){t.render(),t.isBusy=!1}))}});var r=t.fn.parallax;t.fn.parallax=h,t.fn.parallax.Constructor=o,t.fn.parallax.noConflict=function(){return t.fn.parallax=r,this},t(e).on("ready.px.parallax.data-api",function(){t('[data-parallax="scroll"]').parallax()})}(jQuery,window,document);

