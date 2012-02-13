var BG = this;

function notation(count, i){
  if(count < Math.pow(10, i)){
    var _i = i-2;
    return Math.floor(count / Math.pow(10, _i)) + 'e' + _i;
  } else {
    return notation(count, ++i);
  }
}

function check(){
  var checkXhr = function(res){
    if(res){
      var unreadCount = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if(unreadCount >= 0){
        update(unreadCount);
        setTimeout(check, 60 * 1000);
      } else {
        update('!');
      }
    } else {
      update('!');
    }
  }
  get(UNREAD_URL, checkXhr);
}

function update(count){
  if(parseInt(count, 10) >= LIMIT_COUNT){
    count = notation(parseInt(count,10), LIMIT+1);
  }
  chrome.browserAction.setBadgeText({text: String(count)});
  //test
  // notify(1);
  if (UNREAD_COUNT != count){
    notify(UNREAD_COUNT - count);
  }
  UNREAD_COUNT = count;
}

function notify(count){
  var notifyXhr = function(res){
    var unreadEvents = '';
    if(res){
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      var unreadTds = unreadTable.match(/<td.*?<\/td>/gm);
      console.log('in notifyXhr')
    }
    BG.notification = {};
    console.log(unreadTds)
    console.log(unreadTds.length)
    for(var i = 0, len = unreadTds.length; len > i; i+=5){
      var obj = {};
      obj.title  = unreadTds[i+1].replace(/<.*?>/g, '');
      obj.status = unreadTds[i+2].replace(/<.*?>/g, '');
      obj.user   = unreadTds[i+3].replace(/<.*?>/g, '');
      obj.time   = unreadTds[i+4].replace(/<.*?>/g, '');
      BG.notification = obj;
    }
    webkitNotifications.createHTMLNotification('/notification.html').show();
  }
  get(UNREAD_URL, notifyXhr);
}

check();
