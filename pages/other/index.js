// pages/other/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        object: {},
        trackNo: '',
        localImgUrl: '',
        /**
         * 所有 width 相加等于 750 相当于宽度 100%
         * 需要减去 table-box 的 20rpx 边距宽度
         */
        tableHeader: [{
                prop: 'FSerialNo',
                width: 250,
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
                width: 180,
                label: '板(芯)炉号',
                color: '#000000'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const trackNo = options.trackNo

        this.setData({
            trackNo: trackNo
        })
        wx.request({
            url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/getOrderDetail',
            method: 'POST',
            data: {
                trackNo
            },
            success: res => {
                this.setData({
                    info: res.data.data
                })
            }
        })
    },
    showDetail(event) {
        const key = event.currentTarget.dataset.key
        if (!key) return

        this.setData({
            ['object.' + key]: true
        })
    },
    showCompleteDetail(event) {
        const key = event.currentTarget.dataset.key
        wx.showToast({
            icon: 'none',
            title: key,
            duration: 2000 // 持续的时间
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

    goBack() {
        wx.navigateBack({
            url: '../index/index'
        })
    },

    goPage() {
        if (!this.data.trackNo) {
            wx.showToast({
                icon: 'none',
                title: '请输入跟踪号或序列号！',
                duration: 2000 // 持续的时间
            })
            return
        }
        wx.navigateTo({
            url: '../maintain/index?trackNo=' + this.data.trackNo
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
        if (localImgUrl) {
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