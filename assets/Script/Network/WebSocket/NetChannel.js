









// 管线管理器
// var ChannelGroup = {
//     // Socket 对象
//     _SClient:null,
//     _Channels:new Array,
//     _CurSendedChannel:null,
//     // 发射事件
//     emit:function (protocal_num , protocal_len , protocal_data) {
//         var length = this._Channels.length
//         for (var index = 0; index < length; index++) {
//             var channel = this._Channels[index];
//             if(channel.isValid())
//             {
//                 var result = channel.triggerResp(protocal_num , protocal_len , protocal_data);
//                 channel.setValid(result);
//                 if(channel.removeInvalidRequest())
//                 {
//                     console.log("removeInvalidRequest OK   and   autoSend");
//                     this.autoSend();       
//                 }
//             }else{
//                 this._RemoveFromArray(index);
//             }
//         }
//     },

//     // 发送数据
//     autoSend:function () {
//         var length = this._Channels.length
//         for (let index = 0; index < length; index++) {
//             var channel = this._Channels[index];
//             var result = channel.triggerReq(this._SClient);
//             if (result)
//             {
//                 return;
//             }
//         }
//     },
//     _RemoveFromArray:function (index) {
//         this.remove();
//     },

//     buildChannel:function (socket_client) {
//         var channel = new Channel(this);
//         return channel;
//     },

//     add:function (channel) {
//         this._Channels.push(channel);
//     },

//     remove:function (index) {
//         this._Channels.splice(index, 1);
//     },
//     setSocketClient:function (client) {
//         this._SClient = client;
//     },
//     removeSocketClient:function () {
//         this._SClient = null;
//     }
// };