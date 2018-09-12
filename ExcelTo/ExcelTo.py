#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ��ȡexcel����
# С�޵�����ȡ�ڶ������µ����ݣ�Ȼ��ȡÿ��ǰ13�е�����
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

# �Ƿ�Ϊ����ת���ɸ�����
def isCanFloat(value):
	try:
		v = float(value)
	except TypeError:
		return False
	except ValueError:
		return False
	else:
		return True

# �Ƿ�Ϊ����ת����������
def isCanInt(value):
	try:
		v = int(value)
	except TypeError:
		return False
	except ValueError:
		return False
	else:
		return True
		
# �����ֶ�
def parseField(fieldName):
	return fieldName.split(u".")

# �Ƿ�Ϊ��Ч�ֶ�
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
	
# ��Excel����number���ᴦ���float���� ����int�����ֶ��޷��ж�ƥ�� ��Ԥ�����ֶ�
# ������Excelֵȫ�����ַ������½��� ����С��λnumberת����intֵ ������С��λnumber
# ת��Ϊfloatֵ ������������
# �������ݻ���ֿո��ַ������ Ҳ�ڴ˴�������
def preParse(value):
	value = str(value)
	
	# ���ո��ַ������� ת���ɿ��ַ���("")
	value = value.replace(u" " , u"")
	
	numberObj = value.split(u".")
	numberObjLen = len(numberObj)
	if numberObjLen == 2:
		if numberObj[0].isdigit() and numberObj[1].isdigit():
			if int(numberObj[1]) == 0:
				# ��ǰΪ��С��number����
				return numberObj[0]
	return value

# �����ֶ�ֵ
def parseValue(fieldName , value):
	# �˴�Ԥ��������
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

# ��ȡ����Excel�ļ�·��
def getAllExcelFile(rootPath):
	allFiles = []
	for (root, dirs, files) in os.walk(rootPath):
		for filename in files:
			filepath = os.path.join(root,filename)
			#��ȡ��׺
			suffix = os.path.splitext(filepath)[1]
			if (suffix == ".xlsx" or suffix == ".xls") and (filename[0] != "~" or filename[1] != "$") :
				dict = {}
				dict["fileName"] = os.path.splitext(filename)[0]
				dict["filePath"] = filepath
				dict["fileSuffix"] = suffix
				allFiles.append(dict) 
	return allFiles

# ����Excel�ļ�
def parseExcel(excelFilepath , excelFilename):
	print "Parse Excel : " + excelFilepath
	data = xlrd.open_workbook(excelFilepath) # ��xls�ļ�
	allSheet = data.sheets()
	for sheet in allSheet:
		data = parseExcelSheet(sheet , excelFilename)
		if data:
			# ������CSV��ʽ����
			dataStr = excelDataToCsvString(data)
			# �����CSV��ʽ�ļ�
			outputFile(excelFilename + "." + sheet.name ,dataStr)
		else:
			return False
	return True
	
# ����Excel Sheet��
def parseExcelSheet(sheetObj , excelFilename):
	print "parse Excel sheet : " , sheetObj.name
	dataObj = []
	nrows = sheetObj.nrows # ��ȡ�������
	if nrows <= stepLine + 1:
		print "The Excel " + excelFilename + "." + "[" + sheetObj.name + "]" + " is not have data"
		return None
	for i in range(nrows): # ѭ�����д�ӡ
		isHaveValue = False
		lineData = sheetObj.row_values(i)
		object = []
		if i == 0 + stepLine:
			isHaveValue = True
			#��ʱΪ�ֶ�
			for fieldIndex in range(len(lineData)):
				field = lineData[fieldIndex]
				if not isVaildField(field):
					print ", [" + sheetObj.name + "." + excelFilename + "] Table " + "Invaild Field name , in Row " + str(fieldIndex+1) , field
					return None
				object.append(field)
		else:
			#��ʱΪ����
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
	
# ������ļ�
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
	
	
# ʹ�����ݽ�����CSV ------------------
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
	with open(filepath,'w') as f: # ���filename�����ڻ��Զ������� 'w'��ʾд���ݣ�д֮ǰ������ļ��е�ԭ�����ݣ�
		f.write(filedata)
	
	
# ת�������еģ���ֹ���ݽ���ʱ��������
def transferSpecialChar(text):
	return text.replace(u"," , u"\,")

#-------------------------------------

# ʹ�����ݽ�����Json -----------------
def excelDataToJsonString(dataObj):
	print ""
	
def outputToJson_File(filename , endwith , filepath , filedata):
	print "Not hava To Json function"

#-------------------------------------

# ʹ�����ݽ�����JavascriptԴ�ļ� -----
def excelDataToJsString(dataObj):
	print ""

def outputToJs_File(filename , endwith , filepath , filedata):
	print "Not hava To Javascript function"
	
#-------------------------------------

# ʹ�����ݽ�����luaԴ�ļ�  -----------
def excelDataToluaString(dataObj):
	print ""

def outputTolua_File(filename , endwith , filepath , filedata):
	print "Not hava To lua function"
	
#-------------------------------------

# ʹ�����ݽ�����C++Դ�ļ� ------------
def excelDataToCppString(dataObj):
	print ""
	
def outputToCpp_File(filename , endwith , filepath , filedata):
	print "Not hava To Cpp function"

#-------------------------------------

# ʹ�����ݽ�����JavaԴ�ļ� -----------
def excelDataToJavaString(dataObj):
	print ""
	
def outputToJava_File(filename , endwith , filepath , filedata):
	print "Not hava To Java function"

#-------------------------------------


# �����������
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
	
	print 'Դ�ļ�·��' , srcPath
	print '���·��' , outputPath
	print '��������' , stepLine
	print '������ļ�����' , outputFileType
	return True

def main():
	# ��������
	opts, args = getopt.getopt(sys.argv[1:], 'p:a:o:s:t:', ['path=', 'absolutepath' , 'out=', 'step=' , "type="])
	if(not parseCmd(opts, args)):
		return False
	# �ж����·���Ƿ����
	if not os.path.exists(outputPath) or not os.path.isdir(outputPath):
		os.makedirs(outputPath)
		print "Make directory [{0}]  Path : {1}".format(os.path.basename(outputPath) , outputPath)
	# ��ȡ����Excel�ļ�
	allFilepath = getAllExcelFile(srcPath);
	if len(allFilepath) <= 0:
		# ��Excel�ļ�
		print "There is no excel file in this folder"
		return False
	else:
		# ����Excel�ļ�
		for file in allFilepath:
			print "\nProcessing {0}{1} files".format(file["fileName"] , file["fileSuffix"])
			result = parseExcel(file["filePath"] , file["fileName"])
			if not result:
				return False
	return True
	
if __name__ == '__main__':
	main()
	os.system('pause')
	