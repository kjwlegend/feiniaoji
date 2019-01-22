// pages/homepage/homepage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    road_list:[1,1,1,1],
  },
  // 进入发现页面
  go_find(){
    wx.switchTab({
      url: `/pages/find/find`,
    })
  },
  // 进入发布页面
  go_release() {
    wx.switchTab({
      url: '/pages/release/release',
    })
  },
  // 进入行程详情页面
  go_tripDetails(){
    wx.navigateTo({
      url: '/pages/trip_details/trip_details',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success(res){
        console.log(res.userInfo);
        that.setData({userInfo:res.userInfo});
      }
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