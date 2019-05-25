// pages/my/my_comment/mycomment.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose:0,
    ucomments:[],
    mcomments:[],
    userbirds:0,
    userorders:0,
    user:{},
    scoreImg:'',
    isIphoneX:false,
    urlse:['','','','','']
  },
  choose(e){
    console.log(e);
    this.setData({choose:e.currentTarget.dataset.num});
  },
  // 点击去评价
  go_order(e) {
    var num = 5;
    var is_bird = e.currentTarget.dataset.is_bird;
    wx.navigateTo({
      url: '/pages/order/my_order/my_order?num=' + num+'&is_bird='+is_bird
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取我的用户信息
    var user = wx.getStorageSync('user');
    this.setData({user:user});
    var score = parseFloat(user.sore)*10/2;
    score = Math.round(score);
    this.setData({ scoreImg: score});
    // 获取我的评论comments
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
        }
      }
    })
    wx.request({
      url: url +'comments',
      data:{
        openid:openid
      },
      success(res){
        console.log(res);
        // 装换昵称base64和时间戳
        var comments = res.data.comments;
        var comments1 = res.data.comments1;
        var info = res.data.info;
        for(var i=0;i<comments.length;i++){
          comments[i].bdateline = util.get_time(comments[i].cdateline);
          comments[i].unickname = util.baseDecode(comments[i].unickname);
        }
        for (var i = 0; i < comments1.length; i++) {
          comments1[i].bdateline = util.get_time(comments1[i].cdateline);
          comments1[i].unickname = util.baseDecode(comments1[i].unickname);
        }
        for (var i = 0; i < info.length; i++) {
          info[i].bdateline = util.get_time(info[i].cdateline);
          info[i].unickname = util.baseDecode(info[i].unickname);
          comments1.push(info[i])
        }
        that.setData({ mcomments: comments, ucomments: comments1, userorders: res.data.userorders, userbirds: res.data.userbirds});
      }
    })

  },

})