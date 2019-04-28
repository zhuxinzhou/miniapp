var initdata = function (that) {
  var list = that.data.list
  for (var i = 0; i < list.length; i++) {
    list[i].shows = ""
  }
  that.setData({
    list: list
  })
}


var app = new getApp();
var X = 0;
Page({

  data: {

    card_tap: "onTap2",
    weeklyMovieList: [
      {
        id:0,
        card_name:"卡片名字",
        card_comment:"卡片内容",
        peview_time:"应在多久复习",
        current_date:"2019/4/14",
      },
    ],
    count: 0,
    score: 61
  },

  // // 点击个人资料事件
  onTap: function (event) {



    // var that = this
    // var card_tap = e.currentTarget.dataset.card_tap;
    // this.setData({
    //   card_tap: card_tap
    // });
    wx.navigateTo({
      url: "/pages/info/info"
    });

    // wx.switchTab({
    // url: "/pages/post/post"
    // });

  },
  // 点击左上角小图标事件
  tap_ch: function (e) {
   
     
      var that = this
     var card_tap = e.currentTarget.dataset.card_tap;
    this.setData({
      open: true,
      card_tap:card_tap
    });
     
  },
  tap_ch1: function (e) {
     
      var that = this
      var card_tap = e.currentTarget.dataset.card_tap;
      this.setData({
        open: false,
        card_tap: card_tap
      });
    
  },
  // 点击添加事件处理函数
  onTap1: function (event) {
    wx.navigateTo({
      url: "/pages/bianji/bianji"
    });
    
  },
  // 点击卡片处理函数
  onTap2: function (event) {
    var textId = event.currentTarget.dataset.textId;
    console.log(textId);
    wx.navigateTo({
      url: "/pages/fuxi/fuxi?textId=" + textId  
    });

  },
  // 删除事件处理函数
  deleteTap: function (event) {
    var id = event.currentTarget.dataset.id;
    console.log(id);
    wx.showToast({
      icon: "loading",
    }),
    wx.request({
      url: app.buildUrl("/card/delete"),
      header: app.getRequestHeader(),
      data: {
        id: id
      },
      method: 'POST',
      success: function (res) {
        var resp = res.data;
        if (resp.code != 200) {
          app.alert({ "content": resp.msg });
          return;
        }
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    });
    this.getcard();
  },

  
 
  //  左右滑动操作的代码
  //  bindtouchmove="tap_drag" bindtouchend="tap_end" bindtouchstart="tap_start" 
  tap_start: function (e) {
    // touchstart事件
    // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
   
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },

  tap_drag: function (e) {
    // touchmove事件
    this.data.newmark = e.touches[0].pageX,
      X = this.data.newmark - this.data.mark ;
    // 手指从左向右移动
    // if (X > 30) {
    //   this.istoright = true;
    // }

    // 手指从右向左移动
    if (X < 0) {
      this.istoright = false;
    }
    this.data.mark = this.data.newmark;
  },

  tap_end: function (e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // 通过改变 opne 的值，让主页加上滑动的样式
    if (this.istoright) {
      this.setData({
        open: true
      });
    } else {
      this.setData({
        open: false
      });
    }
  },

  onLoad: function () {
    var that = this;
    this.getcard();
    weeklyMovieList.peview_time="0";




  },
  getcard: function () {
    var that = this;
    var uid = app.getCache("token");
    var num = uid.indexOf('#');
    uid = uid.substr(num + 1);
    wx.request({
      url: app.buildUrl("/card/index"),
      header: app.getRequestHeader(),
      method: 'POST',
      data: { uid: uid },
      success: function (res) {
        var resp = res.data;
        if (resp.code != 200) {
          app.alert({ "content": resp.msg });
          return;
        }
        
        // for (var i = 0; i < resp.data.card_list.length; i++) {
        //   var str = "";
  
        
        //   var lie = resp.data.card_list[i].peview_time.split("^");
        //   var aa = new Date().getTime();//取回来的数据转换为时间戳
        //   // var cha = da.getTime() - aa;//求当前时间与预留时间的差。用当前时间减去预计时间就求出他们的差

        //   // var cha1 = Math.ceil(cha / 3600000);//用Math.ceil();方法向上取整。再除以24就取的天
        //   resp.data.card_list[i].peview_time=aa;
        // }

        
  
        that.setData({
          weeklyMovieList: resp.data.card_list
        });
      }
    });
  },

  onSearch: function(){
    app.alert({ "content": "功能暂未开发，尽情期待" })
  },
  error: function () {
    app.alert({ "content": "功能暂未开发，尽情期待" })
  },

 





})