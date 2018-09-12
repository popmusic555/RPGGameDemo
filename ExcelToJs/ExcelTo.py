#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 读取excel数据
# 小罗的需求，取第二行以下的数据，然后取每行前13列的数据
import xlrd
import os,sys
import getopt

reload(sys)
sys.setdefaultencoding('utf-8')

srcPath = ""
outputPath = ""
stepLine = 1
outputFileType = ".csv"

fieldFlag_MaxNum = 3

# 是否为可以转换成浮点数
def isCanFloat(value):
	try:
		v = float(value)
	except TypeError:
		return False
	except ValueError:
		return False
	else:
		return True

# 是否为可以转换成整数数
def isCanInt(value):
	try:
		v = int(value)
	except TypeError:
		return False
	except ValueError:
		return False
	else:
		return True
		
# 解析字段
def parseField(fieldName):
	return fieldName.split(u".")

# 是否为有效字段
def isVaildField(fieldName):
	if fieldName == "" or fieldName == None:
		return False
	fieldData = parseField(fieldName)
	fieldDataLen = len(fieldData)
	if fieldDataLen > fieldFlag_MaxNum:
		return False
	for i in range(fieldDataLen):
		fieldType = fieldData[i]
		if i == 1 and fieldType != u"int" and fieldType != u"float" and fieldType != u"String":
			return False
		if i == 2 and fieldType != "array":
			return False
	return True
	
# 因Excel所有number都会处理成float类型 导致int类型字段无法判断匹配 故预处理字段
# 将所有Excel值全部以字符串重新解析 将无小数位number转化成int值 将带有小数位number
# 转化为float值 其他不做处理
# 部分数据会出现空格字符串情况 也在此处做处理
def preParse(value):
	value = str(value)
	
	# 纯空格字符串处理 转换成空字符串("")
	value = value.replace(u" " , u"")
	
	numberObj = value.split(u".")
	numberObjLen = len(numberObj)
	if numberObjLen == 2:
		if numberObj[0].isdigit() and numberObj[1].isdigit():
			if int(numberObj[1]) == 0:
				# 当前为无小数number类型
				return numberObj[0]
	return value

# 解析字段值
def parseValue(fieldName , value):
	# 此处预处理数据
	strValue = preParse(value)
	fieldData = parseField(fieldName)
	fieldDataLen = len(fieldData)
	for i in range(fieldDataLen-1,-1,-1):
		fieldType = fieldData[i]
		if i == 1:
			if fieldType == u"int":
				if strValue.isdigit():
					return strValue
				elif strValue == u"":
					return "0"
				else:
					print "Error : Value and int type mismatch",
					return None
			if fieldType == u"float":
				if isCanFloat(strValue):
					return str(float(strValue))
				elif strValue == u"":
					return u"0.0"
				else:
					print "Error : Value and float type mismatch",
					return None
		if i == 1 and fieldType == u"String":
			if strValue == u"":
				return u"null"
			else:
				strValue = transferSpecialChar(strValue)
				return strValue
		if i == 2 and fieldType == u"array":
			arrayValue = strValue.split(u"|")
			result = ""
			arrayValueLen = len(arrayValue)
			for index in range(arrayValueLen):
				itemValue = parseValue(fieldData[0] + u"." + fieldData[1] , arrayValue[index])
				if not itemValue:
					print "in Array",
					return None
				result = result + itemValue
				if index < arrayValueLen - 1:
					result = result + u"|"
			return result

# 获取所有Excel文件路径
def getAllExcelFile(rootPath):
	allFiles = []
	for (root, dirs, files) in os.walk(rootPath):
		for filename in files:
			filepath = os.path.join(root,filename)
			#获取后缀
			suffix = os.path.splitext(filepath)[1]
			if (suffix == ".xlsx" or suffix == ".xls") and (filename[0] != "~" or filename[1] != "$") :
				dict = {}
				dict["fileName"] = os.path.splitext(filename)[0]
				dict["filePath"] = filepath
				dict["fileSuffix"] = suffix
				allFiles.append(dict) 
	return allFiles

# 解析Excel文件
def parseExcel(excelFilepath , excelFilename):
	print "Parse Excel : " + excelFilepath
	data = xlrd.open_workbook(excelFilepath) # 打开xls文件
	allSheet = data.sheets()
	for sheet in allSheet:
		data = parseExcelSheet(sheet , excelFilename)
		if data:
			# 解析成CSV格式数据
			dataStr = excelDataToCsvString(data)
			# 输出成CSV格式文件
			outputFile(excelFilename + "." + sheet.name ,dataStr)
		else:
			return False
	return True
	
# 解析Excel Sheet表
def parseExcelSheet(sheetObj , excelFilename):
	print "parse Excel sheet : " , sheetObj.name
	dataObj = []
	nrows = sheetObj.nrows # 获取表的行数
	if nrows <= stepLine + 1:
		print "The Excel " + excelFilename + "." + "[" + sheetObj.name + "]" + " is not have data"
		return None
	for i in range(nrows): # 循环逐行打印
		isHaveValue = False
		lineData = sheetObj.row_values(i)
		object = []
		if i == 0 + stepLine:
			isHaveValue = True
			#此时为字段
			for fieldIndex in range(len(lineData)):
				field = lineData[fieldIndex]
				if not isVaildField(field):
					print ", [" + sheetObj.name + "." + excelFilename + "] Table " + "Invaild Field name , in Row " + str(fieldIndex+1) , field
					return None
				object.append(field)
		else:
			#此时为数据
			for valueIndex in range(len(lineData)):
				if lineData[valueIndex] != u"":
					isHaveValue = True
				value = parseValue(dataObj[0][valueIndex] , lineData[valueIndex])
				if not value:
					print ", [" + sheetObj.name + "." + excelFilename + "] Table " + u"Invaild Value , in Line " + str(i+1) + u" Row " + str(valueIndex+1) , lineData[valueIndex]
					return None
				object.append(value)
		if isHaveValue:
			dataObj.append(object)
	return dataObj
	
