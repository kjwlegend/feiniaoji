// pages/find/find.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys: [],
    startDate: '',
    endDate: '',
    start_place: '选择出发地',
    end_place: '选择目的地',
    num:2,
    birds:[],
    loading:'加载中',
    isIphoneX:false,
    close:false
  },
  // 点击为你推荐
  go_tripDetails(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/trip_details/trip_details?id=' + id,
    })
  },
  
  // 点击搜索
  search(){
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    var start_place = this.data.start_place;
    var end_place = this.data.end_place;
    var start_country = app.globalData.start_country;
    var end_country = app.globalData.end_country;
    console.log(this.data)
    if (this.data.startDate){
      if (this.data.startDate == 'NaN-NaN-NaN' || this.data.endDate == 'NaN-NaN-NaN'){

        wx.showToast({
          title: '请选择时间',
          image: '../../images/pay_lose.png',
          mask: true
        })
        return;
      }
    }
    if (start_place == '选择出发地' || end_place =='选择目的地' ){
      wx.showToast({
        title: '请选择地区',
        image:'../../images/pay_lose.png',
        mask:true
      })
    }else{
      wx.navigateTo({
        url: `/pages/search_res/search_res?startDate=${startDate}&endDate=${endDate}&start_place=${start_place}&end_place=${end_place}&start_country=${start_country}&end_country=${end_country}`,
      })
    }
  },
  // 点击热门行程搜索热门行程数据
  search_hot(e){
    console.log(e)
    var startDate = '';
    var endDate = '';
    var start_place = e.currentTarget.dataset.obj.citys;
    var end_place = e.currentTarget.dataset.obj.endscitys;
    var start_country = e.currentTarget.dataset.obj.nations;
    var end_country = e.currentTarget.dataset.obj.endsnations;
    wx.navigateTo({
      url: `/pages/search_res/search_res?startDate=${startDate}&endDate=${endDate}&start_place=${start_place}&end_place=${end_place}&start_country=${start_country}&end_country=${end_country}`,
    })
  },

  // 获取始发时间
  getDate(e) {
    console.log(e);
    this.setData({
      startDate: e.detail.startDate,
      endDate: e.detail.endDate
    })
    console.log(this.data.startDate, this.data.endDate);
  },
  // 选择地点
  // 选择出发地
  choose_sp(){
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=start&come=find',
    })
  },
  // 选择目的地
  choose_ep(){
    wx.navigateTo({
      url: '/pages/choose_place/choose_place?choose=end&come=find',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取热门行程
    var imgurl = app.globalData.imgurl;
    var url = app.globalData.url;
    wx.request({
      url: url +'tripimg',
      success(res){
        console.log(res);
        var arr = res.data.select;
        for(var i=0;i<arr.length;i++){
          arr[i].img = imgurl+arr[i].img;
        }
        that.setData({ citys: arr});
      }
    })
    // 获取为你推荐行程信息
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
        console.log(birds, num)
        that.setData({ birds: birds })
      }
    })
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
    var that = this

    var url = app.globalData.url;
    wx.request({
      url: url + 'selbirds',
      success(res) {
        var arr = res.data.birds;
        var num = that.data.num;
        var birds = [];
        for (var i = 0; i < arr.length; i++) {
          if (i < num) {
            birds.push(arr[i]);
          }
        }
        that.setData({ birds: birds })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.selectComponent('#dates').data.is_choose) {
      this.selectComponent('#dates').sure_er()
    }
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
    var that = this;
    var num = this.data.num + 7;
    this.setData({ num: num });
    var url = app.globalData.url;
    wx.request({
      url: url + 'selbirds',
      success(res) {
        var arr = res.data.birds;
        var num = that.data.num;
        var birds = [];
        for (var i = 0; i < arr.length; i++) {
          if (i < num) {
            birds.push(arr[i]);
          }
        }
        if(num>=arr.length){
          that.setData({loading:'已经到底了'})
        }
        that.setData({ birds: birds })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})