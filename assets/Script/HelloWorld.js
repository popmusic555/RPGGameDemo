var PokemonMonster = require("PokemonMonster")
var PokemonSummon = require("PokemonSummon")
// var ProtoBuf = require("protobuf");
var Protocal = require("protocal");

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        btnImage:{
            default:null,
            type:cc.Texture2D
        },
        _summon:null,

        idLable: {
            default:null,
            type: cc.Label
        },
        nameLable: {
            default:null,
            type: cc.Label
        },
        typeLable: {
            default:null,
            type: cc.Label
        },
        attrLable: {
            default:null,
            type: cc.Label
        },
        atkLable: {
            default:null,
            type: cc.Label
        },
        defLable: {
            default:null,
            type: cc.Label
        },
        spdLable: {
            default:null,
            type: cc.Label
        },
        hpLable: {
            default:null,
            type: cc.Label
        },
        mpLable: {
            default:null,
            type: cc.Label
        },
        epLable: {
            default:null,
            type: cc.Label
        },
        lvLable: {
            default:null,
            type: cc.Label
        },
        expLable: {
            default:null,
            type: cc.Label
        },
        qlyLable: {
            default:null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        console.log("Tools is onLoad" , Tools);

        // var monster = new PokemonMonster();
        this._summon = PokemonSummon.create({
            id:1001,
            name:"妙蛙种子1号",
            type:7,
            attr:4,
            atk:500,
            def:200,
            speed:20,
            hpMax:3000,
            hp:3000,
            mpMax:4000,
            mp:4000,
            epMax:100,
            ep:100,
            lvMax:200,
            lv:60,
            expMax:34469,
            exp:5333,
            qlyMax:5,
            qly:5,
        });

        this.logPokemon()


        if(Tools.isWeChatGame())
        {
            wx.login({
                success:function (res) {
                    console.log("Login Success : " + res.code);
                }
            });

            let button = wx.createUserInfoButton({
                type: 'image',

                image:this.btnImage.nativeUrl,
                style: {
                    left: 0,
                    top: 0,
                    width: 320,
                    height: 80,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,   
                }
            })
            button.onTap(function (res) {
                console.log(res);
            });
        }

        console.log("SpriteFrame的真实路径    " , this.btnImage.nativeUrl);
        console.log(this.btnImage.nativeUrl);
        console.log(this.btnImage);

        // this.protoBufTest();

        // this.netWorkTest();
        console.log(SocketClient);
        SocketClient.connect("ws://echo.websocket.org");

        setTimeout(function () {


            // SocketClient.request("The message is text message");
        }.bind(this), 2000);


        var Player = Protocal.grace.proto.msg.Player;
        var player = new Player();
        player.id = 2;
        player.name = "赵杨";
        player.enterTime = 10086;

        SocketClient.buildRequest(100 , Player , player).response(100 , this , function (number , len , data) {
            console.log("The Socket Response is number is : " , number);
            console.log("The Socket Response is len is : " , len);
            console.log("The Socket Response is data is : " , data);
            console.log("create proto Obj is : " , Player.decode(data));
            // return false;
        }).send();

        SocketClient.buildRequest(100 , Player , player).response(100 , this , function (number , len , data) {
            console.log("The Socket Response is number is : " , number);
            console.log("The Socket Response is len is : " , len);
            console.log("The Socket Response is data is : " , data);
            console.log("create proto Obj is : " , Player.decode(data));
            // return false;
        }).send();

        SocketClient.buildRequest(100 , Player , player).response(100 , this , function (number , len , data) {
            console.log("The Socket Response is number is : " , number);
            console.log("The Socket Response is len is : " , len);
            console.log("The Socket Response is data is : " , data);
            console.log("create proto Obj is : " , Player.decode(data));
            // return false;
        }).send();
    },

    protoBufTest:function () {
        let filepath = "ProtoBuf/test";

        var Player = Protocal.grace.proto.msg.Player;
        var player = new Player();
        player.id = 2;
        player.name = "赵杨";
        player.enterTime = 10086;
        var bufferData = Player.encode(player).finish();

        console.log("the Player proto buffer is : " , bufferData);

        console.log("create proto Obj is : " , Player.decode(bufferData));

        var Person = Protocal.Person;
        var person = new Person({name:"wuxiaoyi" , age:27 , address:"北京市石景山区"});
        bufferData = Person.encode(person).finish();
        console.log("create Person proto Obj is : " , Person.decode(bufferData));
    },

    netWorkTest:function () {
        // console.log("netWorkTest");
        // var ws = new WebSocket("ws://echo.websocket.org");
        // ws.onopen = function (event) {
        //     console.log("Send Text WS was opened.");
        // };
        // ws.onmessage = function (event) {
        //     console.log("response text msg: " + event.data);
        // };
        // ws.onerror = function (event) {
        //     console.log("Send Text fired an error");
        // };
        // ws.onclose = function (event) {
        //     console.log("WebSocket instance closed.");
        // };
       
        // setTimeout(function () {
        //     if (ws.readyState === WebSocket.OPEN) {
        //         ws.send("Hello WebSocket, I'm a text message.");
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready..." , ws.readyState);
        //     }
        // }, 5000);  

        // WSocket.connect();

        var Player = Protocal.grace.proto.msg.Player;
        var player = new Player();
        player.id = 2;
        player.name = "赵杨";
        player.enterTime = 10086;
        var bufferData = Player.encode(player).finish();
        console.log("the Player proto buffer is : " , bufferData);
        WSocket.test(bufferData , function (event) {
            var uint32 = new Uint32Array(event.data.slice(0 , 4));
            var uint8 = new Uint8Array(event.data.slice(4));
            console.log("WSocket response text event: " , event);
            console.log("WSocket response text msg: " , event.data);

            console.log("WSocket response type data : " , uint32);
            console.log("WSocket response type : " , uint32[0]);
            console.log("WSocket response data : " , uint8);
            console.log("create proto Obj is : " , Player.decode(uint8));
        });

        console.log("state is WebSocket.OPEN " , WebSocket.OPEN)
        console.log("state is WebSocket.CLOSED " , WebSocket.CLOSED)
        console.log("state is WebSocket.CLOSING " , WebSocket.CLOSING)
        console.log("state is WebSocket.CONNECTING " , WebSocket.CONNECTING)

        // console.log("666666" instanceof String);
        // console.log(typeof "6666666666666666" == "string");
    },

    onLoginBtnCallback:function () {
        wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
        });
    },

    onLevelup:function() {
        this._summon.upLV("+" , 1 );
        this.logPokemon();
        this.netWorkTest();
    },

    onExpup:function () {
        this._summon.upEXP("+" , 800000);
        this.logPokemon();
    },

    logPokemon:function () {
        this.idLable.string = "ID：" + this._summon._ID;
        this.nameLable.string = "名称：" + this._summon._Name;
        this.typeLable.string = "类型：" + this._summon._Type;
        this.attrLable.string = "属性：" + this._summon._ATTR;
        this.atkLable.string = "攻击力：" + this._summon._ATK;
        this.defLable.string = "防御力：" + this._summon._DEF;
        this.spdLable.string = "速度：" + this._summon._SPD;
        this.hpLable.string = "血量：" + this._summon._HP + " / " + this._summon._HP_MAX;
        this.mpLable.string = "蓝量：" + this._summon._MP + " / " + this._summon._MP_MAX;
        this.epLable.string = "能量：" + this._summon._EP + " / " + this._summon._EP_MAX;
        this.lvLable.string = "等级：" + this._summon._LV + " / " + this._summon._LV_MAX;
        this.expLable.string = "经验：" + this._summon._EXP + " / " + this._summon._EXP_MAX;
        this.qlyLable.string = "品种：" + this._summon._QLY + " / " + this._summon._QLY_MAX;
    },

    // called every frame
    update: function (dt) {

    },
});
