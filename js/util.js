// localStorage
localStorage.PORTAL_URL = 'http://portal/cgi-bin/cbgrn/grn.cgi';
localStorage.UNREAD_URL = 'http://portal/cgi-bin/cbgrn/grn.cgi/notification/pending_list';
localStorage.NOTIFICATION_LIMIT = 3;

// sessionStorage
sessionStorage.unreadCount = '!';

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
