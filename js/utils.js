/*------------------------------------------
 変数
--------------------------------------------*/
// ブレイクポイント
const bp = 767;
// グラフ
let graph = [];

/*------------------------------------------
 スムーススクロール
--------------------------------------------*/
const headerId = '#header';
const scrollOffset = 20;
let smoothScroll = new SmoothScroll();
const smoothScrollOption = {
 // スクロール位置をずらす距離
 offset: scrollOffset,
 // URLを書き換えるかどうか
 updateURL: false,
 // スクロール速度（1000pxのスクロールにかかる時間をミリ秒単位で指定）
 speed: 300,
 // スクロール距離を無視するかどうか
 speedAsDuration: true,
};

function actSmoothScroll(target) {
 const targets = document.querySelectorAll(target);
 // スクロール先が存在する場合
 if (targets.length > 0) {
  smoothScrollOption.offset = scrollOffset;
  const anchor = targets[0];
  smoothScroll.animateScroll(anchor, '', smoothScrollOption);
 }
 return false;
}

/*------------------------------------------
 現在日時を取得
--------------------------------------------*/
function getDate(tx) {
 let now = new Date();
 if (tx != null && tx !== '') {
  now = new Date(tx);
 }
 const year = now.getFullYear();
 const month = zeroPadding(now.getMonth() + 1, 2);
 const date = zeroPadding(now.getDate(), 2);
 const nowDate = year + '/' + month + '/' + date;
 return nowDate;
}

function getDateTime(tx) {
 let now = new Date();
 if (tx != null && tx !== '') {
  now = new Date(tx);
 }
 const year = now.getFullYear();
 const month = zeroPadding(now.getMonth() + 1, 2);
 const date = zeroPadding(now.getDate(), 2);
 const hours = zeroPadding(now.getHours(), 2);
 const minutes = zeroPadding(now.getMinutes(), 2);
 const seconds = zeroPadding(now.getSeconds(), 2);
 const nowDate = year + month + date + hours + minutes + seconds;
 return nowDate;
}

/*------------------------------------------
 0埋め
--------------------------------------------*/
function zeroPadding(num, length) {
 let zero = '';
 for (let i = 0; i < length; i = (i + 1) | 0) {
  zero += '0';
 }
 return (zero + num).slice(-length);
}
