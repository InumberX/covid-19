/*------------------------------------------
 Vue設定
--------------------------------------------*/
// Vueストア
let store = '';

// ミックスイン
let mixin = '';

/*------------------------------------------
 コンポーネント
--------------------------------------------*/
// ミックスイン定義
mixin = initMixin();

// ストアを初期化
store = new Vuex.Store(initStore());

// ヘッダー内メニュー
Vue.component('v-hd-menu-cnt', {
 props: {
  items: [],
 },
 mixins: [mixin],
 store: store,
 methods: {
  reset: function () {
   store.commit('setCheckedPref', []);
  },
 },
 template:
  '<div class="hd-menu-cnt-wrap">' +
  '<transition name="fade">' +
  '<div class="hd-menu-cnt-box" v-if="store.state.isModal" v-cloak @click.self="closeModal()">' +
  '<div class="hd-menu-cnt">' +
  '<button title="閉じる" aria-label="閉じる" class="hd-menu-cnt_top-close-btn" @click="closeModal()">' +
  '<i class="stl-icon is-cross"></i>' +
  '</button>' +
  '<div class="hd-menu-cnt_inner">' +
  '<div class="hd-menu-cnt_top-box">' +
  '<div class="hd-menu-cnt_reset-btn-box">' +
  '<button class="hd-menu-cnt_reset-btn" @click="reset()"><i class="icon is-reset"></i>リセット</button>' +
  '</div>' +
  '</div>' +
  '<ul class="hd-menu_items">' +
  '<li class="hd-menu_item" v-for="(item, i) in items" :key="item.id">' +
  '<label class="frm_lb is-chk">' +
  '<input type="checkbox" name="pref" class="frm_chk" :value="item.val" v-model="store.state.checkedPref">' +
  '<span class="frm_chk-tx">' +
  '<i class="frm_chk-faker"></i>{{ item.tx }}' +
  '</span>' +
  '</label>' +
  '</li>' +
  '</ul>' +
  '<div class="hd-menu-cnt_btm-box">' +
  '<div class="hd-menu-cnt_btm-close-btn-box">' +
  '<button class="hd-menu-cnt_btm-close-btn" @click="closeModal()">閉じる</button>' +
  '</div>' +
  '</div>' +
  '</div><!-- /.hd-menu-cnt_inner -->' +
  '</div><!-- /.hd-menu-cnt -->' +
  '</div><!-- /.hd-menu-cnt-box -->' +
  '</transition>' +
  '<transition name="fade">' +
  '<div class="hd-overlay" v-if="store.state.isModal"></div>' +
  '</transition>' +
  '</div>',
});

// コンテンツタイトル
Vue.component('v-cnt-ttl', {
 props: {
  ttl: '',
 },
 template:
  '<div class="cnt-ttl">' +
  '<h2 class="cnt-ttl_tx" v-html="ttl"></h2>' +
  '</div>',
});

// 合計数
Vue.component('v-total-num', {
 props: {
  ttl: '',
  tx: '',
 },
 template:
  '<dl class="total-num_item">' +
  '<dt class="total-num_ttl">' +
  '<span class="total-num_ttl-tx">{{ ttl }}</span>' +
  '</dt>' +
  '<dd class="total-num_cnt">' +
  '<span class="total-num_cnt-tx"><em class="total-num_cnt-num">{{ tx }}</em>人</span>' +
  '</dd>' +
  '</dl>',
});

// 各都道府県グラフ
let prefGraph = null;
Vue.component('v-pref-graph', {
 props: {
  data: [],
 },
 data: function () {
  return {
   grafData: {
    labels: [],
    datasets: [
     {
      label: '感染者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 0.5)',
     },
     {
      label: '死亡者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 1)',
     },
    ],
   },
  };
 },
 methods: {
  initGraf: function () {
   this.grafData.labels = [];
   for (
    let i = 0, iLength = this.grafData.datasets.length;
    i < iLength;
    i = (i + 1) | 0
   ) {
    this.grafData.datasets[i].data = [];
   }

   for (let i = 0, iLength = this.data.length; i < iLength; i = (i + 1) | 0) {
    const thisData = this.data[i];
    const label = thisData.name_ja;
    const cases = thisData.cases;
    const deaths = thisData.deaths;

    this.grafData.labels.push(label);
    this.grafData.datasets[0].data.push(cases);
    this.grafData.datasets[1].data.push(deaths);
   }

   if (prefGraph) {
    prefGraph.destroy();
   }

   const ctx = document.getElementById('pref-graph');
   prefGraph = new Chart(ctx, {
    type: 'bar',
    data: this.grafData,
    options: {
     title: {
      display: false,
      text: '各都道府県ごとの感染者/死亡者数',
     },
     responsive: true,
     maintainAspectRatio: false,
     scales: {
      yAxes: [
       {
        ticks: {
         stepSize: 20,
         callback: function (value, index, values) {
          return value + '人';
         },
        },
       },
      ],
     },
    },
   });
   prefGraph.canvas.parentNode.style.height = '320px';
  },
 },
 mounted: function () {
  this.initGraf();
 },
 watch: {
  data: function () {
   this.initGraf();
  },
 },
 template:
  '<div class="pref-graph-box">' +
  '<div class="pref-graph result-graph">' +
  '<canvas class="result-graph_canvas" id="pref-graph"></canvas>' +
  '</div>' +
  '</div>',
});

