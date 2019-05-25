// pages/my_info/info_list/info_list.js
var app = getApp();
var wxApi = require('../../../utils/wxApi')
var wxRequest = require('../../../utils/wxRequest')
var Promise = require('../../../utils/es6-promise.js')
var util = require('../../../utils/util.js');
Page({
  header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8', } ,

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    nickname:''
  },
  // 修改信息
  change(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/my_info/${id}/${id}`,
    })
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
    var userInfo = app.globalData.userInfo;
    this.setData({nickname:userInfo.nickName});
    var that = this;
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'user',
      data: {
        openid: openid
      },
      success: function (res) {
        console.log(res)
        
        var user = res.data.user;
        var nickname = util.baseDecode(user.nickname);
        user.nickname = nickname;
        if (user.describe==null){
          console.log(123)
          user.describe=''
        }
        that.setData({ userInfo: user })
      }
    })
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