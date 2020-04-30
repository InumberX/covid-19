/*------------------------------------------
 Vueストア
--------------------------------------------*/
function initStore() {
 return {
  // ストアで管理するデータ
  state: {
   pageStatus: 'loading',
   checkedPref: [],
   sortPref: {
    target: '',
    mode: '',
   },
   isModal: false,
   historySeletedDateStart: '',
   historySeletedDateEnd: '',
   predictSeletedDateStart: '',
   predictSeletedDateEnd: '',
  },
  // stateのデータを直接操作するための関数
  mutations: {
   setPageStatus: function (state, data) {
    state.pageStatus = data;
   },
   setCheckedPref: function (state, data) {
    state.checkedPref = data;
   },
   setSortPrefTarget: function (state, data) {
    state.sortPref.target = data;
   },
   setSortPrefMode: function (state, data) {
    state.sortPref.mode = data;
   },
   setIsModal: function (state, data) {
    state.isModal = data;
   },
   setHistorySeletedDateStart: function (state, data) {
    state.historySeletedDateStart = data;
   },
   setHistorySeletedDateEnd: function (state, data) {
    state.historySeletedDateEnd = data;
   },
   setPredictSeletedDateStart: function (state, data) {
    state.predictSeletedDateStart = data;
   },
   setPredictSeletedDateEnd: function (state, data) {
    state.predictSeletedDateEnd = data;
   },
  },
 };
}
