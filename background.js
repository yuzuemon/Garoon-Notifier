// badge
function check(){
  var checkBadge = function(res){
    if(res){
      var unreadCount = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if(unreadCount >= 0){
        updateBadge(unreadCount);
        setTimeout(check, 60 * 1000);
      } else {
        updateBadge('!');
      }
    } else {
      updateBadge('!');
    }
  }
  get(UNREAD_URL, checkBadge);
}

function updateBadge(count){
  if(parseInt(count, 10) >= LIMIT_COUNT){
    count = notation(parseInt(count,10), LIMIT+1);
  }
  chrome.browserAction.setBadgeText({text: String(count)});
  if (UNREAD_COUNT != count){
    notification(UNREAD_COUNT - count);
  }
  UNREAD_COUNT = count;
}

function notation(count, i){
  if(count < Math.pow(10, i)){
    var _i = i-2;
    return Math.floor(count / Math.pow(10, _i)) + 'e' + _i;
  } else {
    return notation(count, ++i);
  }
}

// webkitNotification
function getTable(count){
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
    // write(unreadTable);
    var bg = this;
    var callback = function(){
      bg.message = 'h1';
      var notification = webkitNotification.createHTMLNotification('/notification.html').show
    }
    if(count >= 0){
      update(String(count));
      setTimeout(check, 60 * 1000);
    } else {
      update('!');
    }
  };
  xhr.onerror = function(){
    update('!');
  };
  xhr.send(null);
}
function notification(count){
  // xhrでcountの数だけ新着取得
  // getTable(count);
  for (var i = 0, len = count; count > i; i++){
    webkitNotifications.createNotification('logo.ico', 'title', '新着イベントアリ').show();
  }
}

check();

setInterval(function(){
  check();
}, 60 * 1000);


// notification
webkitNotifications.createNotification('logo.ico', 'title', 'ほげ').show();
webkitNotifications.createNotification('logo.ico', 'title', 'ふげ').show();
webkitNotifications.createHTMLNotification('./notification.html').show;

