var URL = "http://portal/cgi-bin/cbgrn/grn.cgi/notification/pending_list";
var w = window;
var d = w.document;

function write(html){
  d.querySelector('#wrapper').innerHTML=html;
}

function popup(){
  var xhr = new XMLHttpRequest();
  xhr.open('Get', URL, true);
  xhr.onload = function(){
    var res = xhr.responseText;
    var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/);
    write(unreadTable);
  };
  xhr.onerror = function(){
    write('<a href=' + URL + '>');
  };
  xhr.send(null);
}

popup();
