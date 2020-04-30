/*------------------------------------------
 Vue設定
--------------------------------------------*/
// マウント先
const vMountTarget = '#app';

// インスタンス
let vm = '';

/*------------------------------------------
 Chart
--------------------------------------------*/
Chart.defaults.global.defaultFontColor = '#393939';
Chart.defaults.global.defaultFontFamily =
 '-apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue",HelveticaNeue, "游ゴシック体", YuGothic, "游ゴシック Medium","Yu Gothic Medium", "游ゴシック", "Yu Gothic", Verdana, "メイリオ", Meiryo,sans-serif';
Chart.defaults.global.defaultFontSize = 10;

/*------------------------------------------
 flatpickr
--------------------------------------------*/
// 日本語化
const flatpickrJa = {
 weekdays: {
  shorthand: ['日', '月', '火', '水', '木', '金', '土'],
  longhand: [
   '日曜日',
   '月曜日',
   '火曜日',
   '水曜日',
   '木曜日',
   '金曜日',
   '土曜日',
  ],
 },
 months: {
  shorthand: [
   '1月',
   '2月',
   '3月',
   '4月',
   '5月',
   '6月',
   '7月',
   '8月',
   '9月',
   '10月',
   '11月',
   '12月',
  ],
  longhand: [
   '1月',
   '2月',
   '3月',
   '4月',
   '5月',
   '6月',
   '7月',
   '8月',
   '9月',
   '10月',
   '11月',
   '12月',
  ],
 },
};

// 週初めの設定
flatpickr.l10ns.default.firstDayOfWeek = 0;
// 言語設定
flatpickr.localize(flatpickrJa);

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
   historyMinDate: '',
   historyMaxDate: '',
   isLoadHistory: false,
   predictMinDate: '',
   predictMaxDate: '',
   isLoadPredict: false,
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
      const dataLength = data.length;

      self.dataHistory = [];

      // データの取得に成功した場合
      if (status === 'success') {
       // 日付のフォーマットを変更
       for (let i = 0; i < dataLength; i = (i + 1) | 0) {
        data[i].date = String(data[i].date).replace(
         /^(\d{4})(\d{2})(\d{2})/,
         '$1/$2/$3'
        );
       }

       // カレンダー設定
       self.historyMinDate = data[0].date;
       self.historyMaxDate = data[dataLength - 1].date;
       if (dataLength >= 14) {
        store.commit('setHistorySeletedDateStart', data[dataLength - 15].date);
       } else {
        store.commit('setHistorySeletedDateStart', data[0].date);
       }
       store.commit('setHistorySeletedDateEnd', data[dataLength - 1].date);

       // 表示用データにコピー
       self.dataHistory = data;

       self.isLoadHistory = true;
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
      const dataLength = data.length;

      self.dataPredict = [];

      // データの取得に成功した場合
      if (status === 'success') {
       // 日付のフォーマットを変更
       for (let i = 0; i < dataLength; i = (i + 1) | 0) {
        data[i].date = String(data[i].date).replace(
         /^(\d{4})(\d{2})(\d{2})/,
         '$1/$2/$3'
        );
       }

       // カレンダー設定
       self.predictMinDate = data[0].date;
       self.predictMaxDate = data[dataLength - 1].date;
       store.commit('setPredictSeletedDateStart', data[0].date);
       if (dataLength >= 14) {
        store.commit('setPredictSeletedDateEnd', data[14].date);
       } else {
        store.commit('setPredictSeletedDateEnd', data[dataLength - 1].date);
       }

       // 表示用データにコピー
       self.dataPredict = data;

       self.isLoadPredict = true;
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

    const target = store.state.sortPref.target;
    const mode = store.state.sortPref.mode;

    // ソートを行う場合
    if (target !== '') {
     this.outputDataPref.sort(function (a, b) {
      let result = '';
      if (mode === 'desc') {
       result = b[target] - a[target];
      } else {
       result = a[target] - b[target];
      }
      return result;
     });
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
   sortPrefTarget: function () {
    return store.state.sortPref.target;
   },
   sortPrefMode: function () {
    return store.state.sortPref.mode;
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
   sortPrefTarget: function () {
    this.updateDataPref();
   },
   sortPrefMode: function () {
    this.updateDataPref();
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
