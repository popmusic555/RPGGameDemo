
// 远程加载图像（兼容微信小游戏）
// web平台 不可以实现文件缓存 直接使用远程加载
// 微信小游戏平台 可以使用文件系统 先远程下载 缓存在本地文件中 再从本地加载 以提升加载速度 减少网络请求

var md5 = require("md5");

cc.Class({
    extends: cc.Component,

    properties: {
        url:"",
        isLoadLoacl:true,
        loadPath:"",
        _SpriteComponent:cc.Sprite,
    },

    onLoad () {
        this._SpriteComponent = this.getComponent(cc.Sprite);
        this.refresh(this.url);
    },

    start () {

    },

    // refresh image
    refresh:function (remoteUrl) {
        this._SpriteComponent.spriteFrame = null;
        this.url = remoteUrl;

        if(Tools.isWeChatGame())
        {
            if(this.isLoadLoacl)
            {
                this.loadPath = this.loadPath || "TempImage";
                var filepath = wx.env.USER_DATA_PATH + "/" + this.loadPath;
                var filename = md5.hex_md5(remoteUrl) + ".png";
                var downloadPath = filepath + "/" + filename;
                
                try
                {
                    var name = wx.getFileSystemManager().accessSync(downloadPath);
                    this.loadImage(downloadPath);
                }catch(err)
                {
                    // 本地无缓存
                    this.downloadImage(this.url , filepath , filename);
                }
            }
            else
            {
                this.loadImage(this.url);
            }
        }
        else
        {
            this.loadImage(this.url);
        }
    },

    // set image
    setImage:function (texture) {
        var sp = new cc.SpriteFrame(texture);
        this._SpriteComponent.spriteFrame = sp;
    },

    // load image
    loadImage:function (imgUrl) {
        cc.loader.load({url: imgUrl, type: 'png'} , function (err, texture) {
            if(err)
            {
                return;
            }
            this.setImage(texture);
        }.bind(this));
    },

    // load 

    // download image
    downloadImage:function (imgUrl, filepath , filename) {
        var downloadPath = filepath + "/" + filename;
        try
        {
            // 目录存在
            var name = wx.getFileSystemManager().accessSync(filepath);
            this._DownloadImage(imgUrl , downloadPath);
        }catch(err)
        {
            // 目录不存在
            try {
                // 创建目录
                wx.getFileSystemManager().mkdirSync(filepath , true);
                this._DownloadImage(imgUrl , downloadPath);
            } catch (err) {
                // 创建目录失败
            }
        }
    },

    _DownloadImage:function (imgUrl, downloadPath) {
        wx.downloadFile({
            url:imgUrl,
            filePath:downloadPath,
            success:function (res) {
                if (res.statusCode === 200) {
                    this.loadImage(downloadPath || res.tempFilePath);
                }
            }.bind(this),
            fail:function (err) {
                console.log(err);
            }.bind(this),
        });
    }

    // update (dt) {},
});
