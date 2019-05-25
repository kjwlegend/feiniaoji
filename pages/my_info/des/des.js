// pages/my_info/des/des.js
var app = getApp();

var url = app.globalData.url;
var openid = wx.getStorageSync('openid');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    des:'',
    placeho:''
  },
  // 获取输入内容
  getinput(e) {
    var placeho = e.detail.value
    this.setData({ placeho: placeho });
  },
  // 提交保存
  change() {
    var placeho = this.data.placeho;
    wx.request({
      url: url + 'saveuser',
      data: {
        openid: openid,
        describe: placeho
      },
      success(res) {
        wx.showToast({
          title: '修改成功!',
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: url + 'user',
      data: {
        openid: openid
      },
      success: function (res) {
        that.setData({ placeho: res.data.user.describe || that.data.placeho });
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

})