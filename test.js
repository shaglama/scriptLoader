var div1 = document.createElement('div');
div1.id="container";
document.getElementsByTagName('body')[0].appendChild(div1);
 var i;
 
 for(i = 0; i < 1000; i++){
 	div1.innerHTML=i;
 }
 //alert("test.js loaded");