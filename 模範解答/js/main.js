Vue.createApp({
  data() {
    return {
      master: [
        '佐藤',
        '男澤',
        '山口',
        '柴山',
        '白川',
        '林',
        '山本',
        '岡',
        '長田',
        '小林',
        '丹原',
        '長谷川',
        '作本',
        '本多',
        '橋詰'],
      week01: [
        {
          week: 'mon',
          members: null
        },
        {
          week: 'tue',
          members: null
        },
        {
          week: 'wed',
          members: null
        },
        {
          week: 'thu',
          members: null
        },
        {
          week: 'fri',
          members: null
        },
      ],
      week02: [
        {
          week: 'mon',
          members: null
        },
        {
          week: 'tue',
          members: null
        },
        {
          week: 'wed',
          members: null
        },
        {
          week: 'thu',
          members: null
        },
        {
          week: 'fri',
          members: null
        },
      ],
      week03: [
        {
          week: 'mon',
          members: null
        },
        {
          week: 'tue',
          members: null
        },
        {
          week: 'wed',
          members: null
        },
        {
          week: 'thu',
          members: null
        },
        {
          week: 'fri',
          members: null
        },
      ],
      week04: [
        {
          week: 'mon',
          members: null
        },
        {
          week: 'tue',
          members: null
        },
        {
          week: 'wed',
          members: null
        },
        {
          week: 'thu',
          members: null
        },
        {
          week: 'fri',
          members: null
        },
      ],
      isAnswer: true
    };
  },
  methods: {
    shuffle: function ([...array]) {
      for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    sorting: function(memberName) {
      let weekArray = [this.week01, this.week02, this.week03, this.week04];
      let membersArray = [];
      let counts = 0;
      let membersCount = {};
      weekArray.forEach(weekName => {
        const copiedMaster = this.master.slice();
        const shuffledArr = this.shuffle(copiedMaster);
        const copiedShuffledArr = shuffledArr.slice();
        copiedShuffledArr.push(copiedShuffledArr.shift());
        const newArr = shuffledArr.concat(copiedShuffledArr);

        const businessDays = 5;
        const numberPerDay = Math.floor(newArr.length / businessDays);
        const moduloMembers = newArr.length % businessDays;
        for (let i = 0; i < businessDays; i++) {
          weekName[i].members = newArr.splice(0, numberPerDay + (i < moduloMembers));
          if(weekName[i].members.includes(memberName)) {
            membersArray = membersArray.concat(weekName[i].members);
          }
        }
        weekName = this.shuffle(weekName);
      });
      for (var i = 0; i < membersArray.length; i++) {
        var elm = membersArray[i];
        membersCount[elm] = (membersCount[elm] || 0) + 1;
      }
      for (let key in membersCount) {
        if(membersCount[key] <= 1 ) {
          counts++;
        }
      }
      if (counts === 0) {
        this.isAnswer = false;
      }
      else {
        counts = 0;
        for (let k in membersCount) {
          membersCount[k] = 0;
        }
        this.isAnswer = true;
      }
      console.log(membersCount);
    },
    addShiftList: function() {
      do {
        for (let i = 0; i < this.master.length; i++) {
          this.sorting(this.master[i]);
        }
      }
      while(this.isAnswer);
    }
  },
}).mount('#app');