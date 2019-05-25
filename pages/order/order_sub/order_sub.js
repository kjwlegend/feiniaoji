// pages/order/order_sub/order_sub.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight:'',//我的物品重量
    left_weight:0,//飞鸟剩余重量
    goods:[],//我的确认的物品类型
    goods_on: [],
    goods_class: ['日用品', '食品', '文件', '衣物', '数码产品', '化妆品', '烟酒', '其他'],
    birds:{},
    money: '',
    infos:'',
    isIphoneX: false,
    gous: [0, 0, 0, 0, 0],
    isclick:true
  },
  // 点击提交订单addorders
  order_sub(e){
    if (this.data.isclick==false){
      return;
    }
    this.setData({ isclick: false });
    var j_goods = []
    for(var i=0;i<this.data.goods.length;i++){
      if (this.data.goods[i]!=undefined){
        j_goods.push(this.data.goods[i])
      }
    }
    j_goods = j_goods.join(',');
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    if (this.data.left_weight < Number(this.data.weight)) {
      this.setData({ isclick: true });
      wx.showToast({
        title: '下单重量已超出飞鸟的计划',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.weight == '' || this.data.money == '' || Number(this.data.money) == 0 || j_goods.length == 0) {
      this.setData({ isclick: true });
      return;
    }
    var data = {
      openid: openid,
      birdsid: this.data.birds.bid,
      goodsweight: this.data.weight,
      goodsid: j_goods,
      money: this.data.money,
      desc: this.data.infos,
      birdsuserid: this.data.birds.buserid,
    };
    wx.request({
      url: url+'addorders',
      data:data,
      success(res){
        // console.log(res);
        var id = res.data.ordersid;
        if(res.data.err==1){
          wx.redirectTo({
            url: '/pages/order/order_success/order_success?id='+id,
          })
        }else{
          wx.showToast({
            title: '提交失败',
            image:'/images/pay_lose.png'
          })
        }
      }
    })
  },
  // 选择收货类型
  choose_goods(e) {
    var num = e.currentTarget.dataset.num;
    var goods_class = this.data.goods_class;
    var goods_on = this.data.goods_on;
    if (goods_on[num] == num) {
      goods_on[num] = null;
    } else {
      goods_on[num] = num;
    }
    this.setData({
      goods_on: goods_on
    });
    var arr = [];
    for (var i = 0; i < goods_on.length; i++) {
      arr.push(goods_class[goods_on[i]]);
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == undefined) {
        arr.splice(i, 1);
      }
    }
    this.setData({
      goods: arr
    });
  },
  // 获取我的物品重量
  get_weight(e) {
    var weight = e.detail.value;
    if (this.data.left_weight < weight){
      wx.showToast({
        title: '下单重量已超出飞鸟的计划',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({ weight: weight });
  },
  // 获取我愿意支付的费用
  money(e){
    this.setData({money:e.detail.value});
  },
  // 获取备注信息
  get_info(e){
    this.setData({infos:e.detail.value});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取此行程信息
    var birdsid = options.id;
    var url = app.globalData.url;
    var that = this;

    this.setData({ isclick: true });
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
        }
      }
    })
    wx.request({
      url: url + 'birds',
      data: {
        birdsid: birdsid
      },
      success: function(res) {
        var birds = res.data.birds;
        if (birds.usore){
          birds.usore = Math.round(parseFloat(birds.usore) * 10 / 2);
        }

        that.setData({
          birds: birds
        });
        // console.log(that.data.birds);
        var left_weight = birds.btotalweight - birds.bresidueweight;
        that.setData({ left_weight: left_weight})
        // console.log(left_weight);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


})