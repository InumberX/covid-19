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
  data: {},
  // 各処理
  methods: {
   // 県ごとのデータを取得する処理
   getDataPref: function() {
    let self = this;
    axios
     .post('https://covid19-japan-web-api.now.sh/api/v1/prefectures')
     .then(function(res) {
      console.log(res);
     })
     .catch(function(err) {});
   }
  },
  // インスタンスが作成された後に実行する処理
  created: function() {
   // 県ごとのデータを取得する
   this.getDataPref();
  },
  // インスタンスがマウントされた後に実行する処理
  mounted: function() {},
  // 算出処理
  computed: {},
  // 監視処理
  watch: {}
 });
}
