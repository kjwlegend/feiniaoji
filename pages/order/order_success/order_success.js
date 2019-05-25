// pages/order/order_success/order_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersid:''
  },
  // 点击回到首页
  go_home(){
    wx.switchTab({
      url: '/pages/homepage/homepage',
    })
  },
  // 点击查看订单详情
  go_order_details(){
    var ordersid = this.data.ordersid;
    wx.redirectTo({
      url: '/pages/order/order_details/order_details?id=' + ordersid+'&is_user=0',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ordersid : options.id});
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


})