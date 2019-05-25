// pages/homepage/homepage.js
var util = require("../../utils/util.js");
var app = getApp();
var strophe = require('../../sdk/libs/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
let __test_account__, __test_psword__;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    birds: [],
    num:3,
    select:"查看更多",
    weixin:null,
    swipers: ['/images/banner.png', '/images/banner.png','/images/banner.png'],
    indes:0,
    isIphoneX:false
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
  go_tripDetails(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/trip_details/trip_details?id=' + id,
    })
  },
  // 点击查看更多
  get_more(res){
    var that = this;
    var num = this.data.num+7;
    this.setData({num:num});
    var url = app.globalData.url;
    wx.request({
      url: url + 'selbirds',
      success(res) {
        // console.log(res);
        if(res.data.err==1){
          var arr = res.data.birds;
          var num = that.data.num;
          var birds = [];
          for (var i = 0; i < arr.length; i++) {
            if (i < num) {
              birds.push(arr[i]);
            }
          }
          // console.log(birds);
          that.setData({ birds: birds })
          if (birds.length == arr.length) {
            that.setData({ select: "没有更多了..." })
          }
        }
        
      }
    })
  },
  // 登录函数
  hxloign: function (name, pwd) {
    console.log("登录")
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: name,
      pwd: pwd,
      grant_type: 'password',
      appKey: WebIM.config.appkey //应用key
    }
    wx.setStorage({
      key: "myUsername",
      data: __test_account__ || name
    })
    WebIM.conn.open(options)
  },
  // 注册并登录函数
  register: function (name, pwd) {
    var types = 0;
    var that = this;
    var options = {
      apiUrl: WebIM.config.apiURL,
      username: name,
      password: pwd,
      nickname: "",
      appKey: WebIM.config.appkey,
      success: function (res) {
        if (res.statusCode == "200") {
          // console.log("注册成功")
          var data = {
            apiUrl: WebIM.config.apiURL,
            user: name,
            pwd: pwd,
            grant_type: "password",
            appKey: WebIM.config.appkey
          };
          // console.log(data)
          wx.setStorage({
            key: "myUsername",
            data: name
          });
          that.hxloign(name, pwd);

        }
      },
      error: function (res) {
        if (res.statusCode !== "200") {
          // console.log("已经注册，直接登录");
          types = 1;
          that.hxloign(name, pwd);
        }
      }
    };
    if (types == 0) {
      WebIM.utils.registerUser(options);
    }
  },
  // 获取个人信息
  getInfo(){
    var that = this;
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'user',
      data: {
        openid: openid
      },
      success: function (res) {
        if(res.data.err==1){
          var weixin = res.data.user.wxaccount
          that.setData({ weixin: weixin });
          that.register(weixin, '11');
        }
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
    var that = this;
    wx.getUserInfo({
      success(res){
        // console.log(res.userInfo);
        that.setData({userInfo:res.userInfo});
      }
    })
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX:true})
        }
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
    // 获取行程信息
    var that = this;
    var url = app.globalData.url;
    wx.request({
      url: url + 'selbirds',
      success(res) {
        console.log(res);
        var arr = res.data.birds;
        var num = that.data.num;
        var birds = [];
        for (var i = 0; i < arr.length; i++) {
          if (i <= num) {
            birds.push(arr[i]);
          }
        }
        that.setData({ birds: birds })
      }
    })
    app.globalData.start_place = "选择出发地";
    app.globalData.end_place = "选择目的地";
  },

  // 轮播图
  changese:function(e){
    this.setData({ indes: e.detail.current});
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

  }
})
