mistplayers.videojs={name:"VideoJS player",mimes:["html5/application/vnd.apple.mpegurl","html5/application/vnd.apple.mpegurl;version=7"],priority:MistUtil.object.keys(mistplayers).length+1,isMimeSupported:function(e){return MistUtil.array.indexOf(this.mimes,e)==-1?false:true},isBrowserSupported:function(e,t,i){if(location.protocol!=MistUtil.http.url.split(t.url).protocol){i.log("HTTP/HTTPS mismatch for this source");return false}if(location.protocol=="file:"&&e=="html5/application/vnd.apple"){i.log("This source ("+e+") won't load if the page is run via file://");return false}return"MediaSource"in window},player:function(){},scriptsrc:function(e){return e+"/videojs.js"}};var p=mistplayers.videojs.player;p.prototype=new MistPlayer;p.prototype.build=function(e,t){var i=this;var r;function o(){if(e.destroyed){return}e.log("Building VideoJS player..");r=document.createElement("video");if(e.source.type!="html5/video/ogg"){r.crossOrigin="anonymous"}r.setAttribute("playsinline","");var o=e.source.type.split("/");if(o[0]=="html5"){o.shift()}var s=document.createElement("source");s.setAttribute("src",e.source.url);i.source=s;r.appendChild(s);s.type=o.join("/");e.log("Adding "+s.type+" source @ "+e.source.url);MistUtil.class.add(r,"video-js");var n={};if(e.options.autoplay){n.autoplay=true}if(e.options.loop&&e.info.type!="live"){r.setAttribute("loop","")}if(e.options.muted){r.setAttribute("muted","")}if(e.options.poster){n.poster=e.options.poster}if(e.options.controls=="stock"){r.setAttribute("controls","");if(!document.getElementById("videojs-css")){var a=document.createElement("link");a.rel="stylesheet";a.href=e.options.host+"/skins/videojs.css";a.id="videojs-css";document.head.appendChild(a)}}else{n.controls=false}var l=MistUtil.event.addListener(r,"error",function(t){t.stopImmediatePropagation();var i=t.message;if(!i&&r.error){if("code"in r.error&&r.error.code){i="Code "+r.error.code;for(var o in r.error){if(o=="code"){continue}if(r.error[o]==r.error.code){i=o;break}}}else{i=JSON.stringify(r.error)}}e.log("Error captured and stopped because videojs has not yet loaded: "+i)});function d(){var e=navigator.userAgent.toLowerCase().match(/android\s([\d\.]*)/i);return e?e[1]:false}var p=MistUtil.getAndroid();if(p&&parseFloat(p)<7){e.log("Detected android < 7: instructing videojs to override native playback");n.html5={hls:{overrideNative:true}};n.nativeAudioTracks=false;n.nativeVideoTracks=false}i.onready(function(){e.log("Building videojs");i.videojs=videojs(r,n,function(){MistUtil.event.removeListener(l);e.log("Videojs initialized");if(e.info.type=="live"){MistUtil.event.addListener(r,"progress",function(t){var i=e.player.videojs.seekable().length-1;e.info.meta.buffer_window=(Math.max(e.player.videojs.seekable().end(i),r.duration)-e.player.videojs.seekable().start(i))*1e3})}});MistUtil.event.addListener(r,"error",function(t){if(t&&t.target&&t.target.error&&t.target.error.message&&MistUtil.array.indexOf(t.target.error.message,"NS_ERROR_DOM_MEDIA_OVERFLOW_ERR")>=0){e.timers.start(function(){e.log("Reloading player because of NS_ERROR_DOM_MEDIA_OVERFLOW_ERR");e.reload()},1e3)}});i.api.unload=function(){if(i.videojs){i.videojs.autoplay(false);i.videojs.pause();i.videojs.dispose();i.videojs=false;e.log("Videojs instance disposed")}}});e.log("Built html");if("Proxy"in window&&"Reflect"in window){var u={get:{},set:{}};e.player.api=new Proxy(r,{get:function(e,t,i){if(t in u.get){return u.get[t].apply(e,arguments)}var r=e[t];if(typeof r==="function"){return function(){return r.apply(e,arguments)}}return r},set:function(e,t,i){if(t in u.set){return u.set[t].call(e,i)}return e[t]=i}});e.player.api.load=function(){};u.set.currentTime=function(t){e.player.videojs.currentTime(t)};if(e.info.type=="live"){function f(e){var t=0;if(e.buffered.length){t=e.buffered.end(e.buffered.length-1)}return t}var c=0;u.get.duration=function(){if(e.info){var t=r.duration;return t}return 0};e.player.api.lastProgress=new Date;e.player.api.liveOffset=0;MistUtil.event.addListener(r,"progress",function(){e.player.api.lastProgress=new Date});u.set.currentTime=function(t){var i=e.player.api.currentTime-t;var r=t-e.player.api.duration;e.log("Seeking to "+MistUtil.format.time(t)+" ("+Math.round(r*-10)/10+"s from live)");e.player.videojs.currentTime(e.video.currentTime-i)};var v=0;u.get.currentTime=function(){if(e.info){v=e.info.lastms*.001}var t=e.player.videojs?e.player.videojs.currentTime():r.currentTime;if(isNaN(t)){return 0}return t};u.get.buffered=function(){var t=e.player.videojs?e.player.videojs.buffered():r.buffered;return{length:t.length,start:function(e){return t.start(e)},end:function(e){return t.end(e);e}}}}}else{i.api=r}e.player.setSize=function(t){if("videojs"in e.player){e.player.videojs.dimensions(t.width,t.height);r.parentNode.style.width=t.width+"px";r.parentNode.style.height=t.height+"px"}this.api.style.width=t.width+"px";this.api.style.height=t.height+"px"};e.player.api.setSource=function(t){if(!e.player.videojs){return}if(e.player.videojs.src()!=t){e.player.videojs.src({type:e.player.videojs.currentSource().type,src:t})}};e.player.api.setSubtitle=function(e){var t=r.getElementsByTagName("track");for(var i=t.length-1;i>=0;i--){r.removeChild(t[i])}if(e){var o=document.createElement("track");r.appendChild(o);o.kind="subtitles";o.label=e.label;o.srclang=e.lang;o.src=e.src;o.setAttribute("default","")}};if(e.info.type=="live"){var y=MistUtil.event.addListener(r,"loadstart",function(e){MistUtil.event.removeListener(y);MistUtil.event.send("canplay",false,this)});var m=MistUtil.event.addListener(r,"canplay",function(e){if(y){MistUtil.event.removeListener(y)}MistUtil.event.removeListener(m)})}t(r)}if("videojs"in window){o()}else{var s=false;function n(){try{e.video.pause()}catch(e){}e.showError("Error in videojs player");if(!window.mistplayer_videojs_failures){window.mistplayer_videojs_failures=1;e.reload()}else{if(!s){var t=.05*Math.pow(2,window.mistplayer_videojs_failures);e.log("Rate limiter activated: MistPlayer reload delayed by "+Math.round(t*10)/10+" seconds.","error");s=e.timers.start(function(){s=false;delete window.videojs;e.reload()},t*1e3);window.mistplayer_videojs_failures++}}}var a=e.urlappend(mistplayers.videojs.scriptsrc(e.options.host));var l;var d=function(e,t,i,r,o){if(!l){return}if(t==l.src){window.removeEventListener("error",d);n()}return false};window.addEventListener("error",d);l=MistUtil.scripts.insert(a,{onerror:function(t){var i="Failed to load videojs.js";if(t.message){i+=": "+t.message}e.showError(i)},onload:o},e)}};