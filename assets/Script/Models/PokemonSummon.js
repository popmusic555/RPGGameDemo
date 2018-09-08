// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var PokemonBase = require("PokemonBase")

var PokemonSummon = cc.Class({
    extends: PokemonBase,

    // 初始化属性
    statics: {
        create: function (pokemonInfo, view) {
            var obj = new PokemonSummon();
            obj.init(pokemonInfo,view);
            console.warn(obj);  

            return obj;
        }
    },
    properties: {
        _view:null,
    },

    ctor:function () {
        console.warn("PokemonSummon is ctor");
    },

    init:function (pokemonInfo , view) {
        this._ID = pokemonInfo.id;
        this._Name = pokemonInfo.name;
        this._Type = pokemonInfo.type;
        this._ATTR = pokemonInfo.attr;
        this._ATK = pokemonInfo.atk;
        this._DEF = pokemonInfo.def;
        this._SPD = pokemonInfo.speed;
        this._HP_MAX = pokemonInfo.hpMax;
        this._HP = pokemonInfo.hp;
        this._MP_MAX = pokemonInfo.mpMax;
        this._MP = pokemonInfo.mp;
        this._EP_MAX = pokemonInfo.epMax;
        this._EP = pokemonInfo.ep;
        this._LV_MAX = pokemonInfo.lvMax;
        this._LV = pokemonInfo.lv;
        this._EXP_MAX = pokemonInfo.expMax;
        this._EXP = pokemonInfo.exp;
        this._QLY_MAX = pokemonInfo.qlyMax;
        this._QLY = pokemonInfo.qly;

        this._view = view;
    },
});
