if(typeof opera === 'object'){
  var itemProperties = {
    title: 'Garoon Notifier',
    icon: 'logo.ico',
    badge: {
      display: 'block',
      textContent: 'hoge'
    },
    popup: {
      href: 'popup.html',
    }
  }
  var extensionButton = opera.contexts.toolbar.createItem(itemProperties);
  opera.contexts.toolbar.addItem(extensionButton);
} else {
  var BackGround = this;
  BackGround.notification = [];
}

function notation(count, i){
  if(count < Math.pow(10, i)){
    var _i = i-2;
    return Math.floor(count / Math.pow(10, _i)) + 'e' + _i;
  } else {
    return notation(count, ++i);
  }
}

function badge(){
  var badgeXhr = function(res){
    if(res && res.search(/[0-9]+件/) != -1){
      var count = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if(UNREAD_COUNT != count){
        update(count);
      }
    } else {
      update('!');
    }
    UNREAD_COUNT = count;
    setTimeout(badge, 60 * 1000);
  }
  get(UNREAD_URL, badgeXhr);
}


function update(count){
  if(parseInt(count, 10) >= LIMIT_COUNT){
    count = notation(parseInt(count,10), PLACE_LIMIT+1);
  }
  if(typeof opera === 'object'){
    extensionButton.badge.textContent = String(count);
  } else {
    chrome.browserAction.setBadgeText({text: String(count)});
  }
  // てすと
  // notify(1);
  if(UNREAD_COUNT == '!'){
    notify(count);
  } else {
    notify(UNREAD_COUNT - count);
  }
}


function notify(count){
  var notifyXhr = function(res){
    var unreadEvents = '';
    if(res && res.search(/<table class="list_column">[\s\S]*?<\/table>/) != -1){
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      unreadEvents = unreadTable.match(/<td.*?<\/td>/gm);
    }

    // show notification
    if (typeof opera === 'object'){

    } else {
      for(var i = 0, l = unreadEvents.length; l > i; i+=5){
        var info = {};
        info.event  = unreadEvents[i+1].replace(/<.*?>/g, '');
        info.status = unreadEvents[i+2].replace(/<.*?>/g, '');
        info.user   = unreadEvents[i+3].replace(/<.*?>/g, '');
        info.time   = unreadEvents[i+4].replace(/<.*?>/g, '');
        info.link   = unreadEvents[i+1].match(/http:\/\/.*bdate/, '')[0].replace(/&amp;bdate/, '').replace(/&amp;/, '&');
        BackGround.notification.push(info);
      }
      if(count > NOTICE_LIMIT) count = NOTICE_LIMIT;
      showNotify(count);
    }
  }
  get(UNREAD_URL, notifyXhr);
}


function showNotify(count){
  if(count > 0 && BackGround.notification.length > 0){
    // var info = BackGround.notification.pop();
    // var text = info.title + info.status + info.time;
    // webkitNotifications.createNotification('', '', text).show();
    webkitNotifications.createHTMLNotification('/notification.html').show();
    setTimeout(showNotify(--count), 1000);
  }
}

badge();
