<template>
  <div id="app">
    <div class="container">
      <table class="calendar_table">
        <tr class="date">
          <th rowspan="2">{{ month }}月</th>
          <th v-for="day in calendar">{{ day }}</th>
        </tr>
        <tr class="week">
          <th v-for="week in week">{{ week }}</th>
        </tr>
        <tr class="person">
          <th>バイト01</th>
        </tr>
        <tr class="person">
          <th>バイト02</th>
        </tr>
        <tr class="person">
          <th>バイト03</th>
        </tr>
        <tr class="person">
          <th>バイト04</th>
        </tr>
        <tr class="person">
          <th>バイト05</th>
        </tr>
        <tr class="person">
          <th>バイト06</th>
        </tr>
        <tr class="person">
          <th>バイト07</th>
        </tr>
        <tr class="person">
          <th>バイト08</th>
        </tr>
        <tr class="person">
          <th>バイト09</th>
        </tr>
        <tr class="person">
          <th>バイト10</th>
        </tr>
        <tr class="person">
          <th>バイト11</th>
        </tr>
        <tr class="person">
          <th>バイト12</th>
        </tr>
        <tr class="person">
          <th>バイト13</th>
        </tr>
        <tr class="person">
          <th>バイト14</th>
        </tr>
        <tr class="person">
          <th>バイト15</th>
        </tr>
      </table>
      <div class="btns">
        <button v-on:click="createShift()">シフト作成</button>
        <button class="reset" v-on:click="resetShift()">リセット</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => {
    return {
      month: '',
      calendar: [],
      week: [],
      firstSat: '',
      firstSun: ''
    }
  },
  mounted: function() {
    // カレンダー作成
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.month = month;
    let weekArray = ['日', '月', '火', '水', '木', '金', '土'];

    /*-------------------------
      日付
    -------------------------*/
    // 今月の開始日を取得
    let startDay = new Date(year, month - 1, 1)
    // 今月の終了日を取得
    let endDay = new Date(year, month, 0)

    // 空の配列に当月の日付をすべて格納したい
    let len = endDay.getDate();
    for (i = 1; i <= len; i++) {
      this.calendar.push(i)
    }

    /*-------------------------
      曜日
    -------------------------*/
    // 最初の週だけの曜日を繰り返す
    let startDayWeek = startDay.getDay();
    for (i = 0; i < 1; i++){
      for (j = startDayWeek; j < weekArray.length; j++) {
        this.week.push(weekArray[j]);
      }
    }

    // 最初と最後の週以外の曜日を繰り返す
    let firstWeek = (weekArray.length - startDayWeek);
    let row = Math.floor((len - firstWeek) / weekArray.length);
    for (i = 0; i < row; i++) {
      for (j = 0; j < weekArray.length; j++) {
        this.week.push(weekArray[j])
      }
    }

    // 最後の週だけの曜日を繰り返す
    let lastWeek = endDay.getDay();
    if (lastWeek === 6) {
    } else {
      for (i = 0; i <= lastWeek; i++) {
        this.week.push(weekArray[i])
      }
    }

    // 最初の土日を判定する
    if (startDayWeek === 0) {
      this.firstSat = (6 - startDayWeek) + 1;
      this.firstSun = 1;
    } else {
      this.firstSat = (6 - startDayWeek) + 1;
      this.firstSun = this.firstSat + 1;
    }
    /*-------------------------
      カレンダー表示
    -------------------------*/
    // 15人分の日数分のカラムを表示
    let column = document.querySelectorAll('tr.person')
    for (i = 0; i < 15; i++) {
      for (j = 0; j < len; j++) {
        column[i].insertAdjacentHTML('beforeend', '<td></td>')
      }
    }

    // 土日に色を付けたい
    let holiColumn = document.querySelectorAll('tr.week th');
    for (i = 0; i < holiColumn.length; i++){
      if (holiColumn[i].innerHTML === '土') {
        holiColumn[i].classList.add('sat');
      } else if (holiColumn[i].innerHTML === '日') {
        holiColumn[i].classList.add('sun');
      }
    }

    // 日付の方も
    let dateColumn = document.querySelectorAll('tr.date th');
    for (i = this.firstSat; i < dateColumn.length; i+=7) {
      dateColumn[i].classList.add('sat');
    }
    for (i = this.firstSun; i < dateColumn.length; i+=7) {
      dateColumn[i].classList.add('sun');
    }

    // シフト表は土日をグレーにする
    for (i = 0; i < 15; i++) {
      let personColumn = document.querySelectorAll('tr.person');
      let shiftColumn = personColumn[i].querySelectorAll('td');

      for (j = this.firstSat; j < dateColumn.length; j += 7) {
        shiftColumn[j - 1].classList.add('gray');
      }
      for (j = this.firstSun; j < dateColumn.length; j += 7) {
        shiftColumn[j - 1].classList.add('gray');
      }
    }
  },
  methods: {
    createShift: function () {
      /*-------------------------
        当月の情報を取得
      -------------------------*/
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;

      // 当月の日数
      let len = new Date(year, month, 0).getDate();

      // 当月の週数
      let weeklen = Math.ceil(len / 7);
      /*-------------------------
        シフト作成
      -------------------------*/
      // 1人あたり週2勤務 × 15人 = 一週間あたり出勤枠30枠を用意
      let numArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14];

      // 配列をシャッフル
      let weekArray = [];
      for (i = 0; i < weeklen + 1; i++) {
        let shuffleArray = this.shuffle(numArray);
        weekArray.push(shuffleArray)
      }

      // 1列を曜日ごとに分割
      let week = [];
      for (i = 0; i < weeklen + 1; i++) {
        this.splitRow(weekArray[i], week);
      }

      // １つの曜日内に同じ数値がないように重複判定
      for (x = 0; x < week.length; x += 5){
        while (this.confDup(week[x]) | this.confDup(week[x + 1]) | this.confDup(week[x + 2]) | this.confDup(week[x + 3]) | this.confDup(week[x + 4])) {
          // 再度配列をシャッフル
          let shuffleNewArray = this.shuffle(numArray);

          // 再度1列を曜日ごとに分割
          let newWeek = [];
          this.splitRow(shuffleNewArray, newWeek);

          // 元の配列にシャッフルした部分だけ戻す
          newWeek.forEach(function (value, i) {
            week.splice((i + x), 1, value);
          })
        }
      }

      console.log(week)
      // 曜日ごとの出勤日を赤く染める
      let num = 1;
      for (i = (7 - this.firstSun); i < week.length; i++) {
        // 土日を除く
        for (j = this.firstSat; j <= len; j+=7) {
          if (num === j){
            num = num + 1;
            num = num + 1;
          }
        }
        // 配列が出勤日数を超過したら処理を止める
        if (num >= len + 1) {
          break;
        }
        this.workDay(week[i], len, num);
        num = num + 1;
      }
    },
    // 配列内をシャッフルする
    shuffle: function ([...array]) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    // 1列を曜日ごとに分割
    splitRow: function (shuffleArray, week) {
      for (z = 0; z < 30; z += 6) {
        let weekDay = shuffleArray.slice(z, (z + 6));
        week.push(weekDay)
      }
    },
    // 勤務日を赤にする
    workDay: function (array, len, num) {
      let column = document.querySelectorAll(`tr.person td:nth-of-type(${num})`);
      let personColumn = Array.from(column);

      for (x = 0; x < array.length; x++) {
        personColumn[array[x]].classList.add('red');
      }
    },
    // 曜日ごとの配列内に重複した数値があるか判定
    confDup: function (array) {
      let set = new Set(array);
      return set.size != array.length;
    },
    resetShift: function () {
      // シフト表をリセット
      let redColumn = document.querySelectorAll('tr.person td.red');
      for (i = 0; i < redColumn.length; i++) {
          redColumn[i].classList.remove('red');
      }
    }
  }
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
/*-------------------------
  初期化
-------------------------*/
html {
  font-size: 62.5%;
  scroll-behavior: smooth;
}

