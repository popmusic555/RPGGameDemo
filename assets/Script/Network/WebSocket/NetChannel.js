
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
        return this._Callback.apply(this._Context , protocal_num , protocal_len , protocal_data)
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
};

Request.prototype.trigger = function(socket_client) {
    this.socket_client.sendMessage(this._PackageData);
};

/*
网络通讯管道 

主要保存请求和响应对象

每条管道中 必然会有响应对象 但未必有请求对象
无请求对象 主要用来处理服务器推送数据

*/
var Channel = function (group) {
    this._valid = true;
    this._ID = null; // channel对象的名称
    this._Request = null; // 请求对象
    this._Response = null; // 响应对象
    this._Group = group;
};

Channel.prototype._SetRequset = function (req) {
    this._Request = req;
};

Channel.prototype._SetResponse = function (resp) {
    this._Response = resp;
};

Channel.prototype.request = function (packageData) {
    var req = new Request(packageData);
    this._SetRequset(req);
};

Channel.prototype.response = function (protocal_num , context , callback) {
    var resp = new Response(protocal_num , context , callback);
    this._SetResponse(protocal_num , context , callback);
    this._Group.add(this);
};

Channel.prototype.send = function () {
    this._Group.send();
};

Channel.prototype.setValid = function() {
    this._valid = flag;
};

Channel.prototype.isValid = function() {
    return this._valid;
};

// 触发请求函数
Channel.prototype.triggerReq = function (socket_client) {
    if(this._Request)
    {
        this._Request.trigger(socket_client);
    }
};
// 触发响应函数
Channel.prototype.triggerResp = function (protocal_num , protocal_len , protocal_data) {
    return this._Response.trigger(protocal_num , protocal_len , protocal_data);
};

// 管线管理器
var ChannelGroup = {
    _SClient:null,
    _Channels:new Array,
    // 发射事件
    emit:function (protocal_num , protocal_len , protocal_data) {
        var length = this._Channels.length
        for (var index = length - 1; index >= 0; index--) {
            var channel = this._Channels[index];
            if(channel.isValid())
            {
                var result = channel.triggerResp(protocal_num , protocal_len , protocal_data);
                channel.setValid(result);
            }else{
                this._RemoveFromArray(index);
            }
        }
    },

    // 发送数据
    send:function () {
        this._SClient.sendMessage(packageData);
        for (let index = 0; index < array.length; index++) {
            var channel = this._Channels[index];
            var result = channel.triggerReq(this._SClient);
        }
    },
    _RemoveFromArray:function (index) {
        this._Channels.splice(index, 1);
    },

    buildChannel:function () {
        var channel = new Channel(this);
        return channel;
    },

    add:function (channel) {
        this._Channels.push(channel);
    },

    setSocketClient:function (client) {
        this._SClient = client;
    },
    removeSocketClient:function () {
        this._SClient = null;
    }
};