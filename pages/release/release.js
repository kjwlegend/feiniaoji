// pages/release/release.js 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input:true,
    goods_class: ['日用品', '食品', '文件', '衣物', '数码产品','化妆品', '烟酒', '其他'],
    goods_on:[],
    xieyi:false,//飞鸟协议
    can_sub:false,//是否能点击提交
    start_place:'选择出发地',
    end_place:'选择目的地',
    startDate:'',
    endDate:'',
    share: [{ item: false }],// 输入的共享空间
    weight: '',//重量
    goods:[],//确认的收货类型
    infos:'',//备注信息
    isIphoneX:false,
    isclick:true
  },

  // 选择收货类型
  choose_goods(e){
    var num = e.currentTarget.dataset.num;
    var goods_class = this.data.goods_class;
    var goods_on = this.data.goods_on;
    if (goods_on[num]==num){
      goods_on[num] = null;
    }else{
      goods_on[num] = num;
    }
    this.setData({ goods_on: goods_on});
    var arr = [];
    for (var i = 0; i < goods_on.length;i++){
      arr.push(goods_class[goods_on[i]]);
    }
    for(var i=0;i<arr.length;i++){
      if(arr[i]==undefined){
        arr.splice(i,1);
      }
    }
    this.setData({goods:arr});
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
    if (this.data.isclick==false){
      return;
    }

    this.setData({isclick: false });
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

    
    if (app.globalData.start_country == '' || app.globalData.end_country == '' || app.globalData.start_place == '' || app.globalData.end_place == '' || app.globalData.start_place == '选择出发地' || app.globalData.end_place == '选择目的地' || this.data.startDate == "" || this.data.endDate == "" || this.data.startDate == "NaN-NaN-NaN" || this.data.endDate == "NaN-NaN-NaN" || this.data.weight == '' || j_box == '' || j_goods == ''){

      this.setData({ isclick: true });
      wx.showToast({
        title: '请填写完整',
        image: '../../images/pay_lose.png',
        mask: true
      })
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
      state: '0'
    }
    console.log(data);
    wx.request({
      url: url+'addbirds',
      data:data,
      success(res){
        //发布成功
        console.log(res);
        
        if(res.data.err==1){
          var id = res.data.birdsid.id;
          wx.navigateTo({
            url: '/pages/release/release_success/release_success?id='+id,
          })

        }else{
          wx.showToast({
            title: '发布失败请重试',
            image:"/images/pay_lose.png"
          })
        }
      }
    })
    
  },
  // 选择地点
  // 选择出发地
  choose_sp() {
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=start&come=release',
    })
  },
  // 选择目的地
  choose_ep() {
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=end&come=release',
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
  share_item(e){
    var value = e.detail.value;
    var index = e.currentTarget.dataset.index;
    var arr = this.data.share;
    arr[index].value = value;
    this.setData({share:arr});
  },
  // 添加行李箱
  add_share(){
    var arr = this.data.share;
    for(var i=0;i<arr.length;i++){
      arr[i].item = true;
    }
    arr.push({item:false});
    this.setData({share:arr});
  },
  // 删除行李箱
  reduce(e){
    var index = e.currentTarget.dataset.index;
    var arr = this.data.share;
    arr.splice(index,1);
    this.setData({share:arr});
  },
  // 共享重量
  get_weight(e){
    this.setData({weight:e.detail.value})
  },
  // 备注信息
  get_info(e){
    this.setData({ infos: e.detail.value })
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
    var start_place = app.globalData.start_place;
    var end_place = app.globalData.end_place;
    this.setData({ start_place: start_place });
    this.setData({ end_place: end_place });
    this.setData({ xieyi: false, isclick:true});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.selectComponent('#dates').data.is_choose) {
      this.selectComponent('#dates').sure_er()
    }

  },

})