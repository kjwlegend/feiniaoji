// pages/pay/pay_result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_success:true,
    orderid:''
  },

  // go_order点击查看订单详情
  go_order(){
    wx.navigateBack({
      delta: 1
    })
  },
  go_home() {
    wx.switchTab({
      url: '/pages/homepage/homepage'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.judge=='true'){
      var judge = true;
    }else{
      var judge = false;
    }
    this.setData({ pay_success: judge});
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