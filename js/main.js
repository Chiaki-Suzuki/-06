let app = new Vue({
  el: '#app',
  data: {
    month: '',
    calendar: [],
    week: [],
    len: '',
    firstSat: '',
    firstSun: ''
  },
  created: function() {
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

    // 空の配列に当月の日付をすべて格納
    this.len = endDay.getDate();
    for (i = 1; i <= this.len; i++) {
      this.calendar.push(i)
    }

    /*-------------------------
      曜日
    -------------------------*/
    // 最初の週だけの曜日を繰り返す
    let startDayWeek = startDay.getDay();
    this.dayRow(1, startDayWeek)

    // 最初と最後の週以外の曜日を繰り返す
    let firstWeek = (weekArray.length - startDayWeek);
    let row = Math.floor((this.len - firstWeek) / weekArray.length);
    this.dayRow(row, 0)

    // 最後の週だけの曜日を繰り返す
    let lastWeek = endDay.getDay();
    if (lastWeek === 6) {
    } else {
      for (i = 0; i <= lastWeek; i++) {
        this.week.push(weekArray[i])
      }
    }

    // 最初の土日を判定する
    this.firstSat = (6 - startDayWeek) + 1;
    if (startDayWeek === 0) {
      this.firstSun = 1;
    } else {
      this.firstSun = this.firstSat + 1;
    }
  },
  mounted: function () {
    // 土日に色を付けたい
    let holiColumn = document.querySelectorAll('tr.week th');
    this.calenderColor(this.firstSat, holiColumn, 'sat')
    this.calenderColor(this.firstSun, holiColumn, 'sun')

    // 日付の方も
    let dateColumn = document.querySelectorAll('tr.date th');
    this.calenderColor((this.firstSat + 1), dateColumn, 'sat')
    this.calenderColor((this.firstSun + 1), dateColumn, 'sun')

    // シフト表は土日をグレーにする
    for (i = 0; i < 15; i++) {
      let personColumn = document.querySelectorAll('tr.person');
      let shiftColumn = personColumn[i].querySelectorAll('td');

      this.calenderColor(this.firstSat, shiftColumn, 'gray')
      this.calenderColor(this.firstSun, shiftColumn, 'gray')
    }
  },
  methods: {
    /*-------------------------
      カレンダー作成
    -------------------------*/
    // 一か月の曜日を配列に格納する
    dayRow: function (weeklen, startDay) {
      let weekArray = ['日', '月', '火', '水', '木', '金', '土'];
      for (i = 0; i < weeklen; i++){
        for (j = startDay; j < weekArray.length; j++) {
          this.week.push(weekArray[j]);
        }
      }
    },
    // カレンダー色付け
    calenderColor: function (holidays, column, className) {
      for (x = holidays; x <= this.len ; x += 7) {
        column[x - 1].classList.add(`${className}`);
      }
    },
    /*-------------------------
      シフト作成
    -------------------------*/
    createShift: function () {
      // 15人
      let simpleNumArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

      // 配列をシャッフル
      let shuffleArray = this.shuffle(simpleNumArray);

      // 1列を曜日ごとに分割（前半）
      let first = [];
      this.splitRow(shuffleArray, first);

      // 前半の配列をコピー
      let latter = first.concat()

      // 4週分繰り返し
      let week = []
      let multiWeek = []
      for (x = 0; x < 4; x++) {
        // 後半の配列を１つずらす
        let latterFirst = latter.splice(0, 1);
        latter = latter.concat(latterFirst)

        // 前半と後半の配列をくっつける
        let day = [];
        let oneWeek = [] // 1週間の中でシャッフル用
        for (i = 0; i < first.length; i++) {
          day = first[i].concat(latter[i])
          oneWeek.push(day)
        }
        // 勤務日が固定にならないようにシフトの組み合わせはそのままで週ごとにシャッフル
        oneWeek = this.shuffle(oneWeek)
        // 3次元配列
        multiWeek.push(oneWeek)
        // 2次元配列に戻す
        week = multiWeek.reduce((acc, elem) => {
          return acc.concat(elem)
        })
      }

      // 20日分のシフトを繰り返して30日分にする
      let shortageDay = week.concat().splice(0, 10)
      week = week.concat(shortageDay)

      console.log(week)
      // 曜日ごとの出勤日を赤く染める
      let num = 1;
      for (i = (7 - this.firstSun); i < week.length; i++) {
        // 土日を除く
        for (j = this.firstSat; j <= this.len; j+=7) {
          if (num === j){
            num = num + 1;
            num = num + 1;
          }
        }
        // 配列が出勤日数を超過したら処理を止める
        if (num >= this.len + 1) {
          break;
        }
        this.workDay(week[i], this.len, num);
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
      for (z = 0; z < 15; z += 3) {
        let weekDay = shuffleArray.slice(z, (z + 3));
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
    // シフト表をリセット
    resetShift: function () {
      let redColumn = document.querySelectorAll('tr.person td.red');
      for (i = 0; i < redColumn.length; i++) {
          redColumn[i].classList.remove('red');
      }
    },
  }
})
