// index.js
// // 获取应用实例
// const app = getApp()

Page({
    data: {
        trackNo: '',
        info: {},
        localImgUrl:''
    },
    trackNoInput(e) {
        this.setData({
            trackNo: e.detail.value
        })
    },
    search() {
        wx.request({
            url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/getOrderDetail',
            method: 'POST',
            data: {
                trackNo: this.data.trackNo
            },
            success: res => {
                if(res.data.success){
                    this.setData({
                        info: res.data.data
                    })
                }else{
                    wx.showToast({
                        icon: 'none',
                        title: res.data.context,
                        duration: 2000 // 持续的时间
                    })
                    this.setData({
                        info: {}
                    })
                }
            }
        })
    },
    //预览图片
    onPreviewImage(image) {
        var base64 = "data:image/PNG;base64," + image.currentTarget.dataset.key;
        var imgPath = wx.env.USER_DATA_PATH + '/e-invoice' + Date.parse(new Date()) + '.jpeg';
        var imageData = base64.replace(/^data:image\/\w+;base64,/, "");
        var fs = wx.getFileSystemManager();
        fs.writeFileSync(imgPath, imageData, "base64");
        fs.close();
        this.setData({
            localImgUrl: imgPath
        })
        wx.previewImage({
            urls: [imgPath] // 需要预览的图片http链接列表
        })
    },
    goPage() {
        if (!Object.keys(this.data.info).length) {
            wx.showToast({
                icon: 'none',
                title: '请输入跟踪号或序列号！',
                duration: 2000 // 持续的时间
            })
            return
        }
        wx.navigateTo({
            url: '../other/index?trackNo=' + this.data.trackNo
        })
    },
    onLoad() {

    } , 
    /**
    * 生命周期函数--监听页面显示
    */
   onShow() {
       // 在这里删除临时文件
       var localImgUrl = this.data.localImgUrl;
       if(localImgUrl) {
            var fs = wx.getFileSystemManager();
            fs.unlinkSync(localImgUrl);
            this.setData({
                localImgUrl: ''
            })
       }
   },
})