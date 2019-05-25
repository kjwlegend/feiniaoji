// pages/order/order_details/order_details.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单状态
    state: [0, 1, 1, 1, 1],
    c_from: { country: "俄罗斯", city: "莫斯科", time: '2018-12-31' },
    c_to: { country: "中国", city: "上海", time: '2018-12-31' },
    // 是飞鸟订单还是用户订单
    is_bird: false,
    // 是否已经结束的订单
    is_over: false,
    // 已完成的订单
    is_complete: false,
    // 已取消的订单
    is_cancel: false,
    birds: {},//行程信息
    birdsuser: {},//飞鸟信息
    orders: {},//订单信息
    orders_time: '',//订单时间
    orderuser: {},//订单用户信息
    birdsuser_score: 0,
    orders_score: 0,
    comments:{},
    orderid:'',
    el_date:'',
    queren:false,
    isIphoneX: false,
    gous: [0, 0, 0, 0, 0]
  },
  // 点击沟通
  chat(){
    var is_bird = this.data.is_bird;
    var that = this;
    var myName, your, openid, friendopenid,urls
    if(is_bird){
      myName = that.data.birdsuser.wxaccount;
      your = that.data.orderuser.wxaccount;
      openid = that.data.birdsuser.openid;
      friendopenid = that.data.orderuser.openid;
      urls = that.data.orderuser.headerimg
    }else{
      myName = that.data.orderuser.wxaccount;
      your = that.data.birdsuser.wxaccount;
      openid = that.data.orderuser.openid;
      friendopenid = that.data.birdsuser.openid;
      urls = that.data.birdsuser.headerimg
    }
    var nameList = {
      myName: myName,
      your: your
    };
    console.log(that.data)
    var url = app.globalData.url;
    wx.request({
      url: url +'openidfriend',
      data: {
        openid: openid,
        friendopenid: friendopenid
      },
      success(res){
        console.log(res);
        if(res.data.err==1){
          wx.navigateTo({
            url: '/pages/chatroom/chatroom?username=' + JSON.stringify(nameList) + '&urls=' + urls
          })
        }else{
          wx.showModal({
            title: '出错了',
            content: '请稍后再试',
            showCancel: false
          })
        }
      }
    })

    WebIM.conn.getRoster({
      success: function (roster) {
        console.log(roster)
        for (var i = 0, l = roster.length; i < l; i++) {
          var ros = roster[i];
          if (ros.subscription === 'both' && ros.name == your) {
            return;
          }
        }
      },
    });
    WebIM.conn.subscribe({
      to: your,
      message: '加个好友呗!'
    });

    
  },
  // 点击支付
  pay() {
    var orders = this.data.orders;
    var birds = this.data.birds;
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var money = orders.money*100;
    var name = birds.start + '-' + birds.ends;
    var ordernumber = orders.ordernumber;
    console.log(ordernumber, openid, name, money);
    var that = this;
    wx.request({
      url: url + 'scoupon',
      data: {
        openid: openid,
        money: money,
        name: name,
        ordernumber: ordernumber,
      },
      success(res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.sign,
          success: function (res2) {
            console.log('支付成功');
            var data = {
              birdsid: that.data.birds.id,
              ordernumber: ordernumber,
              money: money,
              goodsweight: that.data.orders.goodsweight,
              state: 2,
              formid: res.data.package
            }
            console.log(data);
            var orderid = that.data.orderid;
            wx.request({
              url: url + 'orderresults',
              data: data,
              success(res) {
                wx.navigateTo({
                  url: '/pages/pay/pay_result?judge=true'
                })
              }
            })
          },
          fail: function (res) {
            console.log('支付失败')
            wx.navigateTo({
              url: '/pages/pay/pay_result?judge=false'
            })
          }
        })
      }
    })
  },
  // 点击确认发货saveorders
  sure_send(e) {
    var dataset = e.currentTarget.dataset;
    var url = app.globalData.url;
    var that = this;
    wx.request({
      url: url + 'saveorders',
      data: {
        birdsid: dataset.id,
        state: dataset.state
      },
      success: function (res) {
        if (res.data.err == 1) {
          wx.showToast({
            title: '已确认!',
            success: function () {
            }
          })

          var arr = that.data.state;
          arr[dataset.state-1] = 1;
          arr[dataset.state] = 0;
          that.setData({ state: arr });
        }
      }
    })
  },
  // 点击取消行程
  cancel_trip() {
    var url = app.globalData.url;
    var that = this;
    wx.showModal({
      title: '取消行程',
      content: '确认取消行程吗？',
      success(res) {
        if (res.confirm) {
          console.log(that.data.orders.id);
          wx.request({
            url: url + 'saveorders',
            data: {
              birdsid: that.data.orders.id,
              state: 6
            },
            success(res) {
              that.setData({ is_cancel: true, is_over: true });
            }
          })
        }
      }
    })
  },
  // 点击查看行程信息
  go_trip_details(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/trip_details/trip_details?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var orderid = options.id;
    var url = app.globalData.url;
    var that = this;
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
        }
      }
    })
    var queren=false
    that.setData({orderid:orderid});
    // 判断是否是用户订单还是飞鸟订单
    if (options.is_user == 0) {//是用户
      that.setData({ is_bird: false });
    } else {
      that.setData({ is_bird: true });
    }
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'selorderfind',
      data: {
        orderid: orderid,
        openid: openid
      },
      success(res) {
        var birdsuser = res.data.birdsuser;
        var orderuser = res.data.orderuser;
        var score1 = parseFloat(birdsuser.sore) * 10 / 2;
        score1 = Math.round(score1);
        var score2 = parseFloat(orderuser.sore) * 10 / 2;
        score2 = Math.round(score2);
        birdsuser.img =score1;
        orderuser.img =score2;
        // 评论时间戳转换
        if (res.data.comments!=null){
          var comments = res.data.comments;
          comments.cdateline = util.get_time(comments.cdateline);
        }else{
          var comments = res.data.comments;
        }
        if (openid == res.data.birdsuser.openid){
          queren=true
        }else{
          queren=false
        }
        console.log(res.data)

        birdsuser.sore = Math.round(parseFloat(birdsuser.sore) * 10 / 2);
        orderuser.sore = Math.round(parseFloat(orderuser.sore) * 10 / 2);
        that.setData({
          birds: res.data.birds,
          birdsuser: birdsuser,
          orders: res.data.orders,
          orderuser: orderuser,
          comments: comments,
          queren: queren
        });
        // 判断订单状态
        var arr = that.data.state;
        var index = that.data.orders.state
        for (var i = 0; i < arr.length; i++) {
          arr[i] = 1;
          if (i == index) {
            arr[i] = 0;
          }
        }
        if (index == 6) {
          that.setData({ is_cancel: true, is_over: true });
        }
        if (index == 5) {
          that.setData({is_over: true,is_complete:true });
        }
        that.setData({ state: arr });

        // 得到事发地点国家城市
        var birds = that.data.birds;
        var c_from = { city: birds.start, country: birds.startpoint, time: birds.starttime };
        var c_to = { city: birds.ends, country: birds.endpoint, time: birds.endtime };
        that.setData({ c_from: c_from, c_to: c_to });
        // 时间戳装换时间
        var timestamp = that.data.orders.dateline;
        var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
        var date = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
        that.setData({ orders_time: date });
      }
    })
  },
  queren:function(){
    var url = app.globalData.url;
    var id = this.data.orders.id;
    wx.request({
      url: url + 'saveorders',
      data: {
        birdsid: id,
        state: 1
      },
      success(res) {
        if (res.data.err == 1) {
          wx.showToast({
            title: '确认成功',
            icon: 'success',
            duration: 2000
          })

          wx.redirectTo({
            url: '/pages/order/order_details/order_details?id=' + id + '&is_user=1',
          })
        }
      }
    })
  },
  cancel_pingjia:function(e){
    var username = e.currentTarget.dataset.username;
    var bid = e.currentTarget.dataset.bid;
    var userid = e.currentTarget.dataset.userid;
    var numbers = e.currentTarget.dataset.numbers;
    wx.navigateTo({
      url: `/pages/order/order_evaluate/order_evaluate?username=${username}&bid=${bid}&userid=${userid}&numbers=${numbers}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

})