// pages/order/order_evaluate/order_evaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_evaluate:false,
    // 评分星星图片
    starImg:'/images/star1.png',
    xingurl:['','','','',''],
    star:0,
    ping:'',
    infos:{},
    inse:5,
    ucomment:{},
    placeho:'',
    username:''
  },
  // 点击选择星星
  btn(e){
    var num = e.currentTarget.dataset.num+1
    this.setData({inse:num});
  },
  inputchange:function(e){
    this.setData({ placeho: e.detail.value });
  },
  // 点击确定提交评价
  sub(){
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var data = {
      openid:openid,
      birdsid:this.data.infos.bid,
      birdsuserid:this.data.infos.userid,
      ordernumber :this.data.infos.numbers,
      comment: this.data.placeho||'好评',
      star: this.data.inse
    };
    wx.request({
      url: url+'addcomments',
      data:data,
      success(res){
        console.log(res);
        if(res.data.err==1){
          wx.showToast({
            title: '评价成功',
            success:function(){
              wx.switchTab({
                url: '../../my/my'
              })
            }
          })
        }
      }
    })

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({ infos: options});
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var that = this;
    var data = {
      openid: openid,
      birdsid: options.bid,//飞鸟id
      birdsuserid: options.userid,//飞鸟用户id
      ordernumber: options.numbers//订单号
    }

    // 获取对方的评价
    wx.request({
      url: url +'birdsordercomment',
      data:data,
      success(res){
        console.log(res);
        if(res.data.user==2){
          if (res.data.usercomments!=null){
            that.setData({ ucomment: res.data.usercomments, is_evaluate:true})
          }else{
            that.setData({ is_evaluate: false })
          }
        }else{
          if (res.data.birdscomments != null) {
            that.setData({ ucomment: res.data.birdscomments, is_evaluate: true })
          } else {
            that.setData({ is_evaluate: false })
          }
        }
        that.setData({ username: res.data.username })
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


})