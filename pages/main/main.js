var strophe = require('../../sdk/libs/strophe.js')
var WebIM = require('../../utils/WebIM.js').default
var app = getApp();

Page({
  data: {
    search_btn: true,
    search_friend: false,
    show_mask: false,
    myName: '',
    member: [],
    friends:null,
    isIphoneX:false
  },
  // 点击删除按钮
  shanchu(e){
    var url = app.globalData.url;
    var openid = wx.getStorageSync('openid');
    var friendopenid = e.currentTarget.dataset.openid;
    var that = this;
    wx.showModal({
      title: '删除',
      content: '确定要删除好友吗？',
      success(res){
        if(res.confirm){
          // 确定删除
          wx.request({
            url: url +'deletefriends',
            data:{
              openid:openid,
              friendopenid: friendopenid
            },
            success(res){
              if(res.data.err==1){
                // console.log("删除成功");
                wx.request({
                  url: url + 'friends',
                  data: {
                    openid: openid
                  },
                  success(res) {
                    // console.log(res);
                    if(res.data.err==1){
                      that.setData({ friends: res.data.user });
                    }else{
                      that.setData({ friends: [] });
                    }
                  }
                })
              }
            }
          })
        }else if(!res.confirm){

        }
      }
    })
  },
  onLoad: function (option) {
    var that=this
    wx.getSystemInfo({
      success: res => {
        if (res.model.search('iPhone') != -1) {
          that.setData({ isIphoneX: true })
        }
      }
    })
  },
  onShow: function () {
    var myName = wx.getStorageSync('myUsername');
    var hongdian = app.globalData.xiaoxi
    this.setData({
      myName: myName
    })
    // console.log(hongdian)
    // 获取消息列表
    var openid = wx.getStorageSync('openid');
    var url = app.globalData.url;
    var that = this;
    wx.request({
      url: url +'friends',
      data:{
        openid:openid
      },
      success(res){
        console.log(res);
        if (res.data.err == 1) {
          for(var i=0;i<hongdian.length;i++){
            for(var s=0;s<res.data.user.length;s++){
              if (hongdian[i] == res.data.user[s].uwxaccount){
                res.data.user[s].hongse=true
              } else {
                res.data.user[s].hongse = false
              }
            }
          }
          that.setData({ friends: res.data.user });
        } else {
          that.setData({ friends: [] });
        }
      }
      
    })
    var rosters = {
      success: function (roster) {
        console.log(roster)
        var member = []
        for (var i = 0; i < roster.length; i++) {
          if (roster[i].subscription == "both") {
            member.push(roster[i])
          }
        }
        that.setData({
          member: member
        })
        wx.setStorage({
          key: 'member',
          data: that.data.member
        })
      }
    }

    WebIM.conn.getRoster(rosters)



    if (hongdian.length == 0) {
      wx.hideTabBarRedDot({
        index: 3
      })
    }
  },

  into_room: function (event) {
    var that = this
    // console.log(event)
    var nameList = {
      myName: that.data.myName,
      your: event.currentTarget.dataset.username
    }
    
    wx.navigateTo({
      url: '../chatroom/chatroom?username=' + JSON.stringify(nameList) + '&urls=' + event.currentTarget.dataset.urls
    })

    var hongdian = app.globalData.xiaoxi

    for (var i = 0; i < hongdian.length; i++) {
      if (hongdian[i] == event.currentTarget.dataset.username) {
        hongdian.splice(i, 1);
      }
    }
    app.globalData.xiaoxi = hongdian
  },

})