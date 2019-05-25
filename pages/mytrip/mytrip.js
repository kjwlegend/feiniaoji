// pages/mytrip/mytrip.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    trip_list:[],
    orders:[],
    isIphoneX:false,
    order_none:true
  },
  choose(e){
    this.data.order_none = true
    for (var i = 0; i < this.data.trip_list.length;i++){
      if (e.currentTarget.dataset.index == this.data.trip_list[i].bstate){
        this.data.order_none=false
      }
    }
    this.setData({ index: e.currentTarget.dataset.index, order_none: this.data.order_none});
  },
  // 点击查看详情
  go_trip_details(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/trip_details/trip_details?id=' + id,
    })
  },
  // 点击关联订单
  go_orders(e){
    // console.log("点击关联订单");
    var id = e.currentTarget.dataset.id;
    var is_user = 1;
    wx.navigateTo({
      url: '/pages/order/order_details/order_details?id=' + id + '&is_user=' + is_user,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // 获取我的行程信息与订单信息
    wx.request({
      url: url+'mybirds',
      data:{
        openid :openid
      },
      success(res){
        console.log(res);
        var trip = res.data.birds;
        var orders = res.data.orders;
        for(var i=0;i<trip.length;i++){
          if (trip[i].btotalearn==null){
            trip[i].btotalearn = 0;
          }
          trip[i].left_weight = parseInt(trip[i].btotalweight) - parseInt(trip[i].bresidueweight)
        }
        that.data.order_none = true
        for (var i = 0; i < trip.length; i++) {
          if (0 == trip[i].bstate) {
            that.data.order_none = false
          }
        }
        that.setData({ trip_list: trip, orders: orders, order_none: that.data.order_none});
        // console.log(that.data.trip_list,that.data.orders)
      }
    });
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