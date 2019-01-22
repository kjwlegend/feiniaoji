// pages/release/release.js 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input:true,
    goods_class: ['日用品', '食品', '文件', '衣物', '数码产品','化妆品', '烟酒', '其他'],
    goods_on:[],
    xieyi:false,
    can_sub:false
  },

  // 选择收货类型
  choose_goods(e){
    console.log(e);
    var num = e.currentTarget.dataset.num;
    var goods_on = this.data.goods_on;
    if (goods_on[num]==num){
      goods_on[num] = null;
    }else{
      goods_on[num] = num;
    }
    this.setData({ goods_on: goods_on});
  },
  // 是否勾选同意协议
  agree(e){
    var can_sub = this.data.can_sub;
    this.setData({ can_sub: !can_sub});
  },
  // 飞鸟协议弹窗开关
  xieyi_on(){
    this.setData({xieyi:true});
  },
  xieyi_off(){
    this.setData({ xieyi: false });
  },
  // 进入发布成功页面
  go_release_success(){
    wx.navigateTo({
      url: '/pages/release/release_success/release_success',
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