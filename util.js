var PORTAL_URL = 'http://portal/cgi-bin/cbgrn/grn.cgi';
var UNREAD_URL = 'http://portal/cgi-bin/cbgrn/grn.cgi/notification/pending_list';

var NOTICE_LIMIT = 3;
var PLACE_LIMIT = 4;
var LIMIT_COUNT = Math.pow(10, PLACE_LIMIT);
var UNREAD_COUNT = '!';

var w = window;
var d = w.document;

// XMLHttpRequest
function get(url, execute){
  var xhr = new XMLHttpRequest();
  xhr.open('Get', url, true);
  xhr.onload = function(){
    var res = xhr.responseText;
    execute(res);
  };
  xhr.onerror = function(){
    execute();
  };
  xhr.send('');
}
