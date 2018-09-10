#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 读取excel数据
# 小罗的需求，取第二行以下的数据，然后取每行前13列的数据
import xlrd
import os,sys

reload(sys)
sys.setdefaultencoding('utf-8')

def excel2Javascript(folderPath):
	print folderPath
	if not os.path.exists(folderPath):
		print "this folder is not exists"
		return
	
	allFiles = getAllExcel(folderPath)
	if len(allFiles) <= 0:
		print "There is no excel file in this folder"
	
	for file in allFiles:
		print "Processing {0}{1} files".format(file["fileName"] , file["fileSuffix"])
		data = getDataForExcel(file["filePath"])
		jsStr = data2Js(data)
		outputJavascript(jsStr , file["fileName"])
	
def outputJavascript(jsStr , fileName):
	curPath = os.path.join(sys.path[0] , "output_data")
	fileName = os.path.join(curPath , fileName + '.js')
	print "Out put to {0} files !".format(fileName)
	with open(fileName,'w') as f: # 如果filename不存在会自动创建， 'w'表示写数据，写之前会清空文件中的原有数据！
		f.write(jsStr)

def getAllExcel(folderPath):
	allFiles = []
	for (root, dirs, files) in os.walk(folderPath):
		for filename in files:
			filepath = os.path.join(root,filename)
			#获取后缀
			suffix = os.path.splitext(filepath)[1]
			if suffix == ".xlsx" or suffix == ".xls":
				dict = {}
				dict["fileName"] = os.path.splitext(filename)[0]
				dict["filePath"] = filepath
				dict["fileSuffix"] = suffix
				allFiles.append(dict) 
	return allFiles

def getDataForExcel(filepathOfExcel):
	allDataList = {}

	data = xlrd.open_workbook(filepathOfExcel) # 打开xls文件
	allSheet = data.sheets()
	sheetCount = len(allSheet)
	for sheet in allSheet:	
		sheetDataList = []
		table = sheet # 打开一张表
		nrows = table.nrows # 获取表的行数
		if nrows <= 1:
			print "this sheet is not have data"
		
		for i in range(nrows): # 循环逐行打印
			lineData = table.row_values(i)
			object = []
			if i == 0: #第一行为字段
				for value in lineData:
					object.append(value)
				sheetDataList.append(object)
			else:
				for value in lineData:
					object.append(value)
				sheetDataList.append(object)
		
		allDataList[table.name] = sheetDataList
		
	return allDataList
			
def data2Js(data):
	dataStr = ""
	endStr = ""
	for key in data:
		print "Sheet {0} ...".format(key)
		jsStr = sheetData2Js(data[key] , key)
		dataStr = dataStr + jsStr + "\n"
		
		endStr = endStr + "{0}:{0},".format(key)
	endStr = endStr[:-1]
	endStr = "module.exports = {{{0}}}".format(endStr)
		
	dataStr = dataStr + "\n"
	dataStr = dataStr + endStr
	#module.exports = {EveryMonth:EveryMonth , EveryDay:EveryDay}
	return dataStr
	
def sheetData2Js(sheetData , sheetName):
	arrayStr = createArray(sheetName , len(sheetData) - 1)
	arrayStr = appendArray(arrayStr , createObjectList(sheetData))
	return arrayStr

#-------------------------------------

def toStringText(string):
	return "\"" + string + "\""
	
def createArray(arrayName , size):
	if arrayName == None or arrayName == "":
		arrayName = ""
	else:
		arrayName = "var {0} = ".format(arrayName)
	
	content = ""
	for i in range(size):
		content = content + "{0[" + str(i) + "]}"
		if i != size - 1:
			content = content + ",\n"
	
	string = "{0}[\n{1}\n]".format(arrayName , content)
	return string

def appendArray(arrayStr , strList):
	content = arrayStr.format(strList)
	return content
	
def createObjectList(datas):
	result = []
	count = len(datas)
	for i in range(count):
		if i == 0:
			continue
		objStr = createObject(None , datas[0] , datas[i])
		result.append(objStr)
	return result

def createObject(objName , fields , values):
	if objName == None or objName == "":
		objName = ""
	else:
		objName = "var {0} = ".format(objName)
		
	fieldNum = len(fields)
	content = ""
	for i in range(fieldNum):
		content = content + ""		
		fieldStr , fieldType = getType(fields[i])
		fieldStr , valueStr = getFieldValue(values[i] , fieldStr , fieldType)
		content = content + "        " + createField(fieldStr , valueStr)
		if i != fieldNum - 1:
			content = content + ",\n"
	string = "    {0}{{\n{1}\n    }}".format(objName , content)
	return string
	
def createField(field , value):
	return field + ":" + value
	
def getFieldValue(data , fieldStr , fieldType):
	if fieldType == ".int":
		data = str(int(float(data)))
	elif fieldType == ".float":
		data = str(float(data))
	elif fieldType == ".string":
		data = toStringText(str(data))
	elif fieldType == ".array":
		data = str(data)
		fieldStr , fieldType = getType(fieldStr)
		data = data.split("|")
		count = len(data)
		text = "["
		for i in range(count):
			fieldStr , value = getFieldValue(data[i] , fieldStr , fieldType)
			text = text + value
			if i != count - 1:
				text = text + ","
		text = text + "]"
		data = text
	else:
		data = toStringText(str(data))
	return fieldStr , data

def getType(field):
	data = os.path.splitext(field)
	value = data[0]
	type = data[1]
	return value,type
	
if __name__ == '__main__':
	curPath = os.path.join(sys.path[0] , "excel_data")
	excel2Javascript(curPath)
			
			
			
			
			
			
			
			
			