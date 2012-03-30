w.addEventListener('load', function(){
  var view_unread = d.querySelector('#view_unread');
  var view_today  = d.querySelector('#view_today');

  view_unread.addEventListener('click',function(){
    unread();
  }, false);
  view_today.addEventListener('click',function(){
    oneday(true);
  }, false);
  view_tomorrow.addEventListener('click',function(){
    oneday(false);
  }, false);
}, false);

function write(html){
  d.querySelector('#wrapper').innerHTML = html;
}

function unread(){
  var unreadXhr = function(res){
    if(res && res.search(/<table class="list_column">[\s\S]*?<\/table>/) != -1){
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<input .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      write(unreadTable);

      var links = d.querySelectorAll('a');
      for(var i = 0, len = links.length; len > i; i++){
        links[i].target = '_blank';
      }
    } else {
      write('<a target="_blank" href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(UNREAD_URL, unreadXhr);
}

function oneday(isToday){
  var onedayXhr = function(res){
    if(res && res.search(/<tr class="schedule_user_tr">[\s\S]*?<\/td>/) != -1){
      if(isToday){
        var onedayTd = res.match(/<td valign="top" class="s_user_week">[\s\S]*?<\/td>/)[0];
      } else {
        var onedayTd = res.match(/<td valign="top" class="s_user_week">[\s\S]*?<\/td>/g)[1];
      }
      onedayTd = onedayTd.replace(/<script .*?>/g, '');
      onedayTd = onedayTd.replace(/<button .*?>/g, '');
      onedayTd = onedayTd.replace(/<input .*?>/g, '');
      onedayTd = onedayTd.replace(/<img .*?>/g, '');
      onedayTd = onedayTd.replace(/<a href="\/cgi-bin/g, '<a href="http://portal/cgi-bin');
      write(onedayTd);

      var links = d.querySelectorAll('a');
      for(var i = 0, len = links.length; len > i; i++){
        links[i].target = '_blank';
      }
    } else {
      write('<a target="_blank" href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(PORTAL_URL, onedayXhr);
}

unread();
