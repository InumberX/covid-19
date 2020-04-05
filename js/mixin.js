/*------------------------------------------
 Vueミックスイン
--------------------------------------------*/
function initMixin() {
 return {
  // データ
  data: function () {
   return {};
  },
  // 各処理
  methods: {
   // スクロールさせる処理
   scrollPage: function (target) {
    actSmoothScroll(target);
   },
  },
 };
}
