let app = new Vue({
  el: '#app',
  data: {
    month: '',
    calendar: [],
    week: [],
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
  },
  mounted: function () {
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
      console.log(week)

      // 20日分のシフトを繰り返して30日分にする
      let shortageDay = week.concat().splice(0, 10)
      week = week.concat(shortageDay)

      // console.log(week)
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
    resetShift: function () {
      // シフト表をリセット
      let redColumn = document.querySelectorAll('tr.person td.red');
      for (i = 0; i < redColumn.length; i++) {
          redColumn[i].classList.remove('red');
      }
    },
  }
})
