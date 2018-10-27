
var Collection = (function () {

    var Collection = function (db , name) {
        this._DB_Reference = db;
        this._Name = name;

        this._Collection = new Array;
    };

    // 增
    Collection.prototype.insert = function (obj) {
        this._Collection.push(obj);
    };

    // 删
    Collection.prototype.delete = function (query) {

    };

    // 删除当前表
    Collection.prototype.drop = function () {
        this._DB_Reference.deleteCollection(this._Name);
    };

    // 改
    Collection.prototype.update = function (query) {
        
    };

    // 查
    Collection.prototype.find = function (condition) {
        var result = new Array;
        if (!(condition instanceof Object))
        {
            MemoryDB.waring("查询出错，条件格式错误");
            return result;
        }

        var len = this._Collection.length;
        for (let index = 0; index < len; index++) {
            var record = this._Collection[index];
            record = this._Query(record , null , condition);
            if (record) {
                result.push(record);
            }
        }
        return result;
    };

    Collection.prototype.findOne = function (query) {
        var result = new Array;
        if (!(condition instanceof Object))
        {
            MemoryDB.waring("查询出错，条件格式错误");
            return result;
        }

        var len = this._Collection.length;
        for (let index = 0; index < len; index++) {
            var record = this._Collection[index];
            record = this._Query(record , null , condition);
            if (record) {
                return result;
            }
        }
    };

    Collection.prototype._Query = function (record , query , condition) {
        query = query || "$and";
        var result = null;

        if (condition instanceof Array) {
            // And || or 逻辑判断
            var len = condition.length;
            for (let index = 0; index < len; index++) {
                var record = this._Query(record , query , condition[index]);
                if (condition) {
                    
                }
                
            }
        }
        else if (condition instanceof Object) 
        {
            // And条件判断
            if ("$and" == query) {
                result = this._And(record , condition);
            }
            else if ("$or" == query) {
                result = this._Or(record , condition);
            }
            else if ("ne" == query) {
                result = this._Ne(record , condition);
            }
        }

        return result;
    };

    Collection.prototype._And = function (record , condition) {
        // if (typeof(condition) != "object") {
        //     return null;
        // }

        if (condition instanceof Array) {
            var len = condition.length;
            for (let index = 0; index < len; index++) {
                var item = condition[index];
                
            }
        }
        else if (condition instanceof Object) 
        {
            for (const key in condition) {
                var item = condition[key];
                if ("$and" == key) {
                    record = this._Query(record , "$and" , item);
                    if (!record) {
                        return null;
                    }
                }
                else if("$or" == key)
                {
                    record = this._Query(record , "$or" , item);
                    if (!record) {
                        return null;
                    }
                }
                else if("$ne" == key)
                {
                    record = this._Query(record , "$ne" , item);
                    if (!record) {
                        return null;
                    }
                }
                else if (record[key] != item) {
                    return null;
                }
            }
        }
        else
        {
            return null;
        }
        return record;
    };

    Collection.prototype._Or = function (record , condition) {
        if (typeof(condition) != "object") {
            return null;
        }

        for (const key in condition) {
            var item = condition[key];
            if ("$and" == key) {
                record = this._Query(record , "$and" , item);
                if (record) {
                    return record;
                }
            }
            else if("$or" == key)
            {
                record = this._Query(record , "$or" , item);
                if (!record) {
                    return record;
                }
            }
            else if("$ne" == key)
            {
                record = this._Query(record , "$ne" , item);
                if (!record) {
                    return record;
                }
            }
            else if (record[key] == item) {
                return record;
            }
        }

        return null;
    };

    Collection.prototype._Ne = function (record , condition) {
        if (typeof(condition) != "object") {
            return null;
        }

        for (const key in condition) {
            var item = condition[key];
            if (record[key] != item) {
                return record;
            }
        }
    };

    Collection.prototype._RemoveByIndex = function (index) {
        this._Collection.splice(index , 1);  
    };

    return Collection;
})();

(function () {

    // 内存数据库    
    var MemoryDB = function () {

    }
    
    MemoryDB.prototype.createCollection = function (name) {
        var collection = new Collection(this , name);

        this[name] = collection;

        return collection;
    };

    MemoryDB.prototype.deleteCollection = function (name) {
        this[name] = undefined;
    };

    MemoryDB.waring = function (...value) {
        console.warn("[ MemoryDB Waring ] :" , ...value);  
    };
    
    MemoryDB.log = function (...value) {
        console.log("[ MemoryDB Log ] :" , ...value);
    };

    module.exports = MemoryDB;

})();