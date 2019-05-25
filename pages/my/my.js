// pages/my/my.js
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
    order1: 0,
    order2: 0,
    order3: 0,
    order4: 0,
    order5:0,
    isIphoneX:false,
    xieyi:false,
    indexs:0,
    names:['FAQ','费用说明','关于飞鸟纪'],
    faqs: [`1.	货物丢失、损坏怎么办？
用户与飞鸟（带货人）沟通协商解决，平台可提供相关材料信息，协助解决纠纷。
2.	关于国内段快递费、关税、消费税、罚款等其他费用怎么办？
用户与飞鸟（带货人）在订单形成前就以上费用的承担方及支付方式达成一致。
3.	若用户下单时的货物重量/体积描述与货物实际重量/体积不符怎么办？
用户补交差价或飞鸟（带货人）退还差价
4.	货物涉及违法、违规时如何处理？
拒绝提供服务并立即上报相关部门
`,`1.	运费计算
运费金额由货主与飞鸟（带货人）沟通协商确认,平台不涉及运费计算。
2.	运费支付
平台在订单形成时代收取货主与飞鸟（带货人）协商确认的费用，在订单完成后24小时内支付给飞鸟。
3.	运费组成
运费=飞鸟（带货人）收益+平台中介费
4.	平台中介费
平台中介费=运费*10%
5.	平台中介费支付
平台中介费用在订单完成后从运费中自动扣除，试运营期间暂不收取平台中介费用
6.	其他费用
包括并不限于网络接入费、上网设备租用费、网络流量费、结算手续费，以及履行配送服务过程可能发生的其他费用等
`,`飞鸟纪微信小程序为合肥飞傅集网络科技有限公司（以下简称“飞傅集”）旗下产品。飞鸟纪为“飞傅集”打造的专业的国际物流信息共享平台，旨在精准匹配和对接国际小件物流需求与国际旅行剩余行李资源变现的需求，打破跨境带货人与寄货人间的信息壁垒，实现需求的高效匹配，打造一个安全、高效、便捷的需求交互平台。飞鸟纪小程序支持行程检索、微信支付、程序内即时通讯、订单状态跟踪、用户评价等功能。
`]
  },
  // 点击待确认、待支付...进入我的订单时
  go_order(e){
    console.log(e);
    var num = e.currentTarget.dataset.num;
    wx.navigateTo({
      url: '/pages/order/my_order/my_order?num=' + num +'&is_bird='+0
    })
  },
  // 进入我的订单页面
  go_my_order(){
    wx.navigateTo({
      url: '/pages/order/my_order/my_order?num=' + 0 + '&is_bird=' + 0,
    })
  },
  // 进入我的行程页面
  go_mytrip(){
    wx.navigateTo({
      url: '/pages/mytrip/mytrip',
    })
  },
  // 进入我的评价页面
  go_my_comment() {
    wx.navigateTo({
      url: '/pages/my/my_comment/mycomment',
    })
  },
  // 进入我的信息页面
  go_myinfo(){
    wx.navigateTo({
      url: '/pages/my_info/info_list/info_list',
    })
  },
  feiyong(e) {
    // this.data.faqs
    console.log(e.currentTarget.dataset.ids)
    this.setData({ xieyi: true, indexs: e.currentTarget.dataset.ids })
  },
  xieyi_off() {
    this.setData({ xieyi: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
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
    var that = this;
    var url = app.globalData.url;
    this.setData({ xieyi: false })
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'user',
      data: {
        openid: openid
      },
      success: function (res) {
        console.log(res);
        that.setData({ userInfo: res.data.user || '' })
      }
    });
    app.globalData.start_place = "选择出发地";
    app.globalData.end_place = "选择目的地";


    wx.request({
      url: url + 'ordercounts',
      data: {
        openid: openid
      },
      success: function (res) {
        that.setData({ order1: res.data.order1, order2: res.data.order2, order3: res.data.order3, order4: res.data.order4, order5: res.data.order5 });
      }
    })
  },

})