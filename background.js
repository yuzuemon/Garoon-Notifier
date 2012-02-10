var URL = "http://portal/cgi-bin/cbgrn/grn.cgi/notification/pending_list";
var LIMIT = 4;
var LIMIT_COUNT = Math.pow(10, LIMIT);
var BADGECOUNT = 0;

// badge
function check(){
  var xhr = new XMLHttpRequest();
  xhr.open('Get', URL, true);
  xhr.onload = function(){
    var res = xhr.responseText;
    var count = parseInt(res.match(/[0-9]+件/)[0].replace('件', ''), 10);
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

function update(count){
  if(parseInt(count, 10) >= LIMIT_COUNT){
    count = notation(parseInt(count,10), LIMIT+1);
  }
  chrome.browserAction.setBadgeText({text: count});
  if (BADGECOUNT != count){
    notification(BADGECOUNT - count);
  }
  BADGECOUNT = count;
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
function notification(count){
  // xhrでcountの数だけ新着取得
  // その数だけ出力
  webkitNotifications.createNotification('logo.ico', 'title', 'ほげ').show();
}

check();

setInterval(function(){
  check();
}, 60 * 1000);


// notification
webkitNotifications.createNotification('logo.ico', 'title', 'ほげ').show();