// 各都道府県テーブル
Vue.component('v-pref-tbl', {
 props: {
  data: [],
 },
 template:
  '<div class="pref-tbl-box">' +
  '<table class="pref-tbl">' +
  '<thead class="pref-tbl_hd">' +
  '<tr class="pref-tbl_row is-hd">' +
  '<td class="pref-tbl_cell is-hd is-num"></td>' +
  '<td class="pref-tbl_cell is-hd is-pref">都道府県</td>' +
  '<td class="pref-tbl_cell is-hd is-cases">感染者</td>' +
  '<td class="pref-tbl_cell is-hd is-deaths">死亡者</td>' +
  '</tr>' +
  '</thead>' +
  '<tbody class="pref-tbl_bd">' +
  '<tr class="pref-tbl_row is-bd" v-for="(item, i) in data" :key="item.id">' +
  '<td class="pref-tbl_cell is-bd is-num">{{ i + 1 }}</td>' +
  '<td class="pref-tbl_cell is-bd is-pref">{{ item.name_ja }}</td>' +
  '<td class="pref-tbl_cell is-bd is-cases">{{ item.cases }}人</td>' +
  '<td class="pref-tbl_cell is-bd is-deaths">{{ item.deaths }}人</td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '</div>',
});

// 感染者推移グラフ
let historyGraph = null;
Vue.component('v-history-graph', {
 store: store,
 props: {
  data: [],
 },
 data: function () {
  return {
   grafData: {
    labels: [],
    datasets: [
     {
      label: '感染者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 0.5)',
     },
     {
      label: '死亡者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 1)',
     },
    ],
   },
  };
 },
 methods: {
  initGraf: function () {
   this.grafData.labels = [];
   let isAdd = false;
   for (
    let i = 0, iLength = this.grafData.datasets.length;
    i < iLength;
    i = (i + 1) | 0
   ) {
    this.grafData.datasets[i].data = [];
   }

   for (let i = 0, iLength = this.data.length; i < iLength; i = (i + 1) | 0) {
    const thisData = this.data[i];
    const label = thisData.date;

    if (label === store.state.historySeletedDateStart) {
     isAdd = true;
    }

    if (isAdd) {
     const cases = thisData.positive;
     const deaths = thisData.death;

     this.grafData.labels.push(label);
     this.grafData.datasets[0].data.push(cases);
     this.grafData.datasets[1].data.push(deaths);
    }

    if (label === store.state.historySeletedDateEnd) {
     break;
    }
   }

   if (historyGraph) {
    historyGraph.destroy();
   }

   const ctx = document.getElementById('history-graph');
   historyGraph = new Chart(ctx, {
    type: 'line',
    data: this.grafData,
    options: {
     title: {
      display: false,
      text: '感染者/死亡者数の推移',
     },
     responsive: true,
     maintainAspectRatio: false,
     scales: {
      yAxes: [
       {
        ticks: {
         stepSize: 20,
         callback: function (value, index, values) {
          return value + '人';
         },
        },
       },
      ],
     },
    },
   });
   historyGraph.canvas.parentNode.style.height = '320px';
  },
 },
 mounted: function () {
  if (this.data.length > 0) {
   this.initGraf();
  }
 },
 computed: {
  seletedDateStart: function () {
   return store.state.historySeletedDateStart;
  },
  seletedDateEnd: function () {
   return store.state.historySeletedDateEnd;
  },
 },
 watch: {
  data: function () {
   this.initGraf();
  },
  seletedDateStart: function () {
   this.initGraf();
  },
  seletedDateEnd: function () {
   this.initGraf();
  },
 },
 template:
  '<div class="history-graph-box">' +
  '<div class="history-graph result-graph">' +
  '<canvas class="result-graph_canvas" id="history-graph"></canvas>' +
  '</div>' +
  '</div>',
});

