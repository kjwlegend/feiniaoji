// pages/components/date/Date.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startChange:String,
    endChange: String, 
    count: {
      type: Boolean,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentDate: "",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentClickKey: '',
    startDate: '选择出发时间',
    endDate: '选择到达时间',
    today: false,
    nowDate: '',
    stars1: '',
    stars2: '',
    end1: '',
    end2: '',
    old_stars1: '',
    old_stars2: '',
    old_end1: '',
    old_end2: '',
    is_choose: false,
    choose_start: false,
    choose_end: false,
    nowdas1:'',
    nowdas2:'',
    chose:false,
    old_start: '',
    old_end:'',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    doDay: function (e) {
      var that = this
      var currentObj = that.data.currentObj
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1;
      var d = currentObj.getDate();
      var str = ''
      if (e.currentTarget.dataset.key == 'left') {
        m -= 1
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d
        } else {
          str = Y + '/' + m + '/' + d
        }
      } else {
        m += 1
        if (m <= 12) {
          str = Y + '/' + m + '/' + d
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d
        }
      }
      currentObj = new Date(str)
      this.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentObj: currentObj
      })
      this.setSchedule(currentObj);
    },
    //获取当前日期
    getCurrentDayString: function () {
      var objDate = this.data.currentObj
      if (objDate != '') {
        return objDate
      } else {
        var c_obj = new Date()
        var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
        return new Date(a)
      }
    },
    setSchedule: function (currentObj) {
      var that = this
      var m = currentObj.getMonth() + 1
      var Y = currentObj.getFullYear()
      var d = currentObj.getDate();
      var dayString = Y + '/' + m + '/' + currentObj.getDate()
      var currentDayNum = new Date(Y, m, 0).getDate()
      var currentDayWeek = currentObj.getUTCDay() + 1
      var result = currentDayWeek - (d % 7 - 1);
      var firstKey = result <= 0 ? 7 + result : result;
      var currentDayList = []
      var f = 0
      for (var i = 0; i < 42; i++) {
        let data = []
        if (i < firstKey - 1) {
          currentDayList[i] = ''
        } else {
          if (f < currentDayNum) {
            currentDayList[i] = f + 1
            f = currentDayList[i]
          } else if (f >= currentDayNum) {
            currentDayList[i] = ''
          }
        }
      }
      if (currentDayList[7] == '1' || currentDayList[7] == ''){
        var dayLists = []
        for (var i = 7; i < currentDayList.length;i++ ){
          dayLists.push(currentDayList[i])
        }
        currentDayList=dayLists
      }
      that.setData({
        currentDayList: currentDayList
      })
    },

    // 设置点击事件
    onClickItem: function (e) {
      // 今天的日期
      var nowDate = this.data.nowDate;
      var y = Number(nowDate.substr(0, 4));
      var m = Number(nowDate.split("月")[0].split("年")[1]);
      var d = Number(this.data.currentDay);
      // // 选择的日期
      var date = e.currentTarget.dataset.date;
      var c_y = Number(date.substr(0, 4));
      var c_m = Number(date.split("月")[0].split("年")[1]);
      var c_d = Number(e.currentTarget.dataset.day);

      var q_y,q_m,q_d;
      var fas=false;
      if (this.data.endDate != '选择到达时间') {
        fas = true
        q_y = Number(this.data.endDate.split("年")[0]);
        q_m = Number(this.data.endDate.split("月")[0].split("年")[1]);
        q_d = Number(this.data.endDate.split("日")[0].split("月")[1]);
      }
      // //选择日期
      if (this.data.choose_start){
        if (fas == true) {
          if (q_y > c_y ) {
            this.times(c_y, y, c_m, m, c_d, d)
          } else if (q_y == c_y) {
            if (q_m > c_m) {
              this.times(c_y, y, c_m, m, c_d, d)
            } else if (q_m == c_m) {
              if (q_d >= c_d) {
                this.times(c_y, y, c_m, m, c_d, d)
              } else {
                wx.showToast({
                  title: '请正确选择时间',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              wx.showToast({
                title: '请正确选择时间',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '请正确选择时间',
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          this.times(c_y, y, c_m, m, c_d, d)
        }
      }
      if (this.data.startDate != '选择出发时间') {
        y = Number(this.data.startDate.split("年")[0]);
        m = Number(this.data.startDate.split("月")[0].split("年")[1]);
        d = Number(this.data.startDate.split("日")[0].split("月")[1]);
      }
      if (this.data.choose_end) {
        if (c_y > y) {
          var startDate = c_y + '年' + c_m + '月' + c_d + '日'
          this.setData({ endDate: startDate, end1: c_y + '年' + c_m + '月', end2: c_d });
        } else if (c_y == y) {
          if (c_m > m) {
            var startDate = c_y + '年' + c_m + '月' + c_d + '日'
            this.setData({ endDate: startDate, end1: c_y + '年' + c_m + '月', end2: c_d });
          } else if (c_m == m) {
            if (c_d >= d) {
              var startDate = c_y + '年' + c_m + '月' + c_d + '日'
              this.setData({ endDate: startDate, end1: c_y + '年' + c_m + '月', end2: c_d });
            } else {
              wx.showToast({
                title: '请正确选择时间',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '请正确选择时间',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '请正确选择时间',
            icon: 'none',
            duration: 2000
          })
        }
      }
    },
    times: function (c_y, y, c_m, m, c_d, d) {
      if (c_y > y) {
        var startDate = c_y + '年' + c_m + '月' + c_d + '日'
        this.setData({ startDate: startDate, stars1: c_y + '年' + c_m + '月', stars2: c_d });
      } else if (c_y == y) {
        if (c_m > m) {
          var startDate = c_y + '年' + c_m + '月' + c_d + '日'
          this.setData({ startDate: startDate, stars1: c_y + '年' + c_m + '月', stars2: c_d });
        } else if (c_m == m) {
          if (c_d >= d) {
            var startDate = c_y + '年' + c_m + '月' + c_d + '日'
            this.setData({ startDate: startDate, stars1: c_y + '年' + c_m + '月', stars2: c_d });
          } else {
            wx.showToast({
              title: '请正确选择时间',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '请正确选择时间',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '请正确选择时间',
          icon: 'none',
          duration: 2000
        })
      }
    },
    
    // 
    // 点击出发日期
    choose_start(e) {
      if (e.currentTarget.dataset.start){
        var start = e.currentTarget.dataset.start.split('-')
        var end = e.currentTarget.dataset.end.split('-')
        this.setData({ startDate: start[0] + '年' + start[1] + '月' + start[2] + '日', endDate: end[0] + '年' + end[1] + '月' + end[2] + '日',
          stars1: start[0] + '年' + start[1] + '月', stars2: start[2], end1: end[0] + '年' + end[1] + '月', end2: end[2]})
      }
      console.log()
      this.setData({ is_choose: true, choose_start: true, choose_end: false, nowdas1: this.data.nowDate, nowdas2: this.data.currentDay, old_start: this.data.startDate, old_end: this.data.endDate });
      if (this.data.startDate != '选择出发时间' && this.data.startDate != 'NaN - NaN - NaN') {
        var times = Number(this.data.startDate.split('年')[1].split('月')[0])
        var nums = Number(this.data.currentDate.split('年')[1].split('月')[0])
        if (times == nums) {
          return;
        }
        if (times != nums) {
          this.timese(times)
        }
      }
    },
    // 点击到达日期
    choose_end(e) {
      if (e.currentTarget.dataset.start) {
        var start = e.currentTarget.dataset.start.split('-')
        var end = e.currentTarget.dataset.end.split('-')
        this.setData({
          startDate: start[0] + '年' + start[1] + '月' + start[2] + '日', endDate: end[0] + '年' + end[1] + '月' + end[2] + '日',
          stars1: start[0] + '年' + start[1] + '月', stars2: start[2], end1: end[0] + '年' + end[1] + '月', end2: end[2]
        })
      }
      this.setData({ is_choose: true, choose_end: true, choose_start: false, nowdas1: this.data.nowDate, nowdas2: this.data.currentDay, old_start: this.data.startDate, old_end: this.data.endDate });
      if (this.data.endDate != '选择到达时间' && this.data.endDate != 'NaN - NaN - NaN'){
        var times = Number(this.data.endDate.split('年')[1].split('月')[0])
        var nums = Number(this.data.currentDate.split('年')[1].split('月')[0])
        if (times == nums){
          return;
        }
        if (times != nums){
          this.timese(times)
        }
      }
    },

    //调取当前显示的时间
    timese:function(num){
      var that = this
      var currentObj = that.data.currentObj
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1;
      var d = currentObj.getDate();
      var str = ''
      if (num < m) {
        m = m - (m-num)
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d
        } else {
          str = Y + '/' + m + '/' + d
        }
      } else {
        m += (num-m )
        if (m <= 12) {
          str = Y + '/' + m + '/' + d
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d
        }
      }
      currentObj = new Date(str)
      this.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentObj: currentObj
      })
      this.setSchedule(currentObj);
      console.log(currentObj)
    },
    // 点击确定按钮
    sure_btn() {
      var endDate = this.data.endDate;
      var e_y = endDate.substr(0, 4);
      var e_m = endDate.split("月")[0].split("年")[1];
      var e_d = endDate.split("日")[0].split("月")[1];
      // 选择的日期
      var startDate = this.data.startDate;
      var s_y = startDate.substr(0, 4);
      var s_m = startDate.split("月")[0].split("年")[1];
      var s_d = startDate.split("日")[0].split("月")[1];
      // console.log("出发年月日：" + s_y, s_m, s_d);
      // console.log("到达年月日：" + e_y, e_m, e_d);
      s_y = parseInt(s_y);
      s_m = parseInt(s_m);
      s_d = parseInt(s_d);
      e_y = parseInt(e_y);
      e_m = parseInt(e_m);
      e_d = parseInt(e_d);
      if (startDate != "选择出发时间" && endDate != "选择到达时间") {
        if (s_y > e_y) {
          wx.showToast({
            title: '日期错误请重选',
            mask: true,
            image: "/images/pay_lose.png",
            duration: 1000
          })
          return;
        }
        if (s_y == e_y && s_m > e_m) {
          wx.showToast({
            title: '日期错误请重选',
            mask: true,
            image: "/images/pay_lose.png",
            duration: 1000
          })
          return;
        }
        if (s_y == e_y && s_m == e_m && s_d > e_d) {
          wx.showToast({
            title: '日期错误请重选',
            mask: true,
            image: "/images/pay_lose.png",
            duration: 1000
          })
          return;
        }
        this.setData({ is_choose: false });

        var datas = {
          startDate: s_y + '-' + s_m + '-' + s_d,
          endDate: e_y + '-' + e_m + '-' + e_d
        } // detail对象，提供给事件监听函数
        this.triggerEvent('getDate', datas) //myevent自定义名称事件传值
        
      } else {
        // console.log(222222222);
        this.setData({ is_choose: false });
        var datas = {
          startDate: s_y+'-'+s_m+'-'+s_d,
          endDate: e_y + '-' + e_m + '-' + e_d
        } // detail对象，提供给事件监听函数
        this.triggerEvent('getDate', datas) //myevent自定义名称事件传值
      }
    },
    // 点击取消按钮
    sure_er() {
      var old_stars1 = '', old_stars2 = ''
      var old_end1 = '', old_end2=''
      if (this.data.old_start == '选择出发时间' || this.data.old_start == 'NaN-NaN-NaN') {
        old_stars1 = '';
        old_stars2 = '';
      }else{
        old_stars1 = this.data.old_start.split('月')[0] + '月';
        old_stars2 = Number( this.data.old_start.split('月')[1].split('日')[0])
      }
      if (this.data.old_end == '选择到达时间' || this.data.old_end == 'NaN-NaN-NaN') {
        old_end1 = '';
        old_end2 = ''
      } else {
        old_end1 = this.data.old_end.split('月')[0] + '月';
        old_end2 = Number(this.data.old_end.split('月')[1].split('日')[0])
      }
      this.setData({
        is_choose: false, startDate: this.data.old_start, endDate: this.data.old_end,stars1: old_stars1,stars2: old_stars2,end1: old_end1,end2: old_end2
      });
    }

  },
  ready: function(){
    var currentObj = this.getCurrentDayString()
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      nowDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月'
    })
    this.setSchedule(currentObj);
  },
  
})
