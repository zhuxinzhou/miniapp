var app = new getApp();
Page({
  data: {
    files: [],
    imageurl:"",
    inputname:"",
    inputcontent:""
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.imagepath = res.tempFilePaths;
        upload(that, app.imagepath);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  onTap: function (e) {
    var that = this;
    // upload(that, app.imagepath);
    this.postcard(e);
    wx.navigateTo({
      url: "/pages/post/post"
    });
  },

  postcard: function (e) {
    var that = this;
    var member_id = app.getCache("token");
    var num = member_id.indexOf('#');
    member_id = member_id.substr(num + 1);
    var formid = e.detail.formId;

    var str = that.data.inputcontent.split('\n').join('<br/>')
     
    wx.request({
      url: app.buildUrl("/card/inset"),
      header: app.getRequestHeader(),
      method: 'POST',
      data: {
        uid: member_id,
        name: this.data.inputname,
        content: str,
        fromid: formid,
        image:this.data.imageurl
      },
      success: function (res) {
        var resp = res.data;
        if (resp.code != 200) {
          app.alert({ "content": resp.msg });
          return;
        }
        that.setData({
          // image:resp.data.state
        });
      }
    });

  },
  getinputname : function(e){
    this.setData({
      inputname: e.detail.value
    }) 
  },
  getinputcontent : function(e){
    this.data.inputcontent = e.detail.value;
  },

});


function upload(page, path) {
  var uid = app.getCache("token");
  var num = uid.indexOf('#');
  uid = uid.substr(num + 1);
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: app.buildUrl("/upload?id=" + uid),
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        var resp = JSON.parse(res.data);
        page.setData({  //上传成功修改显示头像
          imageurl: resp.url
        })
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}

