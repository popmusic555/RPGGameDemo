(function () {
    var SocketClient = {
        // 协议号字节数(默认为4)
        _ProtocalNum_size:4,
        // 数据长度字节数(默认为2)
        _ProtocalDataLen_size:2,
        // 字节序模式(大端模式or小端模式 默认大端模式)
        _Endian_Mode:false,
        // 发送模式(默认blob模式 字符串使用此模式)
        _Send_Mode:"blob",

        _Socket:null,
        _Ws_url:null,
        // 连接Socket
        connect:function (ws_url) {
            if (!ws_url) {
                return false;
            }
            if (this._Socket && this._Socket.readyState != WebSocket.CLOSED) {
                return false;
            }
            this._Ws_url = ws_url;
            this._Socket = new WebSocket(this._Ws_url);
            this._Socket.onopen = function (event) {
                this.onConnected(event);
            }.bind(this);
            this._Socket.onmessage = function (event) {
                this.onMessage(event);
            }.bind(this);
            this._Socket.onclose = function (event) {
                this.onClose(event);
            }.bind(this);
            this._Socket.onerror = function (event) {
                this.onError(event);
            }.bind(this);
        },

        // 断线重连
        reConnect:function () {
            this.connect(this._Ws_url);
        },
        // 断开Socket
        disconnect:function () {
            if (this._Socket)
            {
                this._Socket.onopen = null;
                this._Socket.onmessage = null;
                this._Socket.onclose = null;
                this._Socket.onerror = null;
                this._Ws_url = null;
                this._Socket.close();
                this._Socket = null;
            }
        },
    
        // 是否连接成功
        isConnected:function () {
            var result = false;
            if (this._Socket && this._Socket.readyState == WebSocket.OPEN)
            {
                result = true;
            }
            return result;
        },
    
        // 是否正在连接
        isConnecting:function () {
            var result = false;
            if (this._Socket && this._Socket.readyState == WebSocket.CONNECTING)
            {
                result = true;
            }
            return false;
        },
    
        // 初始化
        config:function (cfg) {
            cfg = cfg || {};
            this._ProtocalNum_size = cfg.ProtocalNumSize || this._ProtocalNum_size;
            this._ProtocalDataLen_size = cfg.ProtocalDataLenSize || this._ProtocalDataLen_size;
            this._Endian_Mode = cfg.EndianMode || this._Endian_Mode;
            this._Send_Mode = cfg.SendMode || this._Send_Mode;
        },

        // 发送消息
        sendMessage:function (data) {
            if(this.isConnected())
            {
                console.log("The sendData is : " , data);
                this._Socket.send(data);
            }
        },

        // 请求
        requestWithStream:function (protocol_num , protobuf_class , protobuf_obj) {
            if(!this.isConnected())
            {
                return;
            }
            var byteArray = protobuf_class.encode(protobuf_obj).finish();
            var sendData = null;
            // 组包 协议号(4)+数据长度(2)+二进制数据
            // web平台发送Uint8Array 微信小程序平台发送ArrayBuffer数据(数据长度有限制 最大长度8216？)
            var dataLen = byteArray.length;
            var streamData = byteArray.buffer;
            var newStreamDataLen = this._ProtocalNum_size + this._ProtocalDataLen_size + dataLen;
            var newStreamData = new ArrayBuffer(newStreamDataLen);
            var dataView = new DataView(newStreamData);
            var newByteArray = new Uint8Array(newStreamData);
            // 协议号
            dataView.setUint32(0 , protocol_num , this._Endian_Mode);
            // 数据长度
            dataView.setUint16(this._ProtocalNum_size , dataLen , this._Endian_Mode);
            // 二进制数据
            newByteArray.set(byteArray , newStreamDataLen - dataLen);
            // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //     // 小程序平台
            //     sendData = newStreamData;
            // }
            // else
            // {
            //     // web平台
            //     sendData = newByteArray;
            // }
            this._Socket.binaryType = "arraybuffer";
            // this.sendMessage(newStreamData);
            return newStreamData;
        },
        requestWithText:function (text) {
            if(!this.isConnected())
            {
                return;
            }
            this._Socket.binaryType = "blob";
            // this.sendMessage(text);
            return newStreamData;
        },

        // request:function (protocol_num , protobuf_class , protobuf_obj) {
        //     // 根据协议数据创建管道
        //     if (protocol_num instanceof String || typeof protocol_num == "string") {
        //         this.requestWithText(protocol_num);
        //     }
        //     else if(protobuf_class && protobuf_obj)
        //     {
        //         this.requestWithStream(protocol_num , protobuf_class , protobuf_obj);
        //     }
        //     else
        //     {
        //         console.error("The send request is Not valid data");
        //     }
        // },
        // 响应
        response:function (protocol_num,respCallback) {
            
        },

        // --------------------------------------------------------------------

        // 构建请求
        buildRequest:function (protocol_num , protobuf_class , protobuf_obj) {
            if(!this.isConnected())
            {
                return;
            }

            var packageData = null;
            if (protocol_num instanceof String || typeof protocol_num == "string") {
                packageData = this.requestWithText(protocol_num);
            }
            else if(protobuf_class && protobuf_obj)
            {
                packageData = this.requestWithStream(protocol_num , protobuf_class , protobuf_obj);
            }
            else
            {
                console.error("The send request is Not valid data");
            }

            var channel = ChannelGroup.buildChannel();
            channel.requset(request);
            return channel;
        },

        // 构建响应
        buildResponse:function (protocol_num , context , callback) {
            var channel = ChannelGroup.buildChannel();
            channel.response(protocol_num , context , callback);
            return channel;
        },

        // 构建响应
        buildResponse:function (protocol_num , context , callback) {
            var channel = ChannelGroup.buildChannel();
            channel.response(protocol_num , context , callback);
            return channel;
        },

        // --------------------------------------------------------------------

        onConnected:function (event) {
            console.log("WSocket Send Text WS was opened.");
            ChannelGroup.setSocketClient(this);
        },
        onMessage:function (event) {
            console.log("WSocket response text msg: " + event.data);

            ChannelGroup.emit(protocal_num , protocal_len , protocal_data);
        },
        onClose:function (event) {
            console.log("WSocket WebSocket instance closed.");
            ChannelGroup.removeSocketClient();
        },
        onError:function (event) {
            console.log("WSocket Send Text fired an error");
            ChannelGroup.removeSocketClient();
        },
    };
    SocketClient.config();
    window.SocketClient = SocketClient;
    console.log("SocketClient is Require");
})();