body {
  font-size: 1.2rem;
  font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}

ul, ol {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/*-------------------------
  グローバル
-------------------------*/
.container {
  width: 1000px;
  margin: 40px auto;
}

.sat {
  background-color: #bfdcfa;
}
.sun {
  background-color: #ffcbcb;
}

.red {
  background-color: #f00;
}
.gray {
  background-color: #aaa;
}

/*-------------------------
  シフト表
-------------------------*/
.calendar_table {
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 20px;

}

.calendar_table th,
.calendar_table td {
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 5px;
}

.calendar_table tr:nth-of-type(1) th,
.calendar_table tr:nth-of-type(2) th {
  text-align: center;
}

.btns {
  width: 410px;
  margin: 0 auto;
}

button {
  display: inline-block;
  width: 300px;
  padding: 10px;
  border: 0;
  color: #fff;
  background-color: #66cabe;
  border-radius: 3px;
  box-shadow: 0 0 10px #bdeae5;
  transition: .3s;
  outline: none;
}

button:hover {
  background-color: #3db7a9;
  box-shadow: 0 0 15px #66cabe;
}

.reset{
  width: 100px;
  background-color: #ccc;
  border-radius: 3px;
  box-shadow: 0 0 10px #eee;
}

.reset:hover {
  background-color: #bbb;
  box-shadow: 0 0 15px #ccc;
}
</style>
