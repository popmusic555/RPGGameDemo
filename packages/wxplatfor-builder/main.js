'use strict';

var path = require('path');
var fs = require('fs');

function getRequireSetting(textArr)
{
	var len = textArr.length;
	for(var index = 0; index < len; index++)
	{
		var scriptLine = textArr[index];
		
		var result = scriptLine.indexOf("src/settings");
		if (result != -1)
		{
			// 检索到当前行
			return index;
		}
	}
	return -1;
}

function getSettingJsName(str)
{
	var matchStr = str.match(/['"][^'"]*['"]/g);
	if (matchStr.length > 0)
	{
		matchStr = matchStr[0];
		matchStr = matchStr.slice(1 , -1);
	}
	else
	{
		matchStr = null;
	}
	
	return matchStr;
}

function wechatgameBuild(options)
{	
    var gameJsPath = path.join(options.dest, 'game.js');  // 获取发布目录下的 main.js 所在路径
    var script = fs.readFileSync(gameJsPath, 'utf8');     // 读取构建好的 main.js
	
	var textArr = script.split("\r\n");
	
	// 获取settings.js行
	var index = getRequireSetting(textArr);

	if(index != -1)
	{
		// 输出settings.js的json文件
		// 获取settings.js文件名称
		var name = getSettingJsName(textArr[index]);
		if(name && name != "")
		{
			var settingJsonPath = path.join(options.dest, name + ".js");
			var settingJsStr = fs.readFileSync(settingJsonPath, 'utf8');
			var newSettingJsStr = settingJsStr.replace("window._CCSettings" , "module.exports");
			fs.writeFileSync(settingJsonPath , newSettingJsStr);
			
			var settingJsObj = require(settingJsonPath);
			var jsonStr = JSON.stringify(settingJsObj);
			fs.writeFileSync(path.join(options.dest, "res/settings.json") , jsonStr);
			fs.writeFileSync(settingJsonPath , settingJsStr);
		}
		
		// 改变settings.js 加载方式
		var strArr1 = textArr.slice(0 , index);
		var strArr2 = textArr.slice(index + 1);
		
		var len = strArr2.length;
		for(var index = 0; index < len; index++)
		{
			strArr2[index] = "        " + strArr2[index];
		}
		
		var newStrArr1 = [
			"var xhr = new XMLHttpRequest();",
			"xhr.onreadystatechange = function () {",
			"    if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {",
			"        var response = xhr.responseText;",
			"        window._CCSettings = JSON.parse(response);"
		];
		
		var newStrArr2 = [
			"    }",
			"}",
			"xhr.open(\"GET\", '" + options.wechatgame.REMOTE_SERVER_ROOT + "/res/settings.json" + "', true);",
			"xhr.send();"
		];
		
		textArr = strArr1.concat(newStrArr1 , strArr2 , newStrArr2);
	}
	
	script = textArr.join("\r\n");
	fs.writeFileSync(gameJsPath, script);
}


function onBeforeBuildFinish (options, callback) {
	var configObj = getPackageConfig();
	
	if(options.platform == "wechatgame" && configObj.switch && options.wechatgame.REMOTE_SERVER_ROOT != "")
	{
		wechatgameBuild(options);
		Editor.log("wechatgame is build finsh");
	}
	
    callback();
}

function getPackageConfig()
{
	//var path = Editor.url('packages://wxbuilder/LocalStorge.json');
	var path = Editor.projectPath + "/LocalStorge.json";
	
	var configStr = "";
	var isExists = fs.existsSync(path);
	if(isExists)
	{
		configStr = fs.readFileSync(path, 'utf8');
	}
	else
	{
		configStr = setPackageConfig({switch:true});
	}
	
	return JSON.parse(configStr);
}

function setPackageConfig(configObj)
{
	var configStr = JSON.stringify(configObj);
	//fs.writeFileSync( Editor.url('packages://wxbuilder/LocalStorge.json') , configStr);
	fs.writeFileSync( Editor.projectPath + "/LocalStorge.json" , configStr);
	
	return configStr;
}

module.exports = {
    load () {
        Editor.Builder.on('build-finished', onBeforeBuildFinish);
		var configObj = getPackageConfig();
    },

    unload () {
        Editor.Builder.removeListener('build-finished', onBeforeBuildFinish);
    },
	
	messages: {
		switchBtn:function()
		{
			var configObj = getPackageConfig();
			
			configObj.switch = !configObj.switch;
			
			setPackageConfig(configObj);
			
			if(configObj.switch)
			{
				Editor.log('Open the WxBuilder' );
			}
			else
			{
				Editor.log('Close the WxBuilder');
			}
		}
	},	
};