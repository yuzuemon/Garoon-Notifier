w.addEventListener('load', function(){
  var view_unread = d.querySelector('#view_unread');
  var view_today  = d.querySelector('#view_today');

  view_unread.addEventListener('click',function(){
    unread();
  }, false);
  view_today.addEventListener('click',function(){
    today();
  }, false);
  view_tomorrow.addEventListener('click',function(){
    tomorrow();
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
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      write(unreadTable);

      var links = d.querySelector('a');
      for (var i = 0, len = links.length; len > i; i++){
        links[i].target = "_blank";
      }
    } else {
      write('<a target="_blank" href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(UNREAD_URL, unreadXhr);
}

function today(){
  var todayXhr = function(res){
    if(res && res.search(/<tr class="schedule_user_tr">[\s\S]*?<\/td>/) != -1){
      var todayTd = res.match(/<td valign="top" class="s_user_week">[\s\S]*?<\/td>/)[0];
      todayTd = todayTd.replace(/<script .*?>/g, '');
      todayTd = todayTd.replace(/<button .*?>/g, '');
      todayTd = todayTd.replace(/<input .*?>/g, '');
      todayTd = todayTd.replace(/<img .*?>/g, '');
      todayTd = todayTd.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      write(todayTd);

      var links = d.querySelector('a');
      for (var i = 0, len = links.length; len > i; i++){
        links[i].target = "_blank";
      }
    } else {
      write('<a target="_blank" href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(PORTAL_URL, todayXhr);
}

function tomorrow(){
  var todayXhr = function(res){
    if(res && res.search(/<tr class="schedule_user_tr">[\s\S]*?<\/td>/) != -1){
      var tomorrowTd = res.match(/<td valign="top" class="s_user_week">[\s\S]*?<\/td>/g)[1];
      tomorrowTd = tomorrowTd.replace(/<script .*?>/g, '');
      tomorrowTd = tomorrowTd.replace(/<button .*?>/g, '');
      tomorrowTd = tomorrowTd.replace(/<input .*?>/g, '');
      tomorrowTd = tomorrowTd.replace(/<img .*?>/g, '');
      tomorrowTd = tomorrowTd.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      write(tomorrowTd);

      var links = d.querySelector('a');
      for (var i = 0, len = links.length; len > i; i++){
        links[i].target = "_blank";
      }
    } else {
      write('<a target="_blank" href=' + PORTAL_URL + '>ログイン画面</a>へ');
    }
  }
  get(PORTAL_URL, todayXhr);
}

unread();
