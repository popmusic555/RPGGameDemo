
(function () {
    
    var CSVParser = function (dataStr) {
        
    };

    CSVParser.prototype.proload = function() {
        
    };

    var CSVParser = {
        _DataString:null,
        _SpecialChar:[
            [/\\,/g , "$c$"],
        ],

        parseLine:function () {
            
        },

        parseDataToLineString:function (dataStr) {
            var strArray = dataStr.split("\n\r");
            return strArray;
        },

        parseLineToValues:function (lineStr) {
            // 首先处理转译字符
            lineStr = lineStr.split('').reverse().join('');
            var values = lineStr.replace(/,(?!\\)/g , "$").split('').reverse().join('').split(/\$/g);
            return values;
        },
        parseArrayStrToArray:function (fieldType , arrStr) {
            if(arrStr == "null")
            {
                return null;
            }

            var strArray = arrStr.split("|");
            var len = strArray.length;
            for (var i = 0; i < len; i++) {
                strArray[i] = this.parseValueByField(fieldType , strArray[i]);
            }
            return strArray;
        },

        parseValueByField:function (fieldType , value) {
            if (fieldType == "int") {
                // 当前为整数型
                return parseInt(value);
            }
            else if (fieldType == "float") 
            {
                // 当前为浮点数型
                return parseFloat(value);
            }
            else if (fieldType == "String") 
            {
                if(value == "null")
                {
                    return null;
                }
                else
                {
                    return value;
                }
            }
            else
            {
                return null;
            }
        },
        handleSpecialChar:function (lineStr) {
            var len = this._SpecialChar.length;
            for (var i = 0; i < len; i++) {
                var sChar = this._SpecialChar[i][0];
                var tChar = this._SpecialChar[i][1];
                lineStr = lineStr.replace(sChar , tChar);
            }
            return lineStr;
        },

        handleField:function (field) {
            var fieldData = field.split(".");
            return fieldData;
        },

        buildObject:function (fieldList, valueList) {
            var obj = {};

            var len = fieldList.length;
            for (var i = 0; i < len; i++) {
                var field = fieldList[i];
                var value = valueList[i]
                var fieldData = this.handleField(field);

                var fieldName = fieldData[0];
                // 向前解析
                var fieldType = fieldData[fieldData.length-1];                
                if (fieldType == "array") 
                {
                    // 当前为数组型
                    obj[fieldName] = this.parseArrayStrToArray(fieldData[fieldData.length-2] , value);
                }
                else
                {
                    obj[fieldName] = this.parseValueByField(fieldType , value);
                }
            }
            return obj;
        },
        build:function (dataStr) {
            var objs = new Array;

            var lineDatas = this.parseDataToLineString(dataStr);
            var lineDatasLen = lineDatas.length;

            // 字段
            var fields = this.parseLineToValues(lineDatas[0]);
            // 字段值
            for (var i = 1; i < lineDatasLen; i++) {
                var lineStr = lineDatas[i];
                var values = this.parseLineToValues(lineStr);
                var obj = this.buildObject(fields , values);
                objs.push(obj);
            }
            return objs;
        }
    }

    module.exports = CSVParser;

})()