# 输出成文件
def outputFile(filename , filedata):
	if outputFileType == ".csv":
		outputToCSV_File(filename , outputFileType , outputPath , filedata)
	elif outputFileType == ".json":
		outputToJson_File(filename , outputFileType , outputPath , filedata)
	elif outputFileType == ".js":	
		outputToJs_File(filename , outputFileType , outputPath , filedata)
	elif outputFileType == ".lua":
		outputTolua_File(filename , outputFileType , outputPath , filedata)
	elif outputFileType == ".cpp":
		outputToCpp_File(filename , outputFileType , outputPath , filedata)
	elif outputFileType == ".java":
		outputToJava_File(filename , outputFileType , outputPath , filedata)
	
	
# 使用数据解析成CSV ------------------
def excelDataToCsvString(dataObj):
	#print len(dataObj) , "package data"
	tableStr = ""
	dataLen = len(dataObj)
	for i in range(dataLen):
		lineStr = ""
		fields = dataObj[0]
		lineData = dataObj[i]
		lineDataLen = len(lineData)
		for index in range(lineDataLen):
			value = lineData[index]
			#lineStr = lineStr + u'"' + transferSpecialChar(str(value)) + u'"'
			lineStr = lineStr + transferSpecialChar(str(value))
			if index != lineDataLen-1:
				lineStr = lineStr + u','
		tableStr = tableStr + lineStr
		if i != dataLen-1:
			tableStr = tableStr + u"\n\r"
	return tableStr

def outputToCSV_File(filename , endwith , filepath , filedata):
	filepath = os.path.join(filepath , filename + endwith)
	with open(filepath,'w') as f: # 如果filename不存在会自动创建， 'w'表示写数据，写之前会清空文件中的原有数据！
		f.write(filedata)
	
	
# 转译数据中的，防止数据解析时出现问题
def transferSpecialChar(text):
	return text.replace(u"," , u"\,")

#-------------------------------------

# 使用数据解析成Json -----------------
def excelDataToJsonString(dataObj):
	print ""
	
def outputToJson_File(filename , endwith , filepath , filedata):
	print "Not hava To Json function"

#-------------------------------------

# 使用数据解析成Javascript源文件 -----
def excelDataToJsString(dataObj):
	print ""

def outputToJs_File(filename , endwith , filepath , filedata):
	print "Not hava To Javascript function"
	
#-------------------------------------

# 使用数据解析成lua源文件  -----------
def excelDataToluaString(dataObj):
	print ""

def outputTolua_File(filename , endwith , filepath , filedata):
	print "Not hava To lua function"
	
#-------------------------------------

# 使用数据解析成C++源文件 ------------
def excelDataToCppString(dataObj):
	print ""
	
def outputToCpp_File(filename , endwith , filepath , filedata):
	print "Not hava To Cpp function"

#-------------------------------------

# 使用数据解析成Java源文件 -----------
def excelDataToJavaString(dataObj):
	print ""
	
def outputToJava_File(filename , endwith , filepath , filedata):
	print "Not hava To Java function"

#-------------------------------------


# 处理传入的命令
def parseCmd(opts, args):
	path = ""
	outpath = ""
	for key, value in opts:
		if key in ['-p', '--path']:
			path = value
		if key in ['-o', '--out']:
			outpath = value
		if key in ['-s', '--step']:
			global stepLine
			if not value.isdigit():
				print "the stepline number is undefined" , value , not value.isdigit()
				return False
			stepLine = int(value)
		if key in ['-t', '--type']:
			global outputFileType
			v = value.lower()
			if "csv" == v:
				outputFileType = ".csv"
			elif "json" == v:
				outputFileType = ".json"
			elif "js" == v:
				outputFileType = ".js"
			elif "cpp" == v:
				outputFileType = ".cpp"
			elif "lua" == v:
				outputFileType = ".lua"
			elif "java" == v:
				outputFileType = ".java"
			else:
				print "the output file type is undefined"
				return False
	global srcPath
	srcPath = os.path.abspath(path)
	global outputPath
	outputPath = os.path.abspath(outpath)
	
	print '源文件路径' , srcPath
	print '输出路径' , outputPath
	print '跳过行数' , stepLine
	print '输出的文件类型' , outputFileType
	return True

def main():
	# 处理命令
	opts, args = getopt.getopt(sys.argv[1:], 'p:a:o:s:t:', ['path=', 'absolutepath' , 'out=', 'step=' , "type="])
	if(not parseCmd(opts, args)):
		return False
	# 判断输出路径是否存在
	if not os.path.exists(outputPath) or not os.path.isdir(outputPath):
		os.makedirs(outputPath)
		print "Make directory [{0}]  Path : {1}".format(os.path.basename(outputPath) , outputPath)
	# 获取所有Excel文件
	allFilepath = getAllExcelFile(srcPath);
	if len(allFilepath) <= 0:
		# 无Excel文件
		print "There is no excel file in this folder"
		return False
	else:
		# 解析Excel文件
		for file in allFilepath:
			print "\nProcessing {0}{1} files".format(file["fileName"] , file["fileSuffix"])
			result = parseExcel(file["filePath"] , file["fileName"])
			if not result:
				return False
	return True
	
if __name__ == '__main__':
	main()
	os.system('pause')
	