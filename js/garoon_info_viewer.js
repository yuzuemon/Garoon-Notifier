// ==UserScript==
// @name      garoon_info_viwer.js
// @namespace yuzuemon
// @include   http://portal/cgi-bin/cbgrn/grn.cgi/schedule/view?*
// ==/UserScript==

(function(){
  // oyakusoku
  var w = window;
  var d = w.document;

  // get shortlink
  var url = d.location.href.split('&bdate')[0];
  var name = d.querySelector('.schedule').innerText;

  var div = d.createElement('div');
  div.id = 'docs_info_viewer';
  div.class = 'userjs';

  var ai = d.createElement('input');
  ai.value = '[予定] ' + name + ' - ' + url;
  ai.type = 'text';
  ai.readOnly = true;
  ai.onclick = function(){this.select(0, this.value.length);};
  ai.style.borderWidth = '0';
  ai.style.background = '#00ff99';
  div.appendChild(ai);

  var css = div.style;
  css.height = 'auto';
  css.width = 'auto';
  css.position = 'fixed';
  css.padding = '5px 5px 10px 5px';
  css.margin = '0pt';
  css.zIndex = '1001';
  css.fontSize = '14px';
  css.fontWeight = 'bold';
  css.color = '#242424';
  css.backgroundColor = '#00ff99';
  css.WebkitBorderRadius = '15px 0px 0px 0px';
  css.borderRadius = '15px 0px 0px 0px';
  css.opacity = '0.8';
  css.textAlign = 'left';
  css.right = '0px';
  css.bottom = '-34px';

  // auto hide, show
  var timeout;
  var interval;
  var behindBox = function(step, wait){
    clearTimeout(timeout);
    clearInterval(interval);

    timeout = setTimeout(function(){
      var bottom = css.bottom.replace('px', '');
      var height = div.clientHeight;
      interval = setInterval(function(){
        css.bottom = bottom-- + 'px';
        if(height <= - bottom + 2) return clearInterval(interval);
      }, step);
    }, wait);
  }

  var showBox = function(step){
    clearTimeout(timeout);
    clearInterval(interval);
    var bottom = css.bottom.replace('px', '') - 0;
    interval = setInterval(function(){
      bottom += 2;
      if(bottom > 0){
        css.bottom = '0px';
        return clearInterval(interval);
      }
      css.bottom = bottom + 'px';
    }, step);
  }

  // add event
  div.addEventListener('mouseover', function(){showBox(10)}, false);
  div.addEventListener('mouseout', function(){behindBox(10, 200)}, false);
  d.body.appendChild(div);
  //behindBox(20, 1000);
})();

