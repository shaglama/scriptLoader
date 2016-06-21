var container = document.createElement('div');
document.body.appendChild(container);
container.innerHTML="testing ";
alert("hello");
loader.loadText("alert('whats up');",function(){});
loader.loadFile("test.js",function(){});