

// 网络事件对象
var NetResponse = function (name , context , callback) {
    this._Name = name;
    this._Context = context;
    this._Callback = callback;
};

NetResponse.prototype.getName = function (name) {
    return this._Name
}


// 网络事件管理器
var ResponseMgr = {
    _Responses:new Array,

    get:function (name) {
        var length = responses.length;
        for (let index = 0; index < length; index++) {
            const item = responses[index];
            if (item.getName() == name) {
                return item;
            }
        }
        return null;
    },

    add:function (resp) {
        responses.push(resp);
    },
    remove:function (resp) {
        var length = responses.length;
        for (let index = 0; index < length; index++) {
        }
    },
    removeForName:function (name) {
        
    },
    _Remove:function () {

    },  


    test:function () {
        console.log("the netEvnet is init");
    },
    response:function () {

    },
};

window.WSocket = {
    _socketClient:null,
    // 连接Socket
    connect:function (ws_url) {
        this._socket = new WebSocket(ws_url);
    },

    // 断开Socket
    disconnect:function () {
        this._socket.close();
    },

    // 响应
    response:function (name,context,respCallback) {
        var resp = new NetResponse(name , context , respCallback);
        ResponseMgr.add(resp);
    },

    // 请求
    request:function () {

    },

    init:function (wsUrl) {
        var ws = new WebSocket(wsUrl);

        ws.onopen = function (event) {
            WSocket.onConnect(event);
        };
        ws.onmessage = function (event) {
            WSocket.onMessage(event);
        };
        ws.onclose = function (event) {
            WSocket.onClose(event);
        };
        ws.onerror = function (event) {
            WSocket.onError(event);
        };
    },
    onConnect:function (event) {
        console.log("WSocket Send Text WS was opened.");
    },
    onMessage:function (event) {
        console.log("WSocket response text msg: " + event.data);
    },
    onClose:function (event) {
        console.log("WSocket WebSocket instance closed.");
    },
    onError:function (event) {
        console.log("WSocket Send Text fired an error");
    },

    test:function (data , callback) {
        console.log("uint8 buffer is " , data.buffer);
        var dataLength = data.length;
        var newBuffer = data.buffer.slice(0 , dataLength);
        data = new Uint8Array(newBuffer);
        console.log("uint8 buffer is " , data.buffer);
        console.log("uint8 data is " , data);

        var otherBuffer = new ArrayBuffer(4 + dataLength);
        var dataView = new DataView(otherBuffer);
        var uint8 = new Uint8Array(otherBuffer);
        dataView.setUint32(0 , 15000 , true);
        uint8.set(data , 4);
        console.log("the new buffer data is : " , otherBuffer);
        console.log("the new data is : " , uint8);
        if(Tools.isWeChatGame())
        {
            data = otherBuffer;
        }else
        {
            data = uint8;
        }
        // console.log("netWorkTest");
        // var buffer = new ArrayBuffer(16);
        // var uint8 = new Uint8Array(buffer);

        // uint8.set([255 , 255 , 255 , 255] , 0);

        // console.log("uint8 length is : " , uint8.length);
        // console.log("uint8 is : " , uint8);
        var ws = new WebSocket("ws://echo.websocket.org");
        ws.binaryType = "arraybuffer";

        ws.onopen = function (event) {
            console.log("WSocket Send Text WS was opened.");
        };
        ws.onmessage = function (event) {
            // console.log("WSocket response text msg: " + event.data);
            // console.log("WSocket response text msg: " , event.data);
            // var uini8 = new Uint8Array(event.data);
            // console.log("WSocket response data : " , uini8);
            callback(event);
        };
        ws.onerror = function (event) {
            console.log("WSocket Send Text fired an error");
        };
        ws.onclose = function (event) {
            console.log("WSocket WebSocket instance closed.");
        };

        this.sendData(ws , data);
    },

    sendData:function (ws , data) {
        setTimeout(function () {
            if (ws.readyState === WebSocket.OPEN) {
                console.log("WSocket WebSocket is send.");
                ws.send(data);
                // this.sendData(ws , data);
            }
            else {
                console.log("WSocket WebSocket instance wasn't ready..." , ws.readyState);
            }
        }.bind(this), 2000);
    },
};