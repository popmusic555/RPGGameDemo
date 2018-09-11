# Excel To Csv|Json|Javascript|C++|lua|Java 工具

Excel表 一键导出成格式化文件

# 表结构

Excel表第一行为字段名称+字段类型 (字段类型见字段类型说明) 

Excel表第二行以后所有为正式数据

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
		
	特别注意: 字段名称最多三项标识(Ex name.int.array)
		

字段数据写法规则是 基本数据写法.array 则标注为当前字段是以此基本数据类型为元素类型的数组

数据类型大小写敏感，请仔细确认填写是否大小写无误！

数据类型填写不正确时，工具会弹出错误，并指出出现错误的Excel表中的分表（Sheet）

# 数据说明

数组不填写 数据默认为字段类型默认值（int = 0 , float = 0.0 , String = null , array = null）, 工具会自动帮助转换，数组数据会将空值全部转换成无元素数组   

数据类型不匹配时，工具会自动弹出错误，并指出出现错误数据行数

每条记录中间允许出现断行，但断行中必须全部为空值，不可出现有值情况，否则以正常记录处理

数据中可以出现纯空格字符串，纯空格字符串以字段值未填写的方式处理，将转换成字段默认值

# 参数说明

	-p --path 源文件的相对路径
	
	-a --absolutepath 源文件绝对路径
	
		绝对路径优先级较高
		
		路径下的所有Excel文件将全部进行编译
	
	-o --pth 文件输出路径
	
	-s --step 跳过Excel表文件前n行数据不处理 
	
		表头的注释类不参与编译的记录可以使用此参数跳过
	
	-t --type 文件类型
	
		包含CSV,Json,Javascript,lua,C++,Java

# CSV表 解析格式

	第一行为字段 字段规则与Excel表相同
	
	从第二行开始都是数据，Array类型数据以|分割
	
	CSV表名称为 Excel表.Sheet表.csv
	
	特别注意: 因CSV格式是以英文,字符进行字段的分割处理，为防止数据中的英文,与分隔符冲突，所以当String数据中出现英文,字符时，程序全部会进行转译，转译为 \, 来进行标识
			  解析时需特别注意处理方式

# Json & 代码源文件  (功能暂无)

	已是格式化的文件 无需再次解析 直接可以使用
	字段类型对应关系如下：
		int = JS&lua&Json:number C++&Java:int:
		float = JS&lua&Json:number C++&Java:float:
		String = JS&lua&Json:string C++&Java:String:
		Array = JS&Json:[] lua:{} C++&Java:[]:






























