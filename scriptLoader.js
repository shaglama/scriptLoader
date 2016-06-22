function ScriptLoader(config,doneCallback,errorCallback){
	//***** Private Members ****************************************************
	var 	scripts,
			parent,
			done,
			oldOnload,
			mode;
	
	//***** Public Members *****************************************************
	this.loadFile = loadFile;
	this.loadText = loadText;
	//***** Initialize *********************************************************
	//attach init to document as soon as DOM is ready
	if(document.addEventListener){
		//Modern
		document.addEventListener("DOMContentLoaded",init);
	} else {
		//Old IE
		if(window.attachEvent){
			document.attachEvent("onreadystatechange",function(){
				if ( document.readyState === "interactive" ) {
					document.detachEvent( "onreadystatechange", arguments.callee );
					init();
				}
			});
		} else {
			//use fallback
			oldOnload = window.onload;	
			window.onload = function(){
				oldOnload && oldOnload();
				init();
			};
		}
	}	
	
	
	//***** Private Methods ****************************************************
	function init(){
		scripts = [];
		done = [];	
		if(config){
			if(config.scripts){
				scripts = config.scripts;
			}
			if(config.appendTo){
				switch(config.appendTo){
					case "head":
					//append to head
						parent = document.getElementsByTagName('head')[0];
						break;
					case "body":
					//append to body
						parent = document.getElementsByTagName('body')[0];
						break;
					case "default":
					//use default,attatch to parent of first script
						parent = document.getElementsByTagName('script')[0].parentNode;	
						break;
					default:
					//invalid value, use default, attatch to parent of first script
						parent = document.getElementsByTagName('script')[0].parentNode;	
				}
			} else {
				//use default,attatch to parent of first script
				parent = document.getElementsByTagName('script')[0].parentNode;	
			}
			if(config.mode){
				mode = config.mode;
			} else {
				//use default
				mode = "fastSync";
			}
		}
		switch(mode){
			case "sync":
				syncLoad(0,function(){doneCallback();});
				break;
			case "fastSync":
				fastSyncLoad(function(){doneCallback();});
				break;
			case "async":
				asyncLoad(function(){doneCallback();});
				break;
			default:
			//error, invalid mode
		}
	}
	function fastSyncLoad(callback){
		var 	i,
				max = scripts.length,
				req = [],
				done = -1,
				script;				
		for(i = 0; i < max; i++){
			req[i] = new XMLHttpRequest();
			req[i].reqId = i;
			req[i].addEventListener("load",function(){
				load(this.reqId,this.responseText,callback);
			});
			req[i].open("GET",/*"/scriptLoader/"+ */scripts[i]);
			req[i].send();
		}
		function load(index,text,callback){
			var script;
			if(index - 1 == done){
				//create script
				script = createScript();
				script.text = text;
				appendScript(script);
				done++;
				if(done +1 == max){
					//done
					callback();
				}
			} else {
				setTimeout(function(){
					load(index,text,callback);
				},10);
			}
		}		
	}
	function asyncLoad(callback){
		var max = scripts.length,
			done = 0,
			i,
			script;
		for(i = 0; i < max; i++){
			script = createScript(scripts[i]);
			addCallback(script,function(){
				done++;
			});
			appendScript(script);
			
		}
		asyncCheckDone(callback);
		function asyncCheckDone(callback){
			if(done == max){
				callback();
			} else {
				setTimeout(function(){
					asyncCheckDone(callback);
				},5);
			}
		}
		
	}
	function syncLoad(start,callback){
		var max = scripts.length,
			doneMax = done.length,
			i;
		
		if(start >= max){
			//all scripts done
			callback();			
		} else {
			//script not loaded yet, load it
			//create script element
				var script = createScript(scripts[start]);
				//add callback
				addCallback(script, function(){
					done.push(scripts[start]);
					syncLoad(start + 1,callback);
				});
				//add script to dom
				appendScript(script);				
			
		}
	}
	function loadFile(src,callback){
		var script = createScript(src);
		addCallback(script,callback);
		appendScript(script);
	}
	function loadText(scriptText,callback){
		var script = createScript();
		script.text = scriptText;
		addCallback(script, callback);
		appendScript(script);
	}
	function createScript(src, id){
		var script = document.createElement('script');
		script.type = "text/javascript";
		if(id){
			script.id = id;
		}
		if(src){
			script.src = src;
		}		
		return script;
	}
	function addCallback(script,callback){
		script.onload = function(){
			callback();
		};
		return true;
	}
	function appendScript(script){
		parent.appendChild(script);
		return true;
	}
}