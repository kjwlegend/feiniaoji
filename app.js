//app.js
const ald = require('./utils/ald-stat.js')
require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];


App({
  getRoomPage: function () {
    return this.getPage("pages/chatroom/chatroom")
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },

  
  onLaunch: function () {

    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs),

      wx.loadFontFace({
        family: 'PingFang Medium',
      source: 'url("https://feiniaojicn.com/public/uploads/font/PingFangMedium.ttf")',
        success:function(res){
          console.log(res)
        }
      }),

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo();
        } else {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } 
      }
    })
    WebIM.conn.listen({
      onOpened: function(message) {
        WebIM.conn.setPresence() 
        WebIM.conn.getRoster()
      },
      onPresence: function(message) {
        console.log('onPresence', message)
        if (message.type === 'subscribe') {

          /*同意添加好友操作的实现方法*/
          WebIM.conn.subscribed({
            to: message.from,
            message: 'rejectAddFriend'
          });
        }
        // switch (message.type) {
        //   case "unsubscribe":
        //     // pages[0].moveFriend(message);
        //     pages[0].handleFriendMsg(message);
        //     break;
        //   case "subscribe":
        //     if (message.status === '[resp:true]') {
        //       return
        //     } else {
        //       pages[0].handleFriendMsg(message)
        //     }
        //     break;
        //   case "joinChatRoomSuccess":
        //     // console.log('Message: ', message);
        //     wx.showToast({
        //       title: "JoinChatRoomSuccess",
        //     });
        //     break;
        //   case "memberJoinChatRoomSuccess":
        //     // console.log('memberMessage: ', message);
        //     wx.showToast({
        //       title: "memberJoinChatRoomSuccess",
        //     });
        //     break;
        //   case "memberLeaveChatRoomSuccess":
        //     // console.log("LeaveChatRoom");
        //     wx.showToast({
        //       title: "leaveChatRoomSuccess",
        //     });
        //     break;
        // }
      },
      onRoster: function(message) {
        // console.log(message)
        var pages = getCurrentPages()
        if (pages[0]) {
          pages[0].onShow()
        }
      },

      onVideoMessage: function(message) {
        // console.log('onVideoMessage: ', message);
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveVideo(message, 'video')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'video',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'video' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
                //console.log('success')
              }
            })
          }
        }
      },

      onAudioMessage: function(message) {

        if (that.globalData.xiaoxi.length > 0) {
          for (var i = 0; i < that.globalData.xiaoxi.length; i++) {
            if (that.globalData.xiaoxi[i] != message.from) {
              that.globalData.xiaoxi.push(message.from)
            }
          }
        } else {
          that.globalData.xiaoxi.push(message.from)
        }
        wx.showTabBarRedDot({
          index: 3
        })
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            page.receiveMsg(message, 'audio')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'audio',
                url: message.url
              },
              style: '',
              time: time,
              mid: 'audio' + message.id
            }
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
              }
            })
          }
        }
      },
      onTextMessage: function(message) {
        console.log(message)
        var page = that.getRoomPage()
        if (that.globalData.xiaoxi.length > 0) {
          for (var i = 0; i < that.globalData.xiaoxi.length; i++) {
            if (that.globalData.xiaoxi[i] != message.from) {
              that.globalData.xiaoxi.push(message.from)
            }
          }
        }else{
          that.globalData.xiaoxi.push(message.from)
        }
        wx.showTabBarRedDot({
          index: 3
        })
        if (message) {
          if (page) {
            page.receiveMsg(message, 'txt')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            console.log(chatMsg)
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'txt',
                data: value
              },
              style: '',
              time: time,
              mid: 'txt' + message.id
            }
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            console.log(chatMsg)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
              }
            })
          }
        } 
      },
      onEmojiMessage: function (message) {
        if (that.globalData.xiaoxi.length > 0) {
          for (var i = 0; i < that.globalData.xiaoxi.length; i++) {
            if (that.globalData.xiaoxi[i] != message.from) {
              that.globalData.xiaoxi.push(message.from)
            }
          }
        } else {
          that.globalData.xiaoxi.push(message.from)
        }
        wx.showTabBarRedDot({
          index: 3
        })
        var page = that.getRoomPage()
        //console.log(pages)
        if (message) {
          if (page) {
            page.receiveMsg(message, 'emoji')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'emoji',
                data: message.data
              },
              style: '',
              time: time,
              mid: 'emoji' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            //console.log(chatMsg)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
                //console.log('success')
              }
            })
          }
        }
      },
      onPictureMessage: function (message) {
        if (that.globalData.xiaoxi.length > 0) {
          for (var i = 0; i < that.globalData.xiaoxi.length; i++) {
            if (that.globalData.xiaoxi[i] != message.from) {
              that.globalData.xiaoxi.push(message.from)
            }
          }
        } else {
          that.globalData.xiaoxi.push(message.from)
        }
        wx.showTabBarRedDot({
          index: 3
        })
        var page = that.getRoomPage()
        if (message) {
          if (page) {
            //console.log("wdawdawdawdqwd")
            page.receiveImage(message, 'img')
          } else {
            var chatMsg = that.globalData.chatMsg || []
            var time = WebIM.time()
            var msgData = {
              info: {
                from: message.from,
                to: message.to
              },
              username: message.from,
              yourname: message.from,
              msg: {
                type: 'img',
                data: message.url
              },
              style: '',
              time: time,
              mid: 'img' + message.id
            }
            msgData.style = ''
            chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
            chatMsg.push(msgData)
            wx.setStorage({
              key: msgData.yourname + message.to,
              data: chatMsg,
              success: function() {
                //console.log('success')
              }
            })
          }
        }
      },
      // 各种异常
      onError: function(error) {
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }

          wx.showToast({
            title: 'server-side close the websocket connection',
            duration: 1000
          });
          wx.switchTab({
            url: '../homepage/homepage'
          });
          return;
        }

        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: 'offline by multi login',
            duration: 1000
          })
          wx.switchTab({
            url: '../homepage/homepage'
          });
          return;
        }
      },
    })
  },
  getUserInfo() {
    var that = this;
    wx.getUserInfo({

      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code;
            var url = that.globalData.url;
            var userInfo = that.globalData.userInfo;
            wx.request({
              url: url + 'index',
              data: {
                code: code,
                nickname: userInfo.nickName,
                headerimg: userInfo.avatarUrl
              },
              success: function(res) {
                wx.setStorageSync('openid', res.data.openid);
                var url = that.globalData.url;
                var openid = res.data.openid;
                // console.log(openid);
                wx.request({
                  url: url + 'user',
                  data: {
                    openid: openid
                  },
                  success: function(res) {
                    if (res.data.user.state == 0) { //未认证，跳转添加页面
                      wx.redirectTo({
                        url: '/pages/regist/regist',
                      })
                    } else {
                      wx.setStorageSync('user', res.data.user);
                    }
                  }
                })
              }
            })
          }
        })

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    // url: 'https://shop.sapukeji.cn/public/index.php/index/home/',
    url:'https://feiniaojicn.com/public/index.php/index/home/',
    // imgurl: 'https://shop.sapukeji.cn/public/',
    imgurl: 'https://feiniaojicn.com/public/',
    start_place: "选择出发地",
    end_place: "选择目的地",
    start_country: '',
    end_country: '',
    openid: 1,
    user: {},
    chatMsg: [],
    close:false,
    xiaoxi:[]
  }

  // 环信app函数

})