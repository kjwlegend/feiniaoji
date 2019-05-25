// pages/my_info/phone/phone.js
var app = getApp();
var openid = wx.getStorageSync('openid');
var url = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qu:'',
    num:'',
    prefix:[]
  },
  get_qu(e){
    var that=this
    var qu = e.detail.value;
    console.log(qu);
    this.setData({qu:qu});

    var url = app.globalData.url
    if (e.detail.value == '') {
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
  chonse:function(e){
    console.log(e.currentTarget.dataset.items)
    this.setData({ qu: e.currentTarget.dataset.items.prefix + '(' + e.currentTarget.dataset.items.country + ')', prefix: [] });
  },
  close: function () {
    this.setData({ prefix: [] })
  },
  get_num(e) {
    var num = e.detail.value;
    this.setData({ num: num });
  },
  change(){
    var areacode = this.data.qu;
    var phone = this.data.num;

    if (areacode == '' || phone == '') {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: url + 'saveuser',
      data: {
        openid: openid,
        areacode: areacode,
        phone: phone
      },
      success(res) {
        console.log(res);
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
        console.log(res)
        that.setData({
          qu: '' || res.data.user.areacode,
          num: '' || res.data.user.dateline
        });
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

})