// 感染者予測グラフ
let predictGraph = null;
Vue.component('v-predict-graph', {
 store: store,
 props: {
  data: [],
  seletedDateStart: '',
  seletedDateEnd: '',
 },
 data: function () {
  return {
   grafData: {
    labels: [],
    datasets: [
     {
      label: '感染者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 0.5)',
     },
     {
      label: '死亡者',
      data: [],
      backgroundColor: 'rgba(245, 62, 51, 1)',
     },
    ],
   },
  };
 },
 methods: {
  initGraf: function () {
   this.grafData.labels = [];
   let isAdd = false;
   for (
    let i = 0, iLength = this.grafData.datasets.length;
    i < iLength;
    i = (i + 1) | 0
   ) {
    this.grafData.datasets[i].data = [];
   }

   for (let i = 0, iLength = this.data.length; i < iLength; i = (i + 1) | 0) {
    const thisData = this.data[i];
    const label = thisData.date;

    if (label === store.state.predictSeletedDateStart) {
     isAdd = true;
    }

    if (isAdd) {
     const cases = thisData.positive;
     const deaths = thisData.death;

     this.grafData.labels.push(label);
     this.grafData.datasets[0].data.push(cases);
     this.grafData.datasets[1].data.push(deaths);
    }

    if (label === store.state.predictSeletedDateEnd) {
     break;
    }
   }

   if (predictGraph) {
    predictGraph.destroy();
   }

   const ctx = document.getElementById('predict-graph');
   predictGraph = new Chart(ctx, {
    type: 'line',
    data: this.grafData,
    options: {
     title: {
      display: false,
      text: '感染者/死亡者数の予測',
     },
     responsive: true,
     maintainAspectRatio: false,
     scales: {
      yAxes: [
       {
        ticks: {
         stepSize: 20,
         callback: function (value, index, values) {
          return value + '人';
         },
        },
       },
      ],
     },
    },
   });
   predictGraph.canvas.parentNode.style.height = '320px';
  },
 },
 mounted: function () {
  if (this.data.length > 0) {
   this.initGraf();
  }
 },
 computed: {
  seletedDateStart: function () {
   return store.state.predictSeletedDateStart;
  },
  seletedDateEnd: function () {
   return store.state.predictSeletedDateEnd;
  },
 },
 watch: {
  data: function () {
   this.initGraf();
  },
  seletedDateStart: function () {
   this.initGraf();
  },
  seletedDateEnd: function () {
   this.initGraf();
  },
 },
 template:
  '<div class="predict-graph-box">' +
  '<div class="predict-graph result-graph">' +
  '<canvas class="result-graph_canvas" id="predict-graph"></canvas>' +
  '</div>' +
  '</div>',
});

