// pages/release/release_success/release_success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ id: options.id });
    console.log(this.data.id);
  },
  // 点击查看订单详情
  go_order(){
    var id = this.data.id;
    wx.redirectTo({
      url: '/pages/trip_details/trip_details?id='+id,
    })
  },
  // 回到首页
  go_home(){
    wx.reLaunch({
      url: '/pages/homepage/homepage',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (oprions) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})