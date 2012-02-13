w.addEventListener('load', function(){
  var view_unread = d.querySelector('#view_unread');
  var view_today  = d.querySelector('#view_today');
  var view_portal = d.querySelector('#view_portal');
  console.log(view_unread)

  view_unread.addEventListener('click',function(){
    popup();
  }, false);
  view_today.addEventListener('click',function(){
    alert('まだつくってない');
  }, false);
  view_portal.addEventListener('click',function(){
    alert('まだつくってない');
  }, false);

}, false);

function write(html){
  d.querySelector('#wrapper').innerHTML = html;
}

function popup(){
  var popupXhr = function(res){
    if(res){
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
    } else {
      write('<a href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(UNREAD_URL, popupXhr);
}

popup();
