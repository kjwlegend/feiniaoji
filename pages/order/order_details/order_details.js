// pages/order/order_details/order_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单状态
    state:[0,1,1,1,1],
    c_from:{country:"俄罗斯",city:"莫斯科",time:'2018-12-31'},
    c_to: { country: "中国", city: "上海", time: '2018-12-31'},
    // 是飞鸟订单还是用户订单
    is_bird:true,
    // 是否已经结束的订单
    is_over:false,
    // 已完成的订单
    is_complete:false,
    // 已取消的订单
    is_cancel: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})