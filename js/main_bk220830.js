let app = new Vue({
  el: '#app',
  data: {
    month: '',
    calendar: [],
    week: [],
    isSat: false,
    isSun: false
  },
  created: function() {
    // カレンダー作成
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.month = month;
    let weekArray = ['日', '月', '火', '水', '木', '金', '土'];

    // 今月の終了日を取得
    let endDay = new Date(year, month, 0)

    // 空の配列に当月の日付をすべて格納したい
    let len = endDay.getDate();
    for (i = 1; i <= len; i++) {
      this.calendar.push(i)
    }

    // 曜日を充てる
    // 最初の週だけの曜日を繰り返す
    let startDay = new Date(year, month - 1, 1).getDay();
    for (i = 0; i < 1; i++){
      for (j = startDay; j < weekArray.length; j++) {
        this.week.push(weekArray[j]);
      }
    }

    // 最初と最後の週以外の曜日を繰り返す
    let firstWeek = (weekArray.length - startDay);
    let row = Math.floor((len - firstWeek) / weekArray.length);
    for (i = 0; i < row; i++) {
      for (j = 0; j < weekArray.length; j++) {
        this.week.push(weekArray[j])
      }
    }

    // 最後の週だけの曜日を繰り返す
    let lastWeek = endDay.getDay();
    for (i = 0; i <= lastWeek; i++) {
      this.week.push(weekArray[i])
    }

    // 15人分の日数分のカラムを表示
    let column = document.querySelectorAll('tr.person')
    for (i = 0; i < 15; i++) {
      for (j = 0; j < len; j++) {
        column[i].insertAdjacentHTML('beforeend', '<td></td>')
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

      /*-------------------------
        シフト作成
      -------------------------*/
      // 1人あたり週2勤務 × 15人 = 一週間あたり出勤枠30枠を用意
      let numArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14];

      // 配列をシャッフル
      let shuffleArray = this.shuffle(numArray);

      // for (i = 0; i < 30; i = i + 6) {
      //   // 1列を曜日ごとに分割
      //   let weekday = shuffleArray.slice(i, (i + 6));

      //   // １つの曜日内に同じ数値がないように重複判定
      //   weekday = this.recreateArray(numArray, shuffleArray, weekday, i, (i + 6));

      //   // 曜日ごとの出勤日を赤く染める
      //   for (j = 1; j <= 5; j++){
      //     this.workDay(j, weekday, len);
      //   }
      // }

      // 1列を曜日ごとに分割
      let mon = shuffleArray.slice(0, 6);
      let tue = shuffleArray.slice(6, 12);
      let wed = shuffleArray.slice(12, 18);
      let thu = shuffleArray.slice(18, 24);
      let fri = shuffleArray.slice(24, 30);

      // １つの曜日内に同じ数値がないように重複判定
      while (this.confDup(mon) | this.confDup(tue) | this.confDup(wed) | this.confDup(thu) | this.confDup(fri)) {
        shuffleArray = this.shuffle(numArray);
        mon = shuffleArray.slice(0, 6);
        tue = shuffleArray.slice(6, 12);
        wed = shuffleArray.slice(12, 18);
        thu = shuffleArray.slice(18, 24);
        fri = shuffleArray.slice(24, 30);

        this.confDup(mon)
        this.confDup(tue)
        this.confDup(wed)
        this.confDup(thu)
        this.confDup(fri)
      }

      // mon = this.recreateArray(numArray, shuffleArray, mon, 0, 6);
      // tue = this.recreateArray(numArray, shuffleArray, tue, 6, 12);
      // wed = this.recreateArray(numArray, shuffleArray, wed, 12, 18);
      // thu = this.recreateArray(numArray, shuffleArray, thu, 18, 24);
      // fri = this.recreateArray(numArray, shuffleArray, fri, 24, 30);

      // // 曜日ごとの出勤日を赤く染める
      this.workDay(1, mon, len);
      this.workDay(2, tue, len);
      this.workDay(3, wed, len);
      this.workDay(4, thu, len);
      this.workDay(5, fri, len);


    //   // シフト生成（墓地）
    //   for (i = 1; i <= len; i++){
    //     let personColumn = document.querySelectorAll(`tr.person td:nth-of-type(${i})`);

    //     // 土日は除く
    //     if (i === 6 | i === 7 | i === 13 | i === 14 | i === 20 | i === 21 | i === 27 | i === 28) {
    //       continue;
    //     }

    //     // 15人のうち、出勤する6人を選ぶ
    //     let randoms = [];
    //     let min = 0;
    //     let max = 5;
    //     this.shiftFunc(min, max, randoms);

    //     // 出勤日を赤く染める
    //     for (k = 0; k < randoms.length; k++) {
    //       personColumn[randoms[k]].classList.add('red');
    //     }

    //   }
    //   // TODO:１人あたり週２勤務にする
    //   for (i = 3; i <= 17; i++) {
    //     let newArray = [];
    //     let column = document.querySelectorAll(`table tr.person:nth-of-type(${i}) td`);
    //     let redColumn = document.querySelectorAll(`table tr.person:nth-of-type(${i}) td.red`);

    //     // 1列を配列に格納
    //     let columnArray = Array.from(column);

    //     // 1列を1週間ごとに分割
    //     let week1 = columnArray.slice(0, 5);
    //     let week2 = columnArray.slice(7, 12);
    //     let week3 = columnArray.slice(14, 19);
    //     let week4 = columnArray.slice(21, 16);
    //     let week5 = columnArray.slice(28, 31);

    //     // 1週間のうちの勤務日を抜き出す
    //     let week1Red = this.workDay(week1);
    //     let week2Red = this.workDay(week2);
    //     let week3Red = this.workDay(week3);
    //     let week4Red = this.workDay(week4);
    //     let week5Red = this.workDay(week5);

    //     // console.log(week1Red);

    //     // 週３回以上勤務日があった場合
    //     // if (week1Red.length > 2) {
    //     //   console.log('hello');
    //     // } else {
    //     //   console.log('no')
    //     // }

    //   }
    // },
    // shiftFunc: function (min, max, randoms) {
    //   // 重複しないようにランダムに6つの数値を生成
    //   for (j = min; j <= max; j++) {
    //     while (true) {
    //       let tmp = this.randomFunc();
    //       if (!randoms.includes(tmp)) {
    //         randoms.push(tmp);
    //         break;
    //       }
    //     }
    //   }
    },
    randomFunc: function () {
      // 0～14の数値をランダムで生成
      let ran = Math.floor(Math.random() * 15)
      return ran
    },
    resetShift: function () {
      // シフト表をリセット
      let redColumn = document.querySelectorAll('tr.person td.red');
      for (i = 0; i < redColumn.length; i++) {
          redColumn[i].classList.remove('red');
      }
    },
    // 1週間のうちの勤務日を抜き出す
    // workDay: function (array) {
    //   let result = array.filter(function (value) {
    //     return value.className === 'red'
    //   })
    //   return result;
    // },
    // 配列内をシャッフルする
    shuffle: function ([...array]) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    // 勤務日を赤にする
    workDay: function (num, array, len) {
      for (i = num; i <= len; i = i + 7) {
        let personColumn = document.querySelectorAll(`tr.person td:nth-of-type(${i})`);
        for (j = 0; j < array.length; j++) {
          personColumn[array[j]].classList.add('red');
        }
      }
      return;
    },
    // recreateArray: function (numArray, shuffleArray, weekArray, min, max) {
    //   // １つの曜日内に同じ数値があったら配列を作り直す
    //   while (this.confDup(weekArray)) {
    //     if (this.confDup(weekArray)) {
    //       shuffleArray = this.shuffle(numArray);
    //       weekArray = shuffleArray.slice(min, max);
    //     }
    //   }
    //   return weekArray;
    // },
    // 曜日ごとの配列内に重複した数値があるか判定
    confDup: function (array) {
      let set = new Set(array);
      return set.size != array.length;
    }
  }
})
