const { formatTime } = require("../../utils/util");

// pages/other/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        object: {},
        localImgUrl:'',
        header: [
            {
                prop: 'FSerialNo',
                width: 300,
                label: '产品序列号',
                color: '#000000'
              },
              {
                prop: 'FBodyLot',
                width: 150,
                label: '体炉号',
                color: '#000000'
              },
              {
                prop: 'FCapLot',
                width: 150,
                label: '盖炉号',
                color: '#000000'
              },
              {
                prop: 'FLeafLot',
                width: 150,
                label: '板(芯)炉号',
                color: '#000000'
              }
        ]
    },
    showDetail(event) {
        const key = event.currentTarget.dataset.key
        if (!key) return
        console.log(key);
        console.log(formatTime(new Date()));
        this.setData({
            ['object.' + key]: true
        })
    },
    showCompleteDetail(event) {
        const key = event.currentTarget.dataset.key
        wx.showToast({
            title: key,
            icon: 'none',
            duration: 2000//持续的时间
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
    }
    ,
    goBack() {
        wx.navigateBack({
            url: '../index/index'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.request({
            url: 'http://221.131.179.226:8085/YFWechat/OpenApi/getOrderDetail',
            method: 'POST',
            data: {
                trackNo: options.trackNo
            },
            success: res => {
                console.log(res);
                this.setData({
                    info: res.data.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 在这里删除临时文件
        var localImgUrl = this.data.localImgUrl;
        if(localImgUrl) {
            var fs = wx.getFileSystemManager();
            const res = fs.unlinkSync(localImgUrl);
            this.setData({
                localImgUrl: ''
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})