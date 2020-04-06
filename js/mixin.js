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
   openModal: function () {
    store.commit('setIsModal', true);
   },
   closeModal: function () {
    store.commit('setIsModal', false);
   },
  },
 };
}
