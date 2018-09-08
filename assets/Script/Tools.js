var Tools = cc.Class({
    ctor: function () {
        console.log("Tools is ctor");
    },

    init:function () {
       
    },

    isWeChatGame:function () {
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    }
});

window.Tools = new Tools();
console.log("Tools is init" , window.Tools);