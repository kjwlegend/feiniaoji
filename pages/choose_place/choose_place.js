// pages/choose_place/choose_place.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place:'',
    history: ['英国', '英国', '英国', '英国', '英国', '英国', '英国', '英国'],
    hot: ['英国', '英国', '英国', '英国', '英国', '英国', '英国'],
    select:false,
    country:{},
    choose_start:false,
    choose_end:false,
    come:'',
    country_sure:''
  },
  // 输入搜索
  select(e){
    console.log(e);
    this.setData({place:e.detail.value})
    var wd = e.detail.value;
    var that = this;
    // var openid = app.globalData.openid;
    var openid = wx.getStorageSync('openid');
    console.log(wd) 

    var url = app.globalData.url;
    wx.request({
      url: url+'country',
      data:{
        city:wd,
        openid: openid
      },
      success:function(res){
        if(res.data.err==1){
          that.setData({ select: true, country: res.data.country });
        }
        
      }
    })
    if(this.data.place==''){
      this.setData({select:false});
    }
  },
  // 取消选择
  cancel(){
    this.setData({place:'',select:false});
  },
  // 选择地点
  choose_place(e){
    this.setData({ place: e.currentTarget.dataset.place, country_sure: e.currentTarget.dataset.country});
    var place = this.data.place;
    var country = this.data.country_sure;
    if(this.data.come=='find'){//来自搜索页面
      if (this.data.choose_start) {
        app.globalData.start_place = place;
        app.globalData.start_country = country;
        wx.switchTab({
          url: `/pages/find/find`,
        })
      }else{
        app.globalData.end_place = place;
        app.globalData.end_country = country;
        wx.switchTab({
          url: `/pages/find/find`,
        })
      }
    } else if (this.data.come == 'release') {//来自发布页面
      if (this.data.choose_start) {
        app.globalData.start_place = place;
        app.globalData.start_country = country;
        wx.switchTab({
          url: `/pages/release/release`,
        })
      } else {
        app.globalData.end_place = place;
        app.globalData.end_country = country;
        wx.switchTab({
          url: `/pages/release/release`,
        })
      }
    } else if (this.data.come == 'trip_revise') {//来自修改页面
      if (this.data.choose_start) {
        app.globalData.start_place = place;
        app.globalData.start_country = country;
        wx.navigateBack({
          delta:1
        })
      } else {
        app.globalData.end_place = place;
        app.globalData.end_country = country;
        wx.navigateBack({
          delta: 1
        })
      }
    }
    // 点击时增加历史记录
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    console.log(country);
    console.log(place);
    wx.request({
      url: url+'history',
      data:{
        openid:openid,
        nation: country,
        city: place
      },
      success(res){
        console.log(res);
      }
    })
  },
  // 点击删除历史记录
  del() {
    var openid = wx.getStorageSync('openid');
    var url = app.globalData.url;
    var that = this;
    wx.showModal({
      title: '删除历史',
      content: '确定删除所有历史记录吗？',
      success(res){
        if(res.confirm){
          console.log("确认删除");
          wx.request({
            url: url + 'histdelete',
            data: {
              openid: openid,
            },
            success(res) {
              console.log(openid);
              if(res.data.err==1){
                console.log("删除成功");
                wx.request({
                  url: url + 'histhot',
                  data: {
                    openid: openid
                  },
                  success(res) {
                    console.log(res);
                    that.setData({ history: res.data.history, hot: res.data.hot })
                  }
                })
              }
            }
          })
        }else if(!res.confirm){
          console.log("取消删除")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({come:options.come})
    if (options.choose == 'start') {// 选择出发地
      this.setData({choose_start:true})
    }else{//选择目的地
      this.setData({choose_end:true})
    }
    console.log(this.data.choose_start,this.data.choose_end);

    // 获取历史使用地点和热门出发地点
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.request({
      url: url+'histhot',
      data:{
        openid:openid
      },
      success(res){
        that.setData({history:res.data.history,hot:res.data.hot})
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