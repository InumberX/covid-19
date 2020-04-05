/*------------------------------------------
 コンポーネント
--------------------------------------------*/
// ミックスイン定義
let componentMixin = initMixin();

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

   Chart.defaults.global.defaultFontColor = '#393939';
   Chart.defaults.global.defaultFontFamily =
    '-apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue",HelveticaNeue, "游ゴシック体", YuGothic, "游ゴシック Medium","Yu Gothic Medium", "游ゴシック", "Yu Gothic", Verdana, "メイリオ", Meiryo,sans-serif';
   Chart.defaults.global.defaultFontSize = 10;

   const ctx = document.getElementById('pref-graph');
   const prefGraph = new Chart(ctx, {
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
