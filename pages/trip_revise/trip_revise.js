// pages/release/release.js 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: true,
    goods_class: ['日用品', '食品', '文件', '衣物', '数码产品', '化妆品', '烟酒', '其他'],
    goods_on: [null, null, null, null, null, null, null, null],
    xieyi: false,//飞鸟协议
    can_sub: false,//是否能点击提交
    start_place: '选择出发地',
    end_place: '选择目的地',
    startDate: '',
    endDate: '',
    share: [{ item: false }],// 输入的共享空间
    weight: '',//重量
    goods: [],//确认的收货类型
    infos: '',//备注信息
    bid:1,
    bstartpoint:'',
    isIphoneX:false

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
    this.setData({ goods_on: goods_on });
    var arr = [];
    for (var i = 0; i < goods_on.length; i++) {
      arr.push(goods_class[goods_on[i]]);
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == undefined) {
        arr.splice(i, 1);
      }
    }
    this.setData({ goods: arr });
  },
  // 是否勾选同意协议
  agree(e) {
    var can_sub = this.data.can_sub;
    this.setData({ can_sub: !can_sub });
  },
  // 飞鸟协议弹窗开关
  xieyi_on() {
    this.setData({ xieyi: true });
  },
  xieyi_off() {
    this.setData({ xieyi: false });
  },
  // 进入发布成功页面
  go_release_success() {
    // 行李箱
    var arr = this.data.share;
    var box = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value) {
        if (arr[i].value != '') {
          box.push(arr[i].value);
        }
      }
    }
    var url = app.globalData.url;
    var j_box = box.join(',');
    // var j_goods = this.data.goods.join(',');

    var j_goods = []
    for (var i = 0; i < this.data.goods.length; i++) {
      if (this.data.goods[i] != undefined) {
        j_goods.push(this.data.goods[i])
      }
    }
    j_goods = j_goods.join(',');
    if (j_goods == '' || j_box == "" || this.data.weight == "" ){
      return;
    }
    var data = {
      openid: wx.getStorageSync('openid'),
      startpoint: app.globalData.start_country,
      endpoint: app.globalData.end_country,
      start: app.globalData.start_place,
      ends: app.globalData.end_place,
      starttime: this.data.startDate,
      endtime: this.data.endDate,
      totalweight: this.data.weight,
      desc: this.data.infos,
      box: j_box,
      types: j_goods,
      state: '0',
      birdsid:this.data.bid,
    }
    wx.request({
      url: url + 'birdsstate',
      data: data,
      success(res) {
        //发布成功
        if (res.data.err == 1) {
          wx.showToast({
            title: '修改成功',
            success:function(){
              wx.switchTab({
                url: '/pages/homepage/homepage',
              })
            }
          })
        } else {
          wx.showToast({
            title: '修改失败请重试',
            image: "/images/pay_lose.png"
          })
        }
      }
    })

  },
  // 选择地点
  // 选择出发地
  choose_sp() {
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=start&come=trip_revise',
    })
  },
  // 选择目的地
  choose_ep() {
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=end&come=trip_revise',
    })
  },
  // 获取始发时间
  getDate(e) {
    this.setData({
      startDate: e.detail.startDate,
      endDate: e.detail.endDate
    })
  },
  // 行李箱输入内容
  share_item(e) {
    var value = e.detail.value;
    var index = e.currentTarget.dataset.index;
    var arr = this.data.share;
    arr[index].value = value;
    this.setData({ share: arr });
  },
  // 添加行李箱
  add_share() {
    var arr = this.data.share;
    for (var i = 0; i < arr.length; i++) {
      arr[i].item = true;
    }
    arr.push({ item: false });
    this.setData({ share: arr });
    // console.log(this.data.share);
  },
  // 删除行李箱
  reduce(e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.share;
    arr.splice(index, 1);
    this.setData({ share: arr });
  },
  // 共享重量
  get_weight(e) {
    this.setData({ weight: e.detail.value })
  },
  // 备注信息
  get_info(e) {
    this.setData({ infos: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取此行程信息
    var birdsid = options.id;
    var url = app.globalData.url;
    var that = this;
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
      success: function (res) {
        var birds = res.data.birds;
        // console.log(birds);
        that.setData({ birds: birds, start_place: birds.bstart, end_place: birds.bends, startDate: birds.bstarttime, endDate: birds.bendtime, weight: birds.btotalweight, infos: birds.bdesc, bid: birds.bid,infos:birds.bdesc});
        // 更新本地的城市信息
        app.globalData.start_place = birds.bstart;
        app.globalData.end_place = birds.bends;
        app.globalData.start_country = birds.bstartpoint;
        app.globalData.end_country = birds.bendpoint;
        // 行李箱
        var box = birds.bbox.split(",");
        // console.log(box);
        var share =[];
        for(var i=0;i<box.length;i++){
          var obj = {};
          obj.item = true;
          obj.value = box[i];
          share.push(obj);
        }
        // console.log(share);
        that.setData({ share: share });
        // 货物类型
        var types = birds.btypes.split(",");
        var types_arr = [];
        var goods_class = that.data.goods_class;
        var goods_on = that.data.goods_on;
        // console.log(111);
        for (var i = 0; i < types.length; i++) {
          if (types[i].length != 0) {
            types_arr.push(types[i]);
          }
        }
        // console.log(types_arr);
        for (var i = 0; i < goods_class.length;i++){
          for(var j=0;j<types_arr.length;j++){
            if (types_arr[j] == goods_class[i]){
              goods_on[i] = i;
            }
          }
        }
        that.setData({goods_on:goods_on,goods:types_arr});
        // console.log( types_arr,that.data.goods_on);
        // 时间戳装换时间
        var timestamp = birds.bdateline;
        var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
        var date = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
        // console.log(date);
        that.setData({ date: date });
      }
    });
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
    // console.log(app.globalData.start_place);
    // 更新本地的城市信息
    this.setData({ start_place: app.globalData.start_place, end_place: app.globalData.end_place})
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