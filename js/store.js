/*------------------------------------------
 Vueストア
--------------------------------------------*/
function initStore() {
 return {
  // ストアで管理するデータ
  state: {
   pageStatus: 'loading',
  },
  // stateのデータを直接操作するための関数
  mutations: {
   setPageStatus: function (state, data) {
    state.pageStatus = data;
   },
  },
 };
}
