// pages/regist/regist.js
var app = getApp();
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
var Promise = require('../../utils/es6-promise.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    index:2,
    array:['男','女'],
    isname:true,
    isphone: true,
    is_country: true,
    is_sub:false,
    name:'',
    qu:'',
    phone:'',
    country:''
  },
  // 点击提交进入主页
  go_homepage(){
    wx.switchTab({
      url: '/pages/homepage/homepage',
    })
  },

  bindPickerChange(e){
    this.setData({index:e.detail.value});
  },
  name(e){
    this.setData({name:e.detail.value});
    if (this.data.name.length > 0) {
      this.setData({ isname: false })
    } else {
      this.setData({ isname: true })
    }
    this.can_sub();
  },
  phone(e) {
    this.setData({ phone: e.detail.value });
    this.phone_on();
    this.can_sub();
  },
  qu(e) {
    this.setData({ qu: e.detail.value });
    this.phone_on();
    this.can_sub();
  },
  country(e) {
    this.setData({ country: e.detail.value });
    if(this.data.country.length>0){
      this.setData({is_country:false})
    }else{
      this.setData({ is_country: true })
    }
    this.can_sub();
  },
  // 判断区号和号码是否填写
  phone_on(){
    var phone = this.data.phone;
    var qu = this.data.qu;
    if (phone != '' && qu != ''){
      this.setData({ isphone:false});
    }else{
      this.setData({ isphone: true });
    }
  },
  // 判断是否能提交
  can_sub(){
    var name = this.data.name;
    var phone = this.data.phone;
    var country = this.data.country;
    var qu = this.data.qu;
    if (name != '' && phone != '' && country != '' && qu != ''){
      this.setData({is_sub:true});
    }else{
      this.setData({ is_sub: false });
      console.log("信息未填写完整")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var getUserInfo = wxApi.wxGetUserInfo();
    getUserInfo().then(res=>{
      that.setData({userInfo:res.userInfo})
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