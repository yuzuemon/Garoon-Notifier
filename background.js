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
      var count = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if(UNREAD_COUNT != count){
        update(count);
      }
    } else {
      update('!');
    }
    UNREAD_COUNT = count;
    setTimeout(check, 60 * 1000);
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
  // てすと
  // notify(1);
  notify(UNREAD_COUNT - count);
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
      for(var i = 0, l = unreadEvents.length; l > i; i+=5){
        var info = {};
        info.title  = unreadEvents[i+1].replace(/<.*?>/g, '');
        info.status = unreadEvents[i+2].replace(/<.*?>/g, '');
        info.user   = unreadEvents[i+3].replace(/<.*?>/g, '');
        info.time   = unreadEvents[i+4].replace(/<.*?>/g, '');
        info.link   = unreadEvents[i+1].match(/http:\/\/.*bdate/, '')[0].replace(/&amp;bdate/, '').replace(/&amp;/, '&');
        BackGround.notification.push(info);
      }
      showNotify();
    }
  }
  get(UNREAD_URL, notifyXhr);
}


function showNotify(){
  if(BackGround.notification.length > 0){
    webkitNotifications.createHTMLNotification('/notification.html').show();
    setTimeout(showNotify, 1000);
  }
}

check();
