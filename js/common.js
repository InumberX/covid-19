/*------------------------------------------
 Vue設定
--------------------------------------------*/
// マウント先
const vMountTarget = '#app';

// インスタンス
let vm = '';

/*------------------------------------------
 Vue
--------------------------------------------*/
if (document.querySelectorAll(vMountTarget).length > 0) {
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
   outputDataPref: [],
   casesNum: 0,
   deathsNum: 0,
   prefCheck: [],
   refineBtnTx: '絞り込み',
   dataHistory: [],
   dataPredict: [],
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

      // データの取得に成功した場合
      if (status === 'success' && data != null) {
       self.dataPref = data;
       self.initPrefCheck();
       self.updateDataPref();
       self.getCheckedPref();
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
   // 感染者推移を取得する処理
   getDataHistory: function () {
    let self = this;
    axios
     .post('api/get_data_history.php?v=' + getDateTime())
     .then(function (res) {
      const resData = res.data.result;
      const status = resData.status;
      const data = resData.data;

      self.dataHistory = [];

      // データの取得に成功した場合
      if (status === 'success') {
       self.dataHistory = data;
      }
     })
     .catch(function (err) {});
   },
   // 感染者予測を取得する処理
   getDataPredict: function () {
    let self = this;
    axios
     .post('api/get_data_predict.php?v=' + getDateTime())
     .then(function (res) {
      const resData = res.data.result;
      const status = resData.status;
      const data = resData.data;

      self.dataPredict = [];

      // データの取得に成功した場合
      if (status === 'success') {
       self.dataPredict = data;
      }
     })
     .catch(function (err) {});
   },
   // 県ごとのデータを更新する処理
   updateDataPref: function () {
    this.casesNum = 0;
    this.deathsNum = 0;
    this.outputDataPref = [];

    const checkedPref = store.state.checkedPref;
    const checkedPrefLength = checkedPref.length;

    // 全国のデータを表示する場合
    if (checkedPrefLength === 0) {
     this.outputDataPref = this.dataPref;

     for (
      let i = 0, iLength = this.outputDataPref.length;
      i < iLength;
      i = (i + 1) | 0
     ) {
      const thisData = this.outputDataPref[i];
      this.casesNum += thisData.cases;
      this.deathsNum += thisData.deaths;
     }
    }
    // 絞り込んで表示する場合
    else {
     for (
      let i = 0, iLength = this.dataPref.length;
      i < iLength;
      i = (i + 1) | 0
     ) {
      const thisData = this.dataPref[i];

      for (let j = 0; j < checkedPrefLength; j = (j + 1) | 0) {
       if (checkedPref[j] === thisData.name_en) {
        this.casesNum += thisData.cases;
        this.deathsNum += thisData.deaths;
        this.outputDataPref.push(thisData);
        break;
       }
      }
     }
    }
   },
   // 都道府県チェックボックス初期化処理
   initPrefCheck: function () {
    this.prefCheck = [];

    for (
     let i = 0, iLength = this.dataPref.length;
     i < iLength;
     i = (i + 1) | 0
    ) {
     const thisData = this.dataPref[i];

     const prefCheckVal = {
      id: thisData.id,
      val: thisData.name_en,
      tx: thisData.name_ja,
     };
     this.prefCheck.push(prefCheckVal);
    }
   },
  },
  computed: {
   checkedPref: function () {
    return store.state.checkedPref;
   },
  },
  watch: {
   checkedPref: function () {
    this.updateDataPref();
    this.setCheckedPref();

    if (store.state.checkedPref.length > 0) {
     this.refineBtnTx = '絞り込み中';
    } else {
     this.refineBtnTx = '絞り込み';
    }
   },
  },
  // インスタンスが作成された後に実行する処理
  created: function () {
   // 県ごとのデータを取得する
   this.getDataPref();
   // 感染者推移を取得する
   this.getDataHistory();
   // 感染者予測を取得する処理
   this.getDataPredict();
  },
  // インスタンスがマウントされた後に実行する処理
  mounted: function () {},
 });
}
