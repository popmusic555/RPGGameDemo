/**
 * 信号通道
 */
var GChannel = function (signal_id , handler , times) {
    this._handleTimes = times || -1;
    this.signal_id = signal_id;
    this.handler = handler;
};

// 信道触发
GChannel.prototype.trigger = function (signal_id , data) {
    if (signal_id == this.signal_id) {
        // 可触发
        this.handle(data);
    }
};

// 信道数据处理
GChannel.prototype.handle = function (data) {
    this._handleTimes -= 1;
    if (this._handleTimes < -1) {
        this._handleTimes = -1;
    }
    this.handler(data , this._handleTimes);
};

// 信道是否废弃
GChannel.prototype.isInvalid = function () {
    return !this. _handleTimes; 
};

/**
 * 信号处理器
 */
var SignalProcessor = function () {
    // 信道组
    this.channelGroup = new Array;
};

// 创建信道
SignalProcessor.prototype.buildChannel = function (signal_id , handler , times) {
    var channel = new GChannel(signal_id , handler , times);
    this.add(channel);
};

// 添加
SignalProcessor.prototype.add = function (channel) {
    this.channelGroup.push(channel);
};

// 清除所有
SignalProcessor.prototype.clear = function () {
    this.channelGroup = new Array; 
};

// 广播信号
SignalProcessor.prototype.broadcastSignal = function (signal_id , data) {
    var len = this.channelGroup.length;
    for (let index = 0; index < len; index++) {
        var channel = this.channelGroup[index];
        channel.trigger(signal_id , data);
    }
    this.recycleChannel();
};

// 回收废弃信道
SignalProcessor.prototype.recycleChannel = function () {
    var len = this.channelGroup.length;
    for (let index = len; index >= 0; index--) {
        var channel = this.channelGroup[index];
        if (channel.isInvalid()) {
            this.channelGroup.splice(index,1);    
        }
    }
}


/**
 * websocket封装
 * 
 * 心跳协议
 * 数据发送接收
 * 事件分发
 */
var GSocket = function (cfg) {
    // 协议号字节数(默认为4)
    this.protocal_id_len = 4;
    // 数据长度字节数(默认为2)
    this.protocal_len = 2;
    // 字节序模式(大端模式or小端模式 默认大端模式)
    this.endian_mode = false;
    // 发送模式(默认模式 字符串使用此模式)
    this.send_mode = "arraybuffer";
    
    // 心跳配置
    this.heartbeat_config = {
        // 心跳开关(默认开启)
        heartbeat_switch:true,
        // 心跳间隔(默认3000毫秒)
        heartbeat_time:3000,
        // 心跳信号
        heartbeat_signal:1,
        // 心跳数据
        heartbeat_data:function () {
            return parseInt(new Date().getTime() / 1000);
        },
        max_health:3,
    };

    this._socket_ = null;
    this._url_ = null;
    this._ConnectedHandler_ = null;
    this._cur_health_ = this.heartbeat_config.max_health;
    this._interval_ = null;

    this._closeUrl_ = null;

    // 解析器
    this.decoder = null;
    // 编码器
    this.encoder = null;

    this.signalProcessor = new SignalProcessor();

    this.init(cfg);
};

GSocket.waring = function (...value) {
    console.warn("[ GSocket Waring ] :" , ...value);  
};

GSocket.log = function (...value) {
    console.log("[ GSocket Log ] :" , ...value);
};

GSocket.prototype.init = function (cfg) {
    this.config(cfg);
};

GSocket.prototype.connect = function (url , connectedHandler) {
    if (!url) {
        // 无地址
        GSocket.waring("连接地址无效");
        return false;
    }

    if (this._socket_ && this._socket_.readyState != WebSocket.CLOSED) {
        // 当前已连接
        GSocket.waring("websocket 已连接成功");
        return false;
    }

    if (!connectedHandler) {
        GSocket.waring("无法处理连接成功消息");
        return false;
    }

    this._url_ = url;
    this._ConnectedHandler_ = connectedHandler;

    // 创建websocket
    this._socket_ = new WebSocket(this._url_);
    // 设置传输类型
    this._socket_.binaryType = this.send_mode;
    this._socket_.onopen = function (event) {
        this.onConnected(event);
    }.bind(this);
    this._socket_.onmessage = function (event) {
        this.onMessage(event);
    }.bind(this);
    this._socket_.onclose = function (event) {
        this.onClose(event);
    }.bind(this);
    this._socket_.onerror = function (event) {
        this.onError(event);
    }.bind(this);

    return true;
};

GSocket.prototype.onConnected = function (event) {
    GSocket.log("与服务器[ " + this._url_ + " ]" + "连接成功");

    this.heartbeat_config.heartbeat_switch?[this.openHeartbeat(),GSocket.log("心跳功能开启")]:GSocket.log("心跳功能未开启");
    
    this._ConnectedHandler_(event);
};

