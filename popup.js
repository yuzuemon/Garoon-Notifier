function write(html){
  d.querySelector('#wrapper').innerHTML = html;
}

function popup(){
  var xhr = new XMLHttpRequest();
  xhr.open('Get', UNREAD_URL, true);
  xhr.onload = function(){
    var res = xhr.responseText;
    var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
    unreadTable = unreadTable.replace(/<script .*?>/g, '');
    unreadTable = unreadTable.replace(/<button .*?>/g, '');
    unreadTable = unreadTable.replace(/<img .*?>/g, '');
    unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
    unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
    write(unreadTable);

    var links = d.querySelector('a');
    for (var i = 0, len = links.length; len > i; i++){
      links[i].target = "_blank";
    }
  };
  xhr.onerror = function(){
    write('<a href=' + PORTAL_URL + '>ログイン画面</a>へ');
  };
  xhr.send(null);
}

popup();
