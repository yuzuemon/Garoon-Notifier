(function(){
  window.addEventListener('load', function(){
    var notificationList = JSON.parse(localStorage.notificationList);
    var info = notificationList.shift();
    var status = info.status;
    var lebel = d.querySelector('#label');
    if(status == '登録'){
      label.className = 'label-new';
      label.innerHTML = 'New';
    } else if (status == '変更') {
      label.className = 'label-change';
      label.innerHTML = 'Change';
    } else if (status == '削除') {
      label.className = 'label-delete';
      label.innerHTML = 'Delete';
    } else {
      label.className = 'label-comment';
      label.innerHTML = 'Comment';
      d.querySelector('#status').innerText = status;
    }
    d.querySelector('#event').innerText = info.event;
    d.querySelector('#time').innerText = info.time;
    d.querySelector('#user').innerText = info.user;
    d.querySelector('#link').href = info.link;

    d.querySelector('#view').addEventListener('click', function(){
      // localStorage.unreadCount--;
      close();
    }, false);

    localStorage.notificationList = JSON.stringify(notificationList);

  }, false);
})();
