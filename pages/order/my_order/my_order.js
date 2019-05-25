// pages/order/my_order/my_order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_user:0,//判断是用户还是飞鸟
    nav_choose:0,
    all_orders:[],
    orders:[],
    no_order:true,
    isIphoneX:false,
  },
  // 点击评价到达评价页面
  go_evaluate(e){
    var username = e.currentTarget.dataset.username; 
    var bid = e.currentTarget.dataset.bid; 
    var userid = e.currentTarget.dataset.userid; 
    var numbers = e.currentTarget.dataset.numbers; 

    wx.navigateTo({
      url: `/pages/order/order_evaluate/order_evaluate?username=${username}&bid=${bid}&userid=${userid}&numbers=${numbers}`,
    })
  },
  // 飞鸟点击确认发货
  sure_goods(e) {
    var dataset = e.currentTarget.dataset;
    var url = app.globalData.url;
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'saveorders',
      data: {
        birdsid: dataset.id,
        state: dataset.start
      },
      success: function (res) {
        if (res.data.err == 1) {
          wx.showToast({
            title: '确认成功!',
            success: function () {}
          })
          wx.request({
            url: url + dataset.urls,
            data: {
              openid: openid
            },
            success(res) {
              that.neirong(that.data.nav_choose, res.data.orders)
            }
          })
        }
      }
    })
  },
  // 飞鸟点击确认订单
  sure_order(e){
    var url = app.globalData.url;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url +'saveorders',
      data:{
        birdsid:id,
        state:1
      },
      success(res){
        if(res.data.err==1){//重新获取我是飞鸟时的订单信息
          wx.request({
            url: url + 'birdsorders',
            data: {
              openid: openid
            },
            success(res) {
              that.neirong(that.data.nav_choose, res.data.orders)
            }
          })
        }
      }
    })
  },
  // 选择用户或飞鸟
  choose_header(e){
    this.setData({ is_user: e.currentTarget.dataset.num, nav_choose:0})
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var that = this;
    var names=''
    // 获取我的飞鸟订单
    if(this.data.is_user==0){
      names = 'orders'
    }else {
      names = 'birdsorders'
    }
    wx.request({
      url: url + names,
      data: {
        openid: openid
      },
      success(res) {
        that.setData({ orders: res.data.orders, all_orders: res.data.orders })
      }
    })
  },
  // 选择订单状态
  choose_nav(e){
    this.neirong(e.currentTarget.dataset.num, this.data.all_orders)
  },
  // 点击查看详情
  go_order_details(e){
    var id = e.currentTarget.dataset.id;
    var is_user = this.data.is_user;
    wx.navigateTo({
      url: '/pages/order/order_details/order_details?id=' + id + '&is_user=' + is_user,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取我的订单
    console.log(options)
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
        }
      }
    })
    this.setData({ is_user: options.is_bird })
    var names=''
    if (options.is_bird == '0') {
      names = 'orders'
    } else {
      names = 'birdsorders'
    }
    wx.request({
      url: url + names,
      data:{
        openid:openid
      },
      success(res){
        if(res.data.err==0){return;}
        console.log(res)
        that.neirong(options.num, res.data.orders)
      }
    })
  },
  neirong: function (index, all_orders){
    var that=this
    var arr = [];

    if (index == 0) {
      arr = all_orders
    } else {
      for (var i = 0; i < all_orders.length; i++) {
        if (all_orders[i].ostate == (index - 1)) {
          arr.push(all_orders[i]);
        }
      }
    }
    that.setData({ orders: arr, all_orders: all_orders, nav_choose: index})
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

})