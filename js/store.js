/*------------------------------------------
 Vueストア
--------------------------------------------*/
function initStore() {
 return {
  // ストアで管理するデータ
  state: {
   pageStatus: 'loading',
   checkedPref: [],
   isModal: false,
  },
  // stateのデータを直接操作するための関数
  mutations: {
   setPageStatus: function (state, data) {
    state.pageStatus = data;
   },
   setCheckedPref: function (state, data) {
    state.checkedPref = data;
   },
   setIsModal: function (state, data) {
    state.isModal = data;
   },
  },
 };
}
