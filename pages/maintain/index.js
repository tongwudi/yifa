// pages/maintain/index.js

Page({
    data: {
        trackNo: '',
        guideUrl: '',
        imageUrl: '',
        // uploadOpts: ['上传语音', '上传图片'],
        inspectTableData: [{
                project: '',
                inspectors: '',
                fileUrl: ''
            },
            {
                project: '',
                inspectors: '',
                fileUrl: ''
            },
            {
                project: '',
                inspectors: '',
                fileUrl: ''
            },
            {
                project: '',
                inspectors: '',
                fileUrl: ''
            },
            {
                project: '',
                inspectors: '',
                fileUrl: ''
            }
        ],
        maintainTableData: [],
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
            url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/getInspectionItem',
            method: 'POST',
            data: {
                trackNo
            },
            success: res => {
                if (res.data.success) {
                    const guideUrl = res.data.data?.FIAMGImage || ''
                    const imageUrl = res.data.data?.FImage || ''

                    this.setData({
                        guideUrl,
                        imageUrl
                    })
                }
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
    // 文件预览
    openFile() {
        wx.downloadFile({
            url: this.data.guideUrl,
            success: res => {
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath
                })
            }
        })
    },
    // 图片预览
    onPreviewImage() {
        const imageUrl = this.data.imageUrl

        wx.previewImage({
            urls: [imageUrl] // 需要预览的图片http链接列表
        })
    },
    bindKeyInput(e) {
        const name = e.target.dataset.name
        const index = e.target.dataset.index
        const value = e.detail.value

        this.setData({
            [`inspectTableData[${index}].${name}`]: value
        })
    },
    bindMaintainInput(e) {
        const name = e.target.dataset.name
        const index = e.target.dataset.index
        const value = e.detail.value

        this.setData({
            [`maintainTableData[${index}].${name}`]: value
        })
    },
    chooseImage(e) {
        const index = e.target.dataset.index
        const curObj = this.data.inspectTableData[index]

        if (curObj.project === '' || curObj.inspectors === '') {
            wx.showToast({
                icon: 'none',
                title: '请先填写巡检项目与巡检人！',
                duration: 2000 // 持续的时间
            })
            return
        }

        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            success: res => {
                const filePath = res.tempFiles[0].tempFilePath

                this.upload(filePath, index)
            }
        })
    },
    upload(filePath, index) {
        const curObj = this.data.inspectTableData[index]
        const trackNo = this.data.trackNo

        wx.uploadFile({
            url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/saveInspectionRecords',
            filePath,
            name: 'file',
            formData: {
                trackNo,
                inspectionItem: curObj.project,
                inspectionUser: curObj.inspectors
            },
            success: res => {
                // 返回值是json字符串，必须解析
                const result = JSON.parse(res.data)

                if (result.success) {
                    this.setData({
                        [`inspectTableData[${index}].fileUrl`]: filePath
                    })
                    wx.showToast({
                        title: '上传成功',
                        duration: 2000 // 持续的时间
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '上传失败，请重试！',
                        duration: 2000 // 持续的时间
                    })
                }
            }
        })
    },
    addRow() {
        const maintainTableData = this.data.maintainTableData;

        // 新增数据是否全部填写
        const isEnter = maintainTableData.every(obj => {
            const values = Object.values(obj).filter(String)
            const keys = Object.keys(obj)
            return values.length === keys.length
        })
        if (!isEnter) {
            wx.showToast({
                icon: 'none',
                title: '请先完善当前数据！',
                duration: 2000 // 持续的时间
            })
            return
        }

        const obj = {
            repairItem: '',
            repairUser: ''
        }
        this.setData({
            maintainTableData: maintainTableData.concat(obj)
        })
    },
    uploadRecord() {
        const maintainTableData = this.data.maintainTableData;
        const trackNo = this.data.trackNo

        // 新增数据是否全部填写
        const isEnter = maintainTableData.every(obj => {
            const values = Object.values(obj).filter(String)
            const keys = Object.keys(obj)
            return values.length === keys.length
        })
        if (!isEnter) {
            wx.showToast({
                icon: 'none',
                title: '请先完善当前数据！',
                duration: 2000 // 持续的时间
            })
            return
        }

        const fetchArr = maintainTableData.map(item => {
            return new Promise((resolve, reject) => {
                wx.request({
                    url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/saveRepairRecords',
                    method: 'POST',
                    data: {
                        trackNo,
                        ...item
                    },
                    success: res => {
                        if (res.data.success) {
                            resolve(res.data)
                        } else {
                            reject()
                        }
                    }
                })
            })
        })

        Promise.all(fetchArr)
            .then(res => {
                wx.showToast({
                    title: '上传成功',
                    duration: 2000 // 持续的时间
                })
            })
            .catch(() => {
                wx.showToast({
                    icon: 'none',
                    title: '请先完善当前数据！',
                    duration: 2000 // 持续的时间
                })
            })
    },
    downloadRecord() {
        const trackNo = this.data.trackNo

        wx.request({
            url: 'https://xcx.evalve.cn:8443/YFWechat/OpenApi/getRecordWord',
            method: 'POST',
            data: {
                trackNo
            },
            success: res => {
                const url = res.data.data.wordUrl

                wx.downloadFile({
                    url,
                    // 保存路径
                    filePath: wx.env.USER_DATA_PATH + '/维保记录.docx',
                    success: file => {
                        wx.openDocument({
                            filePath: file.filePath,
                            // 通过右上角菜单保存到手机
                            showMenu: true
                        })
                    }
                })
            }
        })
    },
    // bindPickerChange(e) {
    //     const value = e.detail.value
    //     const index = e.target.dataset.index
    //     console.log(index);
    //     wx.chooseMedia({
    //         count: 1,
    //         mediaType: ['image'],
    //         success: res => {
    //             this.setData({
    //                 [`inspectTableData[${index}].fileUrl`]: res.tempFiles[0].tempFilePath
    //             })
    //             console.log(this.data.inspectTableData);
    //             console.log(res);
    //         }
    //     })
    // },
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