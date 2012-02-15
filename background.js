if(typeof opera != 'undefined'){
  var ToolbarUIItemProperties = {
    title: 'Garoon Notifier',
    icon: 'logo.ico',
    badge: {
      display: 'block',
      textContent: 'hoge'
    },
    popup: {
      href: 'popup.html',
      width: 370
    }
  }
  var extensionButton = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
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

function check(){
  var checkXhr = function(res){
    if(res && res.search(/[0-9]+件/) != -1){
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
  console.log(count)
  if(typeof opera != 'undefined'){
    console.log('opera badge update')
    console.log(ToolbarUIItemProperties.badge.textContent)
    ToolbarUIItemProperties.badge.textContent = String('aa');
    // ToolbarUIItemProperties.badge.textContent = String(count);
  } else {
    chrome.browserAction.setBadgeText({text: String(count)});
  }
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
    if(res && res.search(/<table class="list_column">[\s\S]*?<\/table>/) != -1){
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      unreadEvents = unreadTable.match(/<td.*?<\/td>/gm);
    }
    console.log(unreadEvents)
    console.log(unreadEvents.length)

    // show notification
    if (typeof opera != 'undefined'){

    } else {
      for(var i = 0, len = unreadEvents.length; len > i; i+=5){
        var obj = {};
        obj.title  = unreadEvents[i+1].replace(/<.*?>/g, '');
        obj.status = unreadEvents[i+2].replace(/<.*?>/g, '');
        obj.user   = unreadEvents[i+3].replace(/<.*?>/g, '');
        obj.time   = unreadEvents[i+4].replace(/<.*?>/g, '');
        obj.link   = unreadEvents[i+1].match(/http:\/\/.*bdate/, '')[0].replace(/&amp;bdate/, '').replace(/&amp;/, '&');
        BackGround.notification.push(obj);
        webkitNotifications.createHTMLNotification('/notification.html').show();
      }
    }
  }
  get(UNREAD_URL, notifyXhr);
}

check();
