// init
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
      width: '500px',
      height: '230px'
    }
  }
  var extensionButton = opera.contexts.toolbar.createItem(itemProperties);
  opera.contexts.toolbar.addItem(extensionButton);
} else {
  var BackGround = this;
  BackGround.notification = [];
}


// get Unread Count
function getUnreadCount(){
  var unreadCountXhr = function(res){
    if(res && res.search(/[0-9]+件/) != -1){
      var count = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if(sessionStorage.unreadCount != count){
        updateBadge(count);
      }
    } else {
      updateBadge('!');
    }
    sessionStorage.unreadCount = count;
    setTimeout(getUnreadCount, 30 * 1000);
  }
  get(localStorage.UNREAD_URL, unreadCountXhr);
}
getUnreadCount();



function updateBadge(count){
  if(typeof opera === 'object'){
    extensionButton.badge.textContent = String(count);
  } else {
    chrome.browserAction.setBadgeText({text: String(count)});
  }
  // Not notify at first connection
  if(sessionStorage.unreadCount != '!'){
    if(count > localStorage.NOTICE_LIMIT) count = localStorage.NOTICE_LIMIT;
    notificationXhr(count - sessionStorage.unreadCount);
  }
  // てすと用
  // if(count > localStorage.NOTICE_LIMIT) count = localStorage.NOTICE_LIMIT;
  // notificationXhr(count)
}


// XHR for notification
function notificationXhr(count){
  var notificationXHR = function(res){
    var unreadEvents = '';
    if(res && res.search(/<table class="list_column">[\s\S]*?<\/table>/) != -1){
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      unreadEvents = unreadTable.match(/<td[\s\S]*?<\/td>/gm);
    }

    // make notificationList
    if(typeof opera === 'object'){
      // 後で作る
    } else {
      BackGround.notification = [];
      for (var i = 0, l = unreadEvents.length; l > i; i+=5){
        var info = {};
        info.event  = unreadEvents[i+1].replace(/<.*?>/g, '');
        info.status = unreadEvents[i+2].replace(/<.*?>/g, '');
        info.user   = unreadEvents[i+3].replace(/<.*?>/g, '');
        info.time   = unreadEvents[i+4].replace(/<.*?>/g, '');
        info.link   = unreadEvents[i+1].match(/http:\/\/.*bdate/gm)[0].replace(/&amp;bdate/, '').replace(/&amp;/, '&');
        BackGround.notification.push(info);
      }
      showNotificationWindow(count);
    }
  }
  get(localStorage.UNREAD_URL, notificationXHR);
}


// show notification window
function showNotificationWindow(count){
  if(count > 0 && BackGround.notification.length > 0){
    webkitNotifications.createHTMLNotification('/notification.html').show();
    setTimeout(showNotificationWindow(--count), 1000);
  }
}

