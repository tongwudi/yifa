// pages/maintain/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inspectTableData: [{
                project: 'dfd',
                inspectors: '张三',
                time: '2022/11/11 15:56'
            },
            {
                project: 'dfd',
                inspectors: '李四',
                time: '2022/11/11 15:57'
            },
            {
                project: 'dfd',
                inspectors: '王五',
                time: '2022/11/11 15:58'
            },
            {
                project: 'dfd',
                inspectors: '赵六',
                time: '2022/11/11 15:59'
            },
            {
                project: 'dfd',
                inspectors: '燕七',
                time: '2022/11/11 16:00'
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
        wx.request({
            url: 'http://221.131.179.226:8085/YFWechat/OpenApi/getOrderDetail',
            method: 'POST',
            data: {
                trackNo: options.trackNo
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
        let name = e.target.dataset.name
        let index = e.target.dataset.index
        let value = e.detail.value

        this.setData({
            [`inspectTableData[${index}].${name}`]: value
        })
    },

    showDetail(event) {
        const key = event.currentTarget.dataset.key
        if (!key) return

        this.setData({
            ['object.' + key]: true
        })
    },

    goBack() {
        console.log(this.data.inspectTableData);
        // wx.navigateBack({
        //     url: '../other/index'
        // })
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