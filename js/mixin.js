/*------------------------------------------
 Vueミックスイン
--------------------------------------------*/
function initMixin() {
 return {
  // データ
  data: function () {
   return {
    storageNameCheckedPref: 'checked_pref',
   };
  },
  // 各処理
  methods: {
   // スクロールさせる処理
   scrollPage: function (target) {
    actSmoothScroll(target);
   },
   // モーダルを開く処理
   openModal: function () {
    store.commit('setIsModal', true);
   },
   // モーダルを閉じる処理
   closeModal: function () {
    store.commit('setIsModal', false);
   },
   // 選択した都道府県を保存する処理
   setCheckedPref: function () {
    // localStorageが使用できる場合
    if (window.localStorage) {
     // localStorageのデータを削除
     window.localStorage.removeItem(this.storageNameCheckedPref);

     // localStorageにデータを追加
     localStorage.setItem(
      this.storageNameCheckedPref,
      JSON.stringify(store.state.checkedPref)
     );
    }
   },
   // 保存した都道府県を取得する処理
   getCheckedPref: function () {
    // localStorageが使用できる場合
    if (window.localStorage) {
     // ニュースレター情報を取得する
     const storageData = localStorage.getItem(this.storageNameCheckedPref);

     // データを取得できた場合
     if (storageData != null && storageData !== '') {
      const realData = JSON.parse(storageData);
      store.commit('setCheckedPref', realData);
     }
    }
   },
  },
 };
}
