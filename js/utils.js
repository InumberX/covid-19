/*------------------------------------------
 変数
--------------------------------------------*/
// ブレイクポイント
const bp = 767;

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
 speedAsDuration: true
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
