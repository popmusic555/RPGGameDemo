# RPGGameDemo
RPG游戏Demo

# Excel To Csv|Json|Javascript|C++|lua|Java 工具

Excel表 一键导出成CSV格式文件

# 表结构

Excel表结构第一行为字段描述选项，并不会导出到CSV表中

Excel表第二行为字段名称，字段类型见字段类型说明。Excel表结构从第二行开始，所有数据都会导入到CSV表中

Excel表第二行以后所有为正式数据 使用命令可以选择跳过前某几行记录

# 字段类型说明

字段类型仅支持基本类型数据（int|float|String|）和基本类型数组数据（Array[int|String|float]）

字段写法：
	
	基本类型数据
		基本类型数据写法规则 字段名称.数据类型
		int = 字段名称.int
		float = 字段名称.float
		String = 字段名称.String
	
	数组类型数据
		数组类型数据写法规则 字段名称.数据类型.array (基本数据类型写法.array)
		int = 字段名称.int.array
		float = 字段名称.float.array
		String = 字段名称.String.array

数据数据写法规则是 基本数据写法.array 则标注为当前字段为数组类型

数据类型大小写敏感，请仔细确认填写是大小写无误！

数据类型不填写时，工具会弹出错误，并指出出现错误的Excel表中的分表（Sheet）

# 数据说明

所有字段不填写默认为字段类型默认值（int = 0 , float = 0.0 , String = ""）, 工具会自动帮助转换，数组数据会将空值全部转换成无元素数据

数据类型不匹配时，工具会自动弹出错误，并指出出现错误数据行数

每条记录中间允许出现断行，但断行中必须全部为空值，不可出现有值情况，否则以正常记录处理

数据中可以出现空字符串，空字符串以空值方式处理


# CSV表 解析格式

	第一行为字段 字段规则与Excel表相同
	
	从第二行开始都是数据，Array数据已[]包裹 |分割
	

# Json & 代码源文件 

	已是格式化的文件 无需再次解析 直接可以使用
	字段类型对应关系如下：
		int = JS&lua:number C++&Java:int:
		float = JS&lua:number C++&Java:float:
		String = JS&Json:string C++&Java:String:
		Array = JS&Json:[] C++&Java:[]:






























