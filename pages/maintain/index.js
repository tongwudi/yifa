// pages/maintain/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        trackNo: '',
        uploadOpts: ['上传语音', '上传图片'],
        imageSrc: '',
        inspectTableData: [{
                project: 'dfd',
                inspectors: '张三',
                fileUrl: ''
            },
            {
                project: 'dfd',
                inspectors: '李四',
                fileUrl: ''
            },
            {
                project: 'dfd',
                inspectors: '王五',
                fileUrl: ''
            },
            {
                project: 'dfd',
                inspectors: '赵六',
                fileUrl: ''
            },
            {
                project: 'dfd',
                inspectors: '燕七',
                fileUrl: ''
            }
        ],
        /**
         * 所有 width 相加等于 750 相当于宽度 100%
         * 需要减去 table-box 的 20rpx 边距宽度
         */
        tableHeader: [{
                prop: 'FSerialNo',
                width: 450,
                label: '维修项目',
                color: '#000000'
            },
            {
                prop: 'FBodyLot',
                width: 280,
                label: '日期',
                color: '#000000'
            }
        ],
        info: {
            SerialNos: [{
                    FSerialNo: 'fdfd',
                    FBodyLot: '2022/11/11 10:58'
                },
                {
                    FSerialNo: 'fdfd',
                    FBodyLot: '2022/11/11 13:58'
                }
            ]
        },
        object: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const trackNo = options.trackNo
        this.setData({
            trackNo
        })
        wx.request({
            url: 'http://221.131.179.226:8085/YFWechat/OpenApi/getInspectionItem',
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

    bindKeyInput(e) {
        console.log(e);
        const name = e.target.dataset.name
        const index = e.target.dataset.index
        const value = e.detail.value

        this.setData({
            [`inspectTableData[${index}].${name}`]: value
        })
    },

    bindPickerChange(e) {
        const value = e.detail.value
        const index = e.target.dataset.index
        console.log(index);
        // wx.chooseMedia({
        //     count: 1,
        //     mediaType: ['image'],
        //     success: res => {
        //         this.setData({
        //             [`inspectTableData[${index}].fileUrl`]: res.tempFiles[0].tempFilePath
        //         })
        //         console.log(this.data.inspectTableData);
        //         console.log(res);
        //     }
        // })
    },

    showDetail(event) {
        const key = event.currentTarget.dataset.key
        if (!key) return

        this.setData({
            ['object.' + key]: true
        })
    },

    goBack() {
        wx.navigateBack({
            url: '../other/index'
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