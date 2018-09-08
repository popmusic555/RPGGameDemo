// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 小精灵Model
cc.Class({
    properties: {
        _ID:0,// 编号
        _Name:"小精灵",// 名称
        _Type:"",// 品种
        _ATTR:0,// 属性
        _ATK:0,// 攻击力
        _DEF:0,// 防御力
        _SPD:0,// 速度值

        _HP_MAX:0,// 血量上限
        _HP:0,// 当前血量
        
        _MP_MAX:0,// 魔法量上限
        _MP:0,// 魔法量
        _EP_MAX:0,// 能量值上限
        _EP:0,// 能量值 
        
        _LV_MAX:0,// 等级上限
        _LV:0,// 等级
        _EXP_MAX:0,// 经验值上限
        _EXP:0,// 经验值
        _QLY_MAX:0,// 品质上限    
        _QLY:0,// 品质    
    },
    ctor:function () {
        console.warn("PokemonBase is ctor");  
    },

    // ------------------------------------血量相关------------------------------------------
    // 回复血量
    upHP:function (opt , hpNum) {
        hpNum = hpNum || 0;
        if(opt == "=")
        {
            this._HP = hpNum;
            
        }else if(opt == "+")
        {
            this._HP += hpNum;
        }
        if(this._HP > this._HP_MAX)
        {
            this._HP = this._HP_MAX;
        }
    },
    // 提升血量上限
    upHP_MAX:function (opt , hpNum) {
        hpNum = hpNum || 0;
        if(opt == "=")
        {
            this._HP_MAX = hpNum;
        }else if(opt == "+")
        {
            this._HP_MAX += hpNum;
        }
    },
    // ------------------------------------魔法量相关------------------------------------------
    // 回复魔法量
    upMP:function (opt , mpNum) {
        mpNum = mpNum || 0;
        if(opt == "=")
        {
            this._MP = mpNum;
            
        }else if(opt == "+")
        {
            this._MP += mpNum;
        }
        if(this._MP > this._MP_MAX)
        {
            this._MP = this._MP_MAX;
        }
    },
    // 提升魔法量上限
    upMP_MAX:function (opt , mpNum) {
        mpNum = mpNum || 0;
        if(opt == "=")
        {
            this._MP_MAX = mpNum;
        }else if(opt == "+")
        {
            this._MP_MAX += mpNum;
        }
    },
    // ------------------------------------能量值相关------------------------------------------
    // 回复能量值
    upEP:function (opt , epNum) {
        epNum = epNum || 0;
        if(opt == "=")
        {
            this._EP = epNum;
            
        }else if(opt == "+")
        {
            this._EP += epNum;
        }
        if(this._EP > this._EP_MAX)
        {
            this._EP = this._EP_MAX;
        }
    },
    // 提升能量值上限
    upEP_MAX:function (opt , epNum) {
        epNum = epNum || 0;
        if(opt == "=")
        {
            this._EP_MAX = epNum;
        }else if(opt == "+")
        {
            this._EP_MAX += epNum;
        }
    },
    // ------------------------------------经验值相关------------------------------------------
    // 提升经验值
    upEXP:function (opt , expNum) {
        expNum = expNum || 0;
        var surplusExp = 0;
        while(expNum >= 0)
        {
            var nextExp = 0;
            if(opt == "=")
            {
                nextExp = expNum;
            }else if(opt == "+")
            {
                nextExp = this._EXP + expNum;
            }

            surplusExp = nextExp - this._EXP_MAX;
            if(surplusExp >= 0)
            {
                // 判断是否满级
                if(this.isMaxLV())
                {
                    this._EXP = this._EXP_MAX;
                    surplusExp = -1;
                    // 保留超出的经验
                    // if(nextExp >= 0)
                    // {
                    //     this._EXP = nextExp;
                    // }
                }else
                {
                    // 升级
                    this.upLV("+" , 1);
                }
            }
            else
            {
                // 增加经验
                if(nextExp >= 0)
                {
                    this._EXP = nextExp;
                }
            }
            expNum = surplusExp;
        }
    },
    // 提升经验上限
    upEXP_MAX:function (opt , expNum) {
        expNum = expNum || 0;
        if(opt == "=")
        {
            this._EXP_MAX = expNum;
        }else if(opt == "+")
        {
            this._EXP_MAX += expNum;
        }
    },
    // 提升等级
    upLV:function (opt , lvNum , isRetainExp) {
        lvNum = lvNum || 1;
        // 升级 经验清零 重置经验上限
        if(opt == "=")
        {
            this._LV = lvNum;
        }else if(opt == "+")
        {
            this._LV += lvNum;
        }
        
        this.upEXP_MAX("=" , this.getMaxEXP());
        if(!isRetainExp)
        {
            this._EXP = 0;
        }
        return this.isMaxLV() ? this._LV = this._LV_MAX : this._LV;
    },
    // 提升等级上限
    upLV_MAX:function (opt , lvNum) {
        lvNum = lvNum || 0;
        if(opt == "=")
        {
            this._LV_MAX = lvNum;
        }else if(opt == "+")
        {
            this._LV_MAX += lvNum;
        }
    },
    // 是否满级
    isMaxLV:function (lvNum) {
        lvNum = lvNum || this._LV;
        if(lvNum >= this._LV_MAX)
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    // 根据等级获取经验上限
    getMaxEXP:function (lvNum) {
        return 34469;
    },
    // ------------------------------------品质相关------------------------------------------
    // 提升品质
    upQLY:function (opt , qualityNum) {
        qualityNum = qualityNum || 1;
        if(opt == "=")
        {
            this._QLY = qualityNum;
            
        }else if(opt == "+")
        {
            this._QLY += qualityNum;
        }
        if(this._QLY > this._QLY_MAX)
        {
            this._QLY = this._QLY_MAX;
        }
        return this._QLY;
    },
    // 提升品质上限
    upQLY_MAX:function (opt , qualityNum) {
        qualityNum = qualityNum || 0;
        if(opt == "=")
        {
            this._QLY_MAX = qualityNum;
        }else if(opt == "+")
        {
            this._QLY_MAX += qualityNum;
        }
    },

    // ------------------------------------战斗相关------------------------------------------
    // 攻击
    attack:function () {
        
    },
    // 受击
    hit:function () {
        
    },
    // 跑动
    run:function() {

    },
    // 防御
    defense:function () {
        
    },

});
