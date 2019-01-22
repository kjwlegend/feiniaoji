// pages/order/order_evaluate/order_evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_evaluate:false,
    // 评分星星图片
    starImg:'/images/star1.png',
    imgs: ['/images/star1.png', '/images/star2.png' , '/images/star3.png', '/images/star4.png' , '/images/star5.png'],
  },
  btn(e){
    console.log(e);
    var imgs = this.data.imgs;
    var starImg = imgs[e.currentTarget.dataset.num];
    this.setData({starImg:starImg});
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