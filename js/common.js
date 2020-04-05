/*------------------------------------------
 Vue設定
--------------------------------------------*/
// Vueストア
let store = '';

// ミックスイン
let mixin = '';

// マウント先
const vMountTarget = '#app';

// インスタンス
let vm = '';

/*------------------------------------------
 Vue
--------------------------------------------*/
if (document.querySelectorAll(vMountTarget).length > 0) {
 // ストアを初期化
 store = new Vuex.Store(initStore());

 // ミックスイン定義
 mixin = initMixin();

 vm = new Vue({
  // マウント先
  el: vMountTarget,
  // ミックスイン
  mixins: [mixin],
  // ストア
  store: store,
  // データ
  data: {
   dataTotal: {},
   dataPref: [],
   casesNum: 0,
   deathsNum: 0,
  },
  // 各処理
  methods: {
   // 県ごとのデータを取得する処理
   getDataPref: function () {
    store.commit('setPageStatus', 'loading');
    let self = this;
    axios
     .post('api/get_data_pref.php?v=' + getDateTime())
     .then(function (res) {
      const resData = res.data.result;
      const status = resData.status;
      const data = resData.data;

      self.dataPref = {};
      self.casesNum = 0;
      self.deathsNum = 0;

      // データの取得に成功した場合
      if (status === 'success' && data != null) {
       self.dataPref = data;
       for (
        let i = 0, iLength = self.dataPref.length;
        i < iLength;
        i = (i + 1) | 0
       ) {
        const thisData = self.dataPref[i];
        self.casesNum += thisData.cases;
        self.deathsNum += thisData.deaths;
       }
       store.commit('setPageStatus', 'success');
      }
      // 失敗した場合
      else {
       store.commit('setPageStatus', 'error');
      }
     })
     .catch(function (err) {
      store.commit('setPageStatus', 'error');
     });
   },
   // 国内の様々なデータを取得する処理
   getDataTotal: function () {
    let self = this;
    axios
     .post('api/get_data_total.php?v=' + getDateTime())
     .then(function (res) {
      const resData = res.data.result;
      const status = resData.status;
      const data = resData.data;

      self.dataTotal = {};

      // データの取得に成功した場合
      if (status === 'success') {
       self.dataTotal = data;
      }
     })
     .catch(function (err) {});
   },
  },
  // インスタンスが作成された後に実行する処理
  created: function () {
   // 県ごとのデータを取得する
   this.getDataPref();
  },
  // インスタンスがマウントされた後に実行する処理
  mounted: function () {},
  // 算出処理
  computed: {},
  // 監視処理
  watch: {},
 });
}
