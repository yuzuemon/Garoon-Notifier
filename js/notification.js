(function(){
  window.addEventListener('load', function(){
    var BackGround = chrome.extension.getBackgroundPage();
    var notice = BackGround.notification.shift();
    var status = notice.status;
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
    d.querySelector('#event').innerText = notice.event;
    d.querySelector('#time').innerText = notice.time;
    d.querySelector('#user').innerText = notice.user;
    d.querySelector('#link').href = notice.link;

    d.querySelector('#view').addEventListener('click', function(){
      close();
    }, false);

  }, false);
})();
