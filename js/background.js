// init
localStorage.unreadCount = '!';

if (typeof opera === 'object') {
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
}



// get Unread Count
function getUnreadCount(){
  var unreadCountXhr = function(res){
    if (res && res.search(/[0-9]+件/) != -1) {
      var count = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
      if (localStorage.unreadCount != count) {
        updateBadge(count);
      }
    } else {
      updateBadge('!');
    }
    setTimeout(getUnreadCount, 30 * 1000);
  }
  get(localStorage.UNREAD_URL, unreadCountXhr);
}
getUnreadCount();


function updateBadge(count) {
  if (typeof opera === 'object') {
    extensionButton.badge.textContent = String(count);
  } else {
    chrome.browserAction.setBadgeText({text: String(count)});
  }
  // Not notify at first connection
  if (localStorage.unreadCount != '!') {
    if (count > localStorage.NOTIFICATION_LIMIT) count = localStorage.NOTIFICATION_LIMIT;
    notificationXhr(count - localStorage.unreadCount);
    localStorage.unreadCount = count;
  }
  // てすと用
  // if (count > localStorage.NOTIFICATION_LIMIT) count = localStorage.NOTIFICATION_LIMIT;
  // notificationXhr(count)
}


// XHR for notification
function notificationXhr(count) {
  var notificationXHR = function(res) {
    var unreadEvents = '';
    if (res && res.search(/<table class="list_column">[\s\S]*?<\/table>/) != -1) {
      var unreadTable = res.match(/<table class="list_column">[\s\S]*?<\/table>/)[0];
      unreadTable = unreadTable.replace(/<script .*?>/g, '');
      unreadTable = unreadTable.replace(/<button .*?>/g, '');
      unreadTable = unreadTable.replace(/<img .*?>/g, '');
      unreadTable = unreadTable.replace(/<a class="" href="\/cgi-bin/g, '<a target="_blank" href="http://portal/cgi-bin');
      unreadTable = unreadTable.replace(/javascript:popupWin\('/g, 'javascript:window.open(\'http://portal');
      unreadEvents = unreadTable.match(/<td[\s\S]*?<\/td>/gm);
    }

    // make notificationList
    if (typeof opera === 'object') {
      // 後で作る
    } else {
      notificationList = [];
      for (var i = 0, l = unreadEvents.length; l > i; i+=5) {
        var info = {};
        info.event  = unreadEvents[i+1].replace(/<.*?>/g, '');
        info.status = unreadEvents[i+2].replace(/<.*?>/g, '');
        info.user   = unreadEvents[i+3].replace(/<.*?>/g, '');
        info.time   = unreadEvents[i+4].replace(/<.*?>/g, '');
        info.link   = unreadEvents[i+1].match(/http:\/\/.*bdate/gm)[0].replace(/&amp;bdate/, '').replace(/&amp;/, '&');
        notificationList.push(info);
      }
      localStorage.notificationList = JSON.stringify(notificationList);
      showNotificationWindow(count);
    }
  }
  get(localStorage.UNREAD_URL, notificationXHR);
}


// show notification window
function showNotificationWindow(count){
  if (count > 0){
    webkitNotifications.createHTMLNotification('./notification.html').show();
    setTimeout(showNotificationWindow, 1000, --count);
  }
}

