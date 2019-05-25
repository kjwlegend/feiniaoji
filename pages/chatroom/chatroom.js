var strophe = require('../../sdk/libs/strophe.js')
var WebIM = require('../../utils/WebIM.js')["default"];
let RECORD_CONST = require("record_status");
let RecordStatus = RECORD_CONST.RecordStatus;
let RecordDesc = RECORD_CONST.RecordDesc;
let RunAnimation = false;
var app = getApp();


Page({
  data: {
    chatMsg: [],
    emojiStr: '',
    yourname: '',
    myName: '',
    sendInfo: '',
    userMessage: '',
    inputMessage: '',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    show: 'emoji_list',
    view: 'scroll_view',
    toView: '',
    emoji: WebIM.Emoji,
    emojiObj: WebIM.EmojiObj,
    msgView: {},
    RecordStatus: RecordStatus,
    RecordDesc: RecordDesc,
    recordStatus: RecordStatus.HIDE,
    changedTouches: null,
    recordClicked: false,
		recorderManager: wx.getRecorderManager(),
    audiossrc:''
  },
  onLoad: function (options) {
    this.setData({
      tours: options.urls,
      myurl: app.globalData.userInfo.avatarUrl
    })
    var that = this
    var myName = wx.getStorageSync('myUsername')
    var options = JSON.parse(options.username)
    if (wx.getStorageSync(options.your + myName)){

      var num = wx.getStorageSync(options.your + myName).length - 1
      if (num > 0) {
        setTimeout(function () {
          that.setData({
            toView: wx.getStorageSync(options.your + myName)[num].mid
          })
        }, 10)
      }
    }
    this.setData({
      yourname: options.your,
      myName: myName,
      inputMessage: '',
      chatMsg: wx.getStorageSync(options.your + myName) || []
    })
    console.log(this.data.chatMsg)
    wx.setNavigationBarTitle({
      title: that.data.yourname
    })
  },
  onShow: function () {
    var that = this
    this.setData({
      inputMessage: ''
    })
  },
  bindMessage: function (e) {
    this.setData({
      userMessage: e.detail.value
    })
  },
  cleanInput: function () {
    var that = this
    var setUserMessage = {
      sendInfo: that.data.userMessage
    }
    that.setData(setUserMessage)
  },
  //***************** 录音 begin ***************************
  // changedTouches: null,
  toggleRecordModal: function (e) {
    this.setData({
      recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
    })
  },
  // toggleWithoutAction: function (e) {
  //   console.log('toggleWithoutModal 拦截请求不做处理')
  // },
  handleRecordingMove: function (e) {
    var touches = e.touches[0]
    var changedTouches = this.data.changedTouches

    if (!changedTouches) {
      return
    }

    if (this.data.recordStatus == RecordStatus.SWIPE) {
      if (changedTouches.pageY - touches.pageY < 20) {
        this.setData({
          recordStatus: RecordStatus.HOLD
        })
      }
    }
    if (this.data.recordStatus == RecordStatus.HOLD) {
      if (changedTouches.pageY - touches.pageY > 20) {
        this.setData({
          recordStatus: RecordStatus.SWIPE
        })
      }
    }

  },
  handleRecording: function (e) {
    var me = this
    this.setData({
      recordClicked: true
    })
    setTimeout(() => {
      console.log(me.data.recordClicked)
      if (me.data.recordClicked == true) {
        executeRecord()
      }
    }, 350)
    function executeRecord() {
        wx.getSetting({
          success: (res) => {
            let recordAuth = res.authSetting['scope.record']
            if (recordAuth == false) { //已申请过授权，但是用户拒绝
              wx.openSetting({
                success: function (res) {
                  let recordAuth = res.authSetting['scope.record']
                  if (recordAuth == true) {
                    wx.showToast({
                      title: "授权成功",
                      icon: "success"
                    })
                  } else {
                    wx.showToast({
                      title: "请授权录音",
                      icon: "none"
                    })
                  }
                  me.setData({
                    isLongPress: false
                  })
                }
              })
            } else if (recordAuth == true) { // 用户已经同意授权
              startRecord()
            } else { // 第一次进来，未发起授权
              wx.authorize({
                scope: 'scope.record',
                success: () => {//授权成功
                  wx.showToast({
                    title: "授权成功",
                    icon: "success"
                  })
                }
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: "鉴权失败，请重试",
              icon: "none"
            })
          }
        })
      }

			function startRecord() {
        me.data.changedTouches = e.touches[0];
        me.setData({
          recordStatus: RecordStatus.HOLD
        });
        RunAnimation = true;

        let recorderManager = wx.getRecorderManager()
        recorderManager.onStart(() => {
          console.log("开始录音...");
        });
        recorderManager.start({
          format: "mp3"
        });
        // 超时
        setTimeout(function () {
          me.handleRecordingCancel();
          RunAnimation = false
        }, 100000);
      }

  },
  handleRecordingCancel: function () {
    RunAnimation = false
    let recorderManager = wx.getRecorderManager()
    // 向上滑动状态停止：取消录音发放
    if (this.data.recordStatus == RecordStatus.SWIPE) {
      console.log('swip')
      this.setData({
        recordStatus: RecordStatus.RELEASE
      });
      console.log(this.data.recordStatus)
    }else {
      console.log('hide')
      this.setData({
        recordStatus: RecordStatus.HIDE,
        recordClicked: false
      });

      console.log(this.data.recordStatus)
    }

    recorderManager.onStop((res) => {

      console.log(this.data.recordStatus)
      // console.log("结束录音...", res);
      if (this.data.recordStatus == RecordStatus.RELEASE) {
        console.log("user canceled");
        this.setData({
          recordStatus: RecordStatus.HIDE
        });
        return;
      }
      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none"
        })
      } else {
        // 上传
        this.uploadRecord(res.tempFilePath, res.duration);
      }
    });
    // 停止录音
    recorderManager.stop();
  },
  playRecord: function (e) {
    let { url, mid } = e.target.dataset
    this.data.msgView[mid] = this.data.msgView[mid] || {}

    // reset all plays
    for (let v in this.data.msgView) {
      this.data.msgView[v] = this.data.msgView && (this.data.msgView[v] || {})
      this.data.msgView[v].isPlay = false
    }

    // is play then stop
    if (this.data.msgView[mid].isPlay) {
      this.stopRecord(e)
      return;
    }

    console.log(url, mid)
    this.data.msgView[mid].isPlay = true;
    this.setData({
      msgView: this.data.msgView
    })

    wx.downloadFile({
      url: url,
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function () {
            this.stopRecord(e)
          }.bind(this)
        })
      }.bind(this),
      fail: function (err) {
      },
      complete: function complete() {
      }
    })
  },
  uploadRecord: function (tempFilePath,dur) {
    var str = WebIM.config.appkey.split('#')
    var that = this
    wx.uploadFile({
      url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: function (res) {
        console.log(res)

        // 发送xmpp消息
        var msg = new WebIM.message('audio', WebIM.conn.getUniqueId())
        var dataObj = JSON.parse(res.data)
        msg.set({
          apiUrl: WebIM.config.apiURL,
          body: {
            type: 'audio',
            url: dataObj.uri + "/" + dataObj.entities[0].uuid,
            filetype: "",
            filename: tempFilePath,
            length: Math.ceil(dur / 1000)
          },
          from: wx.getStorageSync('myUsername'),
          to: that.data.yourname, 
          roomType: false,
          chatType: 'singleChat'
        });

        WebIM.conn.send(msg.body)

        // 本地消息展示
        var time = WebIM.time()
        var msgData = {
          info: {
            to: msg.body.to
          },
          username: that.data.myName,
          yourname: msg.body.to,
          msg: {
            type: msg.type,
            data: msg.body.body.url,
            url: msg.body.body.url,
          },
          style: 'self',
          time: time,
          mid: msg.id
        }
        that.data.chatMsg.push(msgData)
        console.log(that.data.chatMsg)
        // 存储到本地消息
        var myName = wx.getStorageSync('myUsername')
        wx.setStorage({
          key: that.data.yourname + myName,
          data: that.data.chatMsg,
          success: function () {
            //console.log('success', that.data)
            that.setData({
              chatMsg: that.data.chatMsg
            })
            setTimeout(function () {

              that.setData({
                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
              })
            }, 10)
          }
        })
      }
    })
  },
  //***************** 录音 end ***************************
  sendMessage: function () {

    if (!this.data.userMessage.trim()) return;


    var that = this
    // //console.log(that.data.userMessage)
    // //console.log(that.data.sendInfo)
    var myName = wx.getStorageSync('myUsername')
    var id = WebIM.conn.getUniqueId();
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: that.data.sendInfo,
      from: myName,
      to: that.data.yourname,
      roomType: false,
      success: function (id, serverMsgId) {
        // console.log('send text message success')
      }
    });
    
    msg.body.chatType = 'singleChat';
    WebIM.conn.send(msg.body);
    if (msg) {
      var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
      var time = WebIM.time()
      var msgData = {
        info: {
          to: msg.body.to
        },
        username: that.data.myName,
        yourname: msg.body.to,
        msg: {
          type: msg.type,
          data: value
        },
        style: 'self',
        time: time,
        mid: msg.id
      }
      that.data.chatMsg.push(msgData)
      
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
            emojiList: [],
            inputMessage: ''
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
      that.setData({
        userMessage: ''
      })
    }
  },

  receiveMsg: function (msg, type) {

    var hongdian = app.globalData.xiaoxi
    for (var i = 0; i < hongdian.length; i++) {
      if (hongdian[i] == this.data.yourname) {
        hongdian.splice(i, 1);
      }
    }
    app.globalData.xiaoxi = hongdian

    var that = this
    var myName = wx.getStorageSync('myUsername')
    if (msg.from == that.data.yourname || msg.to == that.data.yourname) {
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
      } else if (type == 'emoji') {
        var value = msg.data
      } else if (type == 'audio') {
        // 如果是音频则请求服务器转码
        var token = msg.accessToken;
        var options = {
          url: msg.url,
          header: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'audio/mp3',
            'Authorization': 'Bearer ' + token
          },
          success: function (res) {
            msg.url = res.tempFilePath
            var msgData = {
              info: {
                from: msg.from,
                to: msg.to
              },
              username: '',
              yourname: msg.from,
              msg: {
                type: type,
                data: value,
                url: msg.url
              },
              style: '',
              time: time,
              mid: msg.type + msg.id
            }
            if (msg.from == that.data.yourname) {
              msgData.style = ''
              msgData.username = msg.from
            } else {
              msgData.style = 'self'
              msgData.username = msg.to
            }
            var msgArr = that.data.chatMsg;
            msgArr.pop();
            msgArr.push(msgData);

            that.setData({
              chatMsg: msgArr
            })
            console.log("New audio");
          },
          fail: function (e) {
            console.log('downloadFile failed', e);
          }
        };
        console.log('Download');
        wx.downloadFile(options);
      }
      //console.log(msg)
      //console.log(value)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: msg.from,
        yourname: msg.from,
        msg: {
          type: type,
          data: value,
          url: msg.url
        },
        style: '',
        time: time,
        mid: msg.type + msg.id
      }
      if (msg.from == that.data.yourname) {
        msgData.style = ''
        msgData.username = msg.from
      } else {
        msgData.style = 'self'
        msgData.username = msg.to
      }
      that.data.chatMsg.push(msgData)

      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          if (type == 'audio') return;
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },
  openEmoji: function () {
    this.setData({
      show: 'showEmoji',
      view: 'scroll_view_change'
    })
  },
  sendEmoji: function (event) {
    var that = this
    var emoji = event.target.dataset.emoji
    var msglen = that.data.userMessage.length - 1
    if (emoji && emoji != '[del]') {
      var str = that.data.userMessage + emoji
    } else if (emoji == '[del]') {
      var start = that.data.userMessage.lastIndexOf('[')
      var end = that.data.userMessage.lastIndexOf(']')
      var len = end - start
      if (end != -1 && end == msglen && len >= 3 && len <= 4) {
        var str = that.data.userMessage.slice(0, start)
      } else {
        var str = that.data.userMessage.slice(0, msglen)
      }
    }
    this.setData({
      userMessage: str,
      inputMessage: str
    })
  },
  sendImage: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        if (pages[1]) {
          pages[1].upLoadImage(res, that)
        }
      }
    })
  },

  sendLocation: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseLocation({
      success: function (respData) {
        var id = WebIM.conn.getUniqueId();
        var msg = new WebIM.message('location', id);
        msg.set({
          msg: that.data.sendInfo,
          to: that.data.yourname,
          roomType: false,
          lng: respData.longitude,
          lat: respData.latitude,
          addr: respData.address,
          success: function (id, serverMsgId) {
            //console.log('success')
          }
        });
        // //console.log(msg)
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
      }
    })
  },

  testInterfaces: function () {
    var option = {
      roomId: '21873157013506',
      success: function (respData) {
        wx.showToast({
          title: "JoinChatRoomSuccess",
        });
        console.log('Response data: ', respData);
      }
    };

    WebIM.conn.joinChatRoom(option);
  },
  quitChatRoom: function () {
    console.log('ScareCrow');
    var option = {
      roomId: '21873157013506',
      success: function () {
        console.log("quitChatRoom");
      }
    }
    WebIM.conn.quitChatRoom(option);
  },

  receiveImage: function (msg, type) {
    var that = this
    var myName = wx.getStorageSync('myUsername')
    //console.log(msg)
    if (msg) {
      //console.log(msg)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: msg.from,
        yourname: msg.from,
        msg: {
          type: 'img',
          data: msg.url
        },
        style: '',
        time: time,
        mid: 'img' + msg.id
      }
      //console.log(msgData)
      that.data.chatMsg.push(msgData)
      //console.log(that.data.chatMsg)
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },

  receiveVideo: function (msg, type) {
    var that = this
    var myName = wx.getStorageSync('myUsername')
    //console.log(msg)
    if (msg) {
      //console.log(msg)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: msg.from,
        yourname: msg.from,
        msg: {
          type: 'video',
          data: msg.url
        },
        style: '',
        time: time,
        mid: 'video' + msg.id
      }
      //console.log(msgData)
      that.data.chatMsg.push(msgData)
      //console.log(that.data.chatMsg)
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },

  openCamera: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        if (pages[1]) {
          pages[1].upLoadImage(res, that)
        }
      }
    })
  },
  focus: function () {
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  cancelEmoji: function () {
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  upLoadImage: function (res, that) {
    //console.log(res)
    var tempFilePaths = res.tempFilePaths
    //console.log(tempFilePaths)
    wx.getImageInfo({
      src: res.tempFilePaths[0],
      success: function (res) {
        // console.log(res)
        var allowType = {
          'jpg': true,
          'gif': true,
          'png': true,
          'bmp': true
        };
        var str = WebIM.config.appkey.split('#')
        var width = res.width
        var height = res.height
        var index = res.path.lastIndexOf('.')
        if (index != -1) {
          var filetype = res.path.slice(index + 1)
        }
        if (filetype.toLowerCase() in allowType) {
          wx.uploadFile({
            url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            success: function (res) {
              var data = res.data
              var dataObj = JSON.parse(data)
              // console.log(dataObj)
              var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
              var msg = new WebIM.message('img', id);
              var file = {
                type: 'img',
                size: {
                  width: width,
                  height: height
                },
                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                'filetype': filetype,
                'filename': tempFilePaths[0]
              }
              //console.log(file)
              var option = {
                apiUrl: WebIM.config.apiURL,
                body: file,
                to: that.data.yourname,                  // 接收消息对象
                roomType: false,
                chatType: 'singleChat'
              }
              msg.set(option)
              WebIM.conn.send(msg.body)
              if (msg) {
                //console.log(msg,msg.body.body.url)
                var time = WebIM.time()
                var msgData = {
                  info: {
                    to: msg.body.to
                  },
                  username: that.data.myName,
                  yourname: msg.body.to,
                  msg: {
                    type: msg.type,
                    data: msg.body.body.url,
                    size: {
                      width: msg.body.body.size.width,
                      height: msg.body.body.size.height,
                    }
                  },
                  style: 'self',
                  time: time,
                  mid: msg.id
                }
                that.data.chatMsg.push(msgData)
                //console.log(that.data.chatMsg)
                var myName = wx.getStorageSync('myUsername')
                wx.setStorage({
                  key: that.data.yourname + myName,
                  data: that.data.chatMsg,
                  success: function () {
                    //console.log('success', that.data)
                    that.setData({
                      chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                      that.setData({
                        toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                      })
                    }, 10)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  previewImage: function (event) {
    var url = event.target.dataset.url
    wx.previewImage({
      urls: [url]  // 需要预览的图片http链接列表
    })
  },
  audios: function (e) {
    console.log(e.currentTarget.dataset.src.msg.url)
    var that=this

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = e.currentTarget.dataset.src.msg.url
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({ audiossrc: e.currentTarget.dataset.src.msg.url })
    })
    innerAudioContext.onEnded(() => {
      console.log('开始播放')
      that.setData({ audiossrc: '' })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }



})

















