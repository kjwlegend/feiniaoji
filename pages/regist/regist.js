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
    index:0,
    array:['男','女'],
    isname:true,
    isphone: true,
    is_country: true,
    is_sub:false,
    is_weixin:true,
    name:'',
    phone:'',
    country:'',
    des:'',
    weixin:'',
    prefix:[],
    quhaos:''
  },
  // 点击提交进入主页
  go_homepage(){
    
    var phone = this.data.phone;
    var quhaos = this.data.quhaos;
    var name = this.data.name;
    var sex = this.data.index;
    var country = this.data.country;
    var des = this.data.des;
    var weixin = this.data.weixin;
    var that = this;
    if (this.data.weixin.length<1) {
      wx.showToast({
        title: 请先填写微信号,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.is_weixin == true) {
      wx.showToast({
        title: '此账号已被使用',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 手机号验证正确
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    console.log(openid);
    wx.request({
      url: url+'adduser',
      data:{
        areacode: quhaos,
        username:name,
        phone:phone,
        sex:sex,
        nation:country,
        describe:des,
        openid:openid,
        wxaccount: weixin
      },
      success:function(res){
        console.log(res);
        if(res.data.err==1){//成功添加
          wx.switchTab({
            url: '/pages/homepage/homepage',
          })
        }else{//添加失败
          wx.showToast({
            title: '添加失败请重试',
            image: '/images/pay_lose.png'
          })
        }
        
      }
    })
    
    
  },
  // 性别
  bindPickerChange(e){
    this.setData({index:e.detail.value});
    console.log(this.data.index);
  },
  // 名字
  name(e){
    this.setData({name:e.detail.value});
    if (this.data.name.length > 0) {
      this.setData({ isname: false })
    } else {
      this.setData({ isname: true })
    }
    this.can_sub();
  },
  // 电话号码
  phone(e) {
    this.setData({ phone: e.detail.value });
    this.phone_on();
    this.can_sub();
  },
  // 区号
  qu(e) {
    console.log(e)
    var that=this

    this.setData({ quhaos: e.detail.value});
    var url = app.globalData.url
    if (e.detail.value==''){
      that.setData({ prefix: [] })
      return;
    }

    wx: wx.request({
      url: url + 'countrycode',
      data: {
        country: e.detail.value
      },
      success: function (res) {
        that.setData({
          prefix: res.data.prefix
        })
      }
    })
  },
  clopses: function () {
    this.setData({ prefix: [] })
  },
  // 国家
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
    var quhaos = this.data.quhaos;
    if (phone != '' && quhaos != ''){
      this.setData({ isphone:false});
    }else{
      this.setData({ isphone: true });
    }
    this.can_sub();
  },
  // 获取微信号
  weixin(e) {
    var weixin = e.detail.value;
    this.setData({ weixin: weixin });
    var url = app.globalData.url;
    var that = this;
    wx.request({
      url: url+'wxaccount',
      data:{
        wxaccount: weixin
      },
      success(res){
        console.log(res);
        if (res.data.err == 0) {
          that.setData({ is_weixin: false })
        } else if (res.data.err == 1) {
          wx.showToast({
            title: '该微信号已被注册',
            icon: 'none',
            duration: 2000
          })
          that.setData({ is_weixin: true })
        }
      }
    })
    this.can_sub();
  },
  // 获取描述
  des(e){
    this.setData({des:e.detail.value});
  },
  // 判断是否能提交
  can_sub(){
    var name = this.data.name;
    var phone = this.data.phone;
    var country = this.data.country;
    var quhaos = this.data.quhaos;
    var weixin = this.data.weixin;
    if (name != '' && phone != '' && country != '' && quhaos!=''&&weixin!=''){
      this.setData({is_sub:true});
    }else{
      this.setData({ is_sub: false });
      console.log("信息未填写完整")
    }
  },
  // 环信登录函数
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
      data: name
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
          console.log("注册成功")
          var data = {
            apiUrl: WebIM.config.apiURL,
            user: name,
            pwd: pwd,
            grant_type: "password",
            appKey: WebIM.config.appkey
          };
          console.log(data)
          wx.setStorage({
            key: "myUsername",
            data: name
          });
          that.hxloign(name, pwd);

        }
      },
      error: function (res) {
        if (res.statusCode !== "200") {
          console.log("已经注册，直接登录");
          types = 1;
          that.hxloign(name, pwd);
        }
      }
    };
    if (types == 0) {
      WebIM.utils.registerUser(options);
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
  prefis:function(e){
    var items = e.currentTarget.dataset.ites
    this.setData({ quhaos: items.prefix + '(' + items.country +')', prefix:[] });
    this.can_sub();
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