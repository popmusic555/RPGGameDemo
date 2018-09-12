(function () {

	// 响应消息
	var Response = function (protocal_num , context , callback) {
	    this._valid = true;
	    // this._Name = name;
	    this._Context = context;
	    this._Callback = callback;
	    this._ProtocalNum = protocal_num;
	    this._ProtocalLen = null;
	    this._ProtocalData = null;
	}
	Response.prototype.setProtocalNum = function(num) {
	    // this._Callback.apply(this._Context , socket_event);
	    this._ProtocalNum = num;
	};
	Response.prototype.setProtocalLen = function(len) {
	    this._ProtocalLen = len;
	};
	Response.prototype.setProtocalData = function(data) {
	    this._ProtocalData = data;
	};
	Response.prototype.trigger = function(protocal_num , protocal_len , protocal_data) {
	    // this._Callback.apply(this._Context , socket_event);
	    if(this._ProtocalNum == protocal_num)
	    {
	        return this._Callback.call(this._Context , protocal_num , protocal_len , protocal_data);
	    }
	    return true;    
	};
	Response.prototype.setInvalid = function(flag) {
	    this._IsValid = flag;
	};
	Response.prototype.isValid = function() {
	    return this._IsValid;
	};

	// 请求消息
	var Request = function (packageData) {
	    this._PackageData = packageData;
	    this._IsValid = true;
	};

	Request.prototype.trigger = function(socket_client) {
	    if(this._IsValid)
	    {
	        socket_client.sendMessage(this._PackageData);
	        this.setInvalid();
	    }
	};

	Request.prototype.setInvalid = function() {
	    this._IsValid = false;
	};

	Request.prototype.isValid = function() {
	    return this._IsValid;
	};

	/*
	网络通讯管道 

	主要保存请求和响应对象

	每条管道中 必然会有响应对象 但未必有请求对象
	无请求对象 主要用来处理服务器推送数据

	*/
	var Channel = function (group) {
	    this._valid = true;
	    // this._ID = num; // channel对象的名称
	    this._Request = null; // 请求对象
	    this._Response = null; // 响应对象
	    this.setGroup(group);
	};
	Channel.prototype.setGroup = function (group) {
	    this._Group = group;
	};
	Channel.prototype._SetRequest = function (req) {
	    this._Request = req;
	};
	Channel.prototype._SetResponse = function (resp) {
	    this._Response = resp;
	};
	Channel.prototype.request = function (packageData) {
	    var req = new Request(packageData);
	    this._SetRequest(req);
	    return this;
	};
	Channel.prototype.response = function (protocal_num , context , callback) {
	    var resp = new Response(protocal_num , context , callback);
	    this._SetResponse(resp);
	    return this;
	};
	Channel.prototype.send = function () {
	    if(this._Request)
	    {
	        this._Group.add(this);
	        this._Group.autoSend();
	    }
	    else
	    {
	        console.error("Send a not hava request Channel");
	    }
	};
	Channel.prototype.setValid = function(flag) {
	    this._valid = !!flag;
	};
	Channel.prototype.isValid = function() {
	    return this._valid;
	};
	// 触发请求函数
	Channel.prototype.triggerReq = function (socket_client) {
	    if(this._Request && socket_client)
	    {
	        this._Request.trigger(socket_client);
	        return true;
	    }
	    return false;
	};
	// 触发响应函数
	Channel.prototype.triggerResp = function (protocal_num , protocal_len , protocal_data) {
	    if(!this._Request || this.isInvalidRequest())
	    {
	        return this._Response.trigger(protocal_num , protocal_len , protocal_data);
	    }
	    return true;
	};
	// 请求失效
	Channel.prototype.removeInvalidRequest = function () {
	    if(this._Request && this.isInvalidRequest())
	    {
	        this._SetRequest(null);
	        return true;
	    }
	    return false;
	};
	// 请求是否已经失效
	Channel.prototype.isInvalidRequest = function () {
	    return this._Request && !this._Request.isValid();
	};


	// 管线管理器
	var ChannelGroup = function () {
	    this._SClient = null;
	    this._Channels = new Array; // channel对象的名称
	};
	ChannelGroup.prototype.emit = function (protocal_num , protocal_len , protocal_data) {
		var length = this._Channels.length;
		var isAutoSendChannel = null;
        for (var index = length-1; index >= 0; index--) {
            var channel = this._Channels[index];
            if(channel.isValid())
            {
                var result = channel.triggerResp(protocal_num , protocal_len , protocal_data);
                channel.setValid(result);
                if(channel.removeInvalidRequest())
                {
                    isAutoSendChannel = channel;
                }
            }else{
                this.remove(index);
            }
        }
        if(isAutoSendChannel)
        {
        	console.log("removeInvalidRequest OK   and   autoSend" , isAutoSendChannel._ID);
        	this.autoSend();
        }
	};
	ChannelGroup.prototype.autoSend = function () {
		if(!this._SClient)
		{
			return;
		}
		var length = this._Channels.length;
        for (let index = 0; index < length; index++) {
            var channel = this._Channels[index];
            var result = channel.triggerReq(this._SClient);
            if (result)
            {
                return;
            }
        }
	};
	ChannelGroup.prototype.buildChannel = function () {
		var channel = new Channel(this);
        return channel;
	};
	ChannelGroup.prototype.add = function (channel) {
		this._Channels.push(channel);
	};
	ChannelGroup.prototype.remove = function (index) {
		this._Channels[index].setGroup(null);
		this._Channels.splice(index, 1);
	};
	ChannelGroup.prototype.setSocketClient = function (socket_client) {
		this._SClient = socket_client;
	};
	ChannelGroup.prototype.removeSocketClient = function () {
		this._SClient = null;
	};



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
        _ChannelGroup:null,

        init:function () {
        	this._ChannelGroup = new ChannelGroup();
        },
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
                return true;
            }
            return false;
        },

        // 请求
        requestWithStream:function (protocol_num , protobuf_class , protobuf_obj) {
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
            this._Socket.binaryType = "blob";
            // this.sendMessage(text);
            return newStreamData;
        },
        
        // --------------------------------------------------------------------

        // 构建请求
        buildRequest:function (protocol_num , protobuf_class , protobuf_obj) {
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
            console.error("Package is : " , packageData);
            var channel = this._ChannelGroup.buildChannel();
            console.log(channel);
            channel.request(packageData);
            return channel;
        },

        // 构建响应
        buildResponse:function (protocol_num , context , callback) {
            var channel = this._ChannelGroup.buildChannel();
            channel.response(protocol_num , context , callback);
            channel.send();
            return channel;
        },

        // --------------------------------------------------------------------

        onConnected:function (event) {
            console.log("WSocket Send Text WS was opened.");
            this._ChannelGroup.setSocketClient(this);
            this._ChannelGroup.autoSend();
        },
        onMessage:function (event) {
            console.log("WSocket response text msg: " + event.data);
            var dataView = new DataView(event.data);
            var protocal_num = dataView.getUint32(0 , this._Endian_Mode);
            var protocal_len = dataView.getUint16(this._ProtocalNum_size , this._Endian_Mode);
            var protocal_data = new Uint8Array(event.data.slice(this._ProtocalNum_size + this._ProtocalDataLen_size));
            console.log("protocalNum : " , protocal_num);
            console.log("protocalLen : " , protocal_len);
            console.log("protocalData : " , protocal_data);
            // console.log("create proto Obj is : " , Player.decode(protocal_data));
            this._ChannelGroup.emit(protocal_num , protocal_len , protocal_data);
        },
        onClose:function (event) {
            console.log("WSocket WebSocket instance closed.");
            this._ChannelGroup.removeSocketClient();
        },
        onError:function (event) {
            console.log("WSocket Send Text fired an error");
            this._ChannelGroup.removeSocketClient();
        },
    };
    SocketClient.config();
    SocketClient.init();
    window.SocketClient = SocketClient;
    console.log("SocketClient is Require");
})();