// カレンダー
Vue.component('v-calendar-history', {
 store: store,
 props: {
  minDate: '',
  maxDate: '',
  isLoad: false,
 },
 data: function () {
  return {
   flatpickrCal: null,
   valCal: '',
   id: 'calendar_history',
  };
 },
 methods: {
  initCal: function () {
   let self = this;
   this.valCal =
    store.state.historySeletedDateStart +
    ' to ' +
    store.state.historySeletedDateEnd;
   const triggerCalendar = document.querySelector('#' + this.id);
   setTimeout(function () {
    self.flatpickrCal = flatpickr(triggerCalendar, {
     // 動作モード
     mode: 'range',
     // データフォーマット
     dateFormat: 'Y/m/d',
     // 初期日付
     defaulDate: [
      store.state.historySeletedDateStart,
      store.state.historySeletedDateEnd,
     ],
     // 選択可能な最小日付
     minDate: self.minDate,
     // 選択可能な最大日付
     maxDate: self.maxDate,
     // 表示フォーマット
     altFormat: 'Y/m/d',
     // データと表示のフォーマットを変えるか
     altInput: true,
     // モバイル時はデフォルトのカレンダーを使用するか
     disableMobile: true,
     // カレンダーの位置をwrapper内部に移動させるか
     static: false,
     // カレンダーをwrapper内部に作成させるか
     wrap: true,
     // 月切り替えボタン（次月）
     nextArrow: '',
     // 月切り替えボタン（前月）
     prevArrow: '',
     // 日付を変更した時の処理
     onChange: function (selectedDates, dateStr) {
      let dataArray = dateStr.match(
       /^(\d{4})\/(\d{2})\/(\d{2}) to (\d{4})\/(\d{2})\/(\d{2})/
      );
      if (dataArray != null) {
       store.commit(
        'setHistorySeletedDateStart',
        dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
       );
       store.commit(
        'setHistorySeletedDateEnd',
        dataArray[4] + '/' + dataArray[5] + '/' + dataArray[6]
       );
      } else {
       dataArray = dateStr.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
       if (dataArray != null) {
        store.commit(
         'setHistorySeletedDateStart',
         dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
        );
        store.commit(
         'setHistorySeletedDateEnd',
         dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
        );
       }
      }
      return false;
     },
    });
   }, 100);
  },
 },
 mounted: function () {
  if (this.isLoad) {
   this.initCal();
  }
 },
 watch: {
  isLoad: function () {
   if (this.isLoad) {
    this.initCal();
   }
  },
 },
 template:
  '<div class="calendar" :id="id">' +
  '<fieldset class="fr_calendar-box">' +
  '<label class="frm_lbl is-calendar is-range">' +
  '<i class="icon is-calendar"></i>' +
  '<input type="hidden" class="flatpickr-input" :data-input="valCal" :value="valCal">' +
  '</label>' +
  '</fieldset>' +
  '</div>',
});

Vue.component('v-calendar-predict', {
 store: store,
 props: {
  minDate: '',
  maxDate: '',
  isLoad: false,
 },
 data: function () {
  return {
   flatpickrCal: null,
   valCal: '',
   id: 'calendar_predict',
  };
 },
 methods: {
  initCal: function () {
   let self = this;
   this.valCal =
    store.state.predictSeletedDateStart +
    ' to ' +
    store.state.predictSeletedDateEnd;
   const triggerCalendar = document.querySelector('#' + this.id);
   setTimeout(function () {
    self.flatpickrCal = flatpickr(triggerCalendar, {
     // 動作モード
     mode: 'range',
     // データフォーマット
     dateFormat: 'Y/m/d',
     // 初期日付
     defaulDate: [
      store.state.predictSeletedDateStart,
      store.state.predictSeletedDateEnd,
     ],
     // 選択可能な最小日付
     minDate: self.minDate,
     // 選択可能な最大日付
     maxDate: self.maxDate,
     // 表示フォーマット
     altFormat: 'Y/m/d',
     // データと表示のフォーマットを変えるか
     altInput: true,
     // モバイル時はデフォルトのカレンダーを使用するか
     disableMobile: true,
     // カレンダーの位置をwrapper内部に移動させるか
     static: false,
     // カレンダーをwrapper内部に作成させるか
     wrap: true,
     // 月切り替えボタン（次月）
     nextArrow: '',
     // 月切り替えボタン（前月）
     prevArrow: '',
     // 日付を変更した時の処理
     onChange: function (selectedDates, dateStr) {
      let dataArray = dateStr.match(
       /^(\d{4})\/(\d{2})\/(\d{2}) to (\d{4})\/(\d{2})\/(\d{2})/
      );
      if (dataArray != null) {
       store.commit(
        'setPredictSeletedDateStart',
        dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
       );
       store.commit(
        'setPredictSeletedDateEnd',
        dataArray[4] + '/' + dataArray[5] + '/' + dataArray[6]
       );
      } else {
       dataArray = dateStr.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
       if (dataArray != null) {
        store.commit(
         'setPredictSeletedDateStart',
         dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
        );
        store.commit(
         'setPredictSeletedDateEnd',
         dataArray[1] + '/' + dataArray[2] + '/' + dataArray[3]
        );
       }
      }
      return false;
     },
    });
   }, 100);
  },
 },
 mounted: function () {
  if (this.isLoad) {
   this.initCal();
  }
 },
 watch: {
  isLoad: function () {
   if (this.isLoad) {
    this.initCal();
   }
  },
 },
 template:
  '<div class="calendar" :id="id">' +
  '<fieldset class="fr_calendar-box">' +
  '<label class="frm_lbl is-calendar is-range">' +
  '<i class="icon is-calendar"></i>' +
  '<input type="hidden" class="flatpickr-input" :data-input="valCal" :value="valCal">' +
  '</label>' +
  '</fieldset>' +
  '</div>',
});