GSocket.prototype.onMessage = function (event) {
    var rawdata = event.data;
    GSocket.log("服务器响应原始数据" , rawdata);

    this._RecoveryHealth();
    this.response(rawdata);
};

GSocket.prototype.onClose = function (event) {
    this.destory();
    GSocket.log("与服务器[ " + (this._closeUrl_ || "?") + " ]" + "断开连接");
};

GSocket.prototype.onError = function (event) {
    GSocket.log("连接[ " + (this._url_ || "?") + " ]" + "错误");
};

// 断线重连
GSocket.prototype.reconnect = function () {
    if (!this._url_) {
        // 无地址
        GSocket.waring("服务器地址无效");
        return false;
    }

    this.connect(this._url_);  
};

// 断开websocket
GSocket.prototype.disconnect = function () {
    if (this._socket_)
    {
        this.destory();
    }
    else
    {
        GSocket.waring("当前 Websocket 连接已断开");
    }
};

GSocket.prototype.destory = function () {
    if (this._socket_) {
        this._closeUrl_ = this._url_;
        this.closeHeartbeat();
        this._url_ = null;
        this._ConnectedHandler_ = null;
        this._socket_.close();
        this._socket_ = null;
    }
};

// 是否连接成功
GSocket.prototype.isConnected = function () {
    var result = false;
    if (this._socket_ && this._socket_.readyState == WebSocket.OPEN)
    {
        result = true;
    }
    return result;
};

// 是否正在连接
GSocket.prototype.isConnecting = function () {
    var result = false;
    if (this._socket_ && this._socket_.readyState == WebSocket.CONNECTING)
    {
        result = true;
    }
    return result;
};

// 初始化
GSocket.prototype.config = function (cfg) {
    cfg = cfg || {};

    // 协议号字节数(默认为4)
    this.protocal_id_len = 4;
    // 数据长度字节数(默认为2)
    this.protocal_len = 2;
    // 字节序模式(大端模式(false)or小端模式(true) 默认大端模式)
    this.endian_mode = false;
    // 发送模式(默认模式 字符串使用此模式)
    this.send_mode = "arraybuffer";

    this.protocal_id_len = cfg.protocal_id_len || this.protocal_id_len;
    this.protocal_len = cfg.protocal_len || this.protocal_len;
    this.endian_mode = cfg.endian_mode || this.endian_mode;
    this.send_mode = cfg.send_mode || this.send_mode;

    if (cfg.heartbeat_config) {
        this.heartbeat_config.heartbeat_switch = cfg.heartbeat_config.heartbeat_switch || this.heartbeat_config.heartbeat_switch;
        this.heartbeat_config.heartbeat_time = cfg.heartbeat_config.heartbeat_time || this.heartbeat_config.heartbeat_time;
        this.heartbeat_config.heartbeat_signal = cfg.heartbeat_config.heartbeat_signal || this.heartbeat_config.heartbeat_signal;
        this.heartbeat_config.heartbeat_data = cfg.heartbeat_config.heartbeat_data || this.heartbeat_config.heartbeat_data;
    }

    GSocket.log("[ 协议号Size :" , this.protocal_id_len , "]");
    GSocket.log("[ 协议数据Size :" , this.protocal_len , "]");
    GSocket.log("[ 字节序模式 :" , this.endian_mode?"小端模式":"大端模式" , "]");
    GSocket.log("[ 发送模式 :" , this.send_mode , "]");
    GSocket.log("[ 心跳功能 :" , this.heartbeat_config.heartbeat_switch?"开启":"关闭" , "]");
    GSocket.log("[ 心跳间隔 :" , this.heartbeat_config.heartbeat_time , "毫秒" , "]");
    GSocket.log("[ 心跳信号 :" , this.heartbeat_config.heartbeat_signal , "]");
    

    GSocket.log("初始化完成 配置成功");
};

// 发送数据
GSocket.prototype._Send = function (data) {
    if(this.isConnected())
    {
        this._socket_.send(data);
        return true;
    }
    GSocket.waring("未连接服务器 无法发送数据");
    return false;
};

// 发送请求
GSocket.prototype.request = function (protocal_id , protobuf_class , protobuf_obj) {
    var byteArray = protobuf_class.encode(protobuf_obj).finish();

    // var byteArray = this.encode(protocal_id , protobuf_obj);

    // 组包 协议号(4)+数据长度(2)+二进制数据
    // web平台发送Uint8Array 微信小程序平台发送ArrayBuffer数据(数据长度有限制 最大长度8216？)
    var dataLen = byteArray.length;
    var streamDataLen = this.protocal_id_len + this.protocal_len + dataLen;
    var streamData = new ArrayBuffer(streamDataLen);
    var dataView = new DataView(streamData);
    var newByteArray = new Uint8Array(streamData);
    // 协议号
    dataView.setUint32(0 , protocal_id , this.endian_mode);
    // 数据长度
    dataView.setUint16(this.protocal_id_len , dataLen , this.endian_mode);
    // 二进制数据
    newByteArray.set(byteArray , this.protocal_id_len + this.protocal_len);

    this._Send(streamData);
};

// 响应
GSocket.prototype.response = function (rawdata) {
    var dataView = new DataView(rawdata);
    var protocal_id = dataView.getUint32(0 , this.endian_mode);
    var protocal_len = dataView.getUint16(this.protocal_id_len , this.endian_mode);
    var protocal_data = new Uint8Array(rawdata.slice(this.protocal_id_len + this.protocal_len));
    if (protocal_id == 1) {
        // 心跳响应
        this._Response4heartbeat(protocal_id,protocal_len,protocal_data);
    }
    else
    {
        this._Response4normal(protocal_id,protocal_len,protocal_data);
    }
};

// 心跳响应
GSocket.prototype._Response4heartbeat = function (protocal_id,protocal_len,protocal_data) {
    var data = new DataView(protocal_data.buffer).getUint32();

    GSocket.log("心跳回应 :" , data);
};

// 常规响应
GSocket.prototype._Response4normal = function (protocal_id,protocal_len,protocal_data) {
    GSocket.log("协议编号 :" , protocal_id);
    GSocket.log("数据长度 :" , protocal_len);
    GSocket.log("协议数据 :" , protocal_data);

    if (protocal_data.length == protocal_len) {
        GSocket.log("数据检验成功 无错误");
    }
    else
    {
        GSocket.log("数据检验失败 非法数据");
        return;
    }

    // decode
    protocal_data = this.decode(protocal_id , protocal_data);

    this._Push(protocal_id , protocal_len , protocal_data);
};

// 解码
GSocket.prototype.decode = function (protocal_id , protocal_data) {
    if (this.decoder && this.decoder[protocal_id]) {
        return this.decoder[protocal_id].decode(protocal_data);    
    }
    return protocal_data;
};

GSocket.prototype.setDecoder = function (decoder) {
    this.decoder = decoder;
};

// 编码
GSocket.prototype.encode = function (protocal_id , protocal_obj) {
    if (this.encoder && this.encoder[protocal_id]) {
        return this.encoder[protocal_id].encode(protocal_obj).finish();
    }
    return protocal_obj;
};

GSocket.prototype.setEncoder = function (encoder) {
    this.encoder = encoder;
}

// 推送给信道组
GSocket.prototype._Push = function (signal_id , datalen , data) {
    // 广播信号
    this.signalProcessor.broadcastSignal(signal_id , data);
};

// 信道注册
GSocket.prototype.register = function (signal_id , handler , times) {
    this.signalProcessor.buildChannel(signal_id , handler , times);
};

// 恢复健康心跳
GSocket.prototype._RecoveryHealth = function () {
    this._cur_health_ = this.heartbeat_config.max_health;
};

// 健康衰减
GSocket.prototype._ReductionHealth = function () {
    this._cur_health_ -= 1;  
};

// 开启心跳
GSocket.prototype.openHeartbeat = function () {
    this._interval_ = setInterval(function(){this.keepalive()}.bind(this), this.heartbeat_config.heartbeat_time);
};

// 关闭心跳
GSocket.prototype.closeHeartbeat = function () {
    if (this._interval_) {
        clearInterval(this._interval_);    
    }
};

GSocket.prototype.keepalive = function () {
    // 心跳健康衰减
    this._ReductionHealth();
    if( this._cur_health_ <= 0){
        //此时即可以认为连接断开，可设置重连或者关闭连接
        var address = this._url_;
        var callback = this._ConnectedHandler_;
        GSocket.log("[ " + address + " ]" + "服务器没有响应");
        this.disconnect();
        this._url_ = address;
        this._ConnectedHandler_ = callback;
        this.reconnect();
        return false;
	}
	else{
        var data = this.heartbeat_config.heartbeat_data();
        GSocket.log( "发送新一轮心跳" , data);
        this.heartbeat(this.heartbeat_signal , data);
        return true;
	}
};

// 心跳
GSocket.prototype.heartbeat = function (protocal_id , protocal_data) {
    // 组包 协议号(4)+数据长度(2)+二进制数据
    // web平台发送Uint8Array 微信小程序平台发送ArrayBuffer数据(数据长度有限制 最大长度8216？)
    var dataLen = 4;
    var streamDataLen = this.protocal_id_len + this.protocal_len + dataLen;
    var streamData = new ArrayBuffer(streamDataLen);
    var dataView = new DataView(streamData);
    var newByteArray = new Uint8Array(streamData);
    // 协议号
    dataView.setUint32(0 , protocal_id , this.endian_mode);
    // 数据长度
    dataView.setUint16(this.protocal_id_len , dataLen , this.endian_mode);
    // 心跳数据
    dataView.setUint32(this.protocal_id_len + this.protocal_len , protocal_data , this.endian_mode);

    this._Send(streamData);
};

window.GSocket = GSocket;
// console.log("GSocket is init" , window.GSocket);

