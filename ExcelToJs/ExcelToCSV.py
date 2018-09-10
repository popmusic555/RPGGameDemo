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
def parseExcel(excelFilepath):
	print "Parse Excel : " + excelFilepath
	data = xlrd.open_workbook(excelFilepath) # 打开xls文件
	allSheet = data.sheets()
	sheetCount = len(allSheet)
	for sheet in allSheet:
		data = parseExcelSheet(sheet)
		excelDataToCsv(data)
	

# 解析Excel Sheet表
def parseExcelSheet(sheetObj):
	print "parse Excel sheet : " , sheetObj.name
	dataObj = []
	nrows = sheetObj.nrows # 获取表的行数
	if nrows <= stepLine + 1:
		print "this sheetObj " + "[" + sheetObj.name + "]" + " is not have data"
		return None
	for i in range(nrows): # 循环逐行打印
		lineData = sheetObj.row_values(i)
		object = []
		if i == stepLine: #此时为字段
			for value in lineData:
				object.append(value)
		else:
			for value in lineData:
				object.append(value)
		dataObj.append(object)
	return dataObj
	
# 使用数据解析成CSV
def excelDataToCsv(dataObj):
	#print len(dataObj) , "package data"
	lineStr = ""
	for i in range(len(dataObj)): # 循环逐行打印
		fields = dataObj[0]
		lineData = dataObj[i]
		lineDataLen = len(lineData)
		for index in range(lineDataLen):
			value = lineData[index]
			lineStr = lineStr + u'"' + str(value) + u'"'
			if index != lineDataLen-1:
				lineStr = lineStr + u','
		lineStr = lineStr + u"\n\r"
	print lineStr

#-------------------------------------
	
# 使用数据解析成Json
def excelDataToJson(dataObj):
	print ""
	
# 使用数据解析成Javascript源文件
def excelDataToJs(dataObj):
	print ""

# 处理传入的命令
def parseCmd(opts, args):
	print opts
	path = None
	abPath = None
	for key, value in opts:
		if key in ['-p', '--path']:
			path = value
		if key in ['-a', '--absolutepath']:
			abPath = value
		if key in ['-o', '--out']:
			global outputPath  
			outputPath = value
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
	srcPath = abPath or (os.path.join(sys.path[0] , (path or "")))
	
	print '源文件路径' , path
	print '源文件绝对路径' , abPath
	print '输出路径' , outputPath
	print '跳过行数' , stepLine
	print '输出的文件类型' , outputFileType
	return True

def main():
	#curPath = os.path.join(sys.path[0] , "excel_data")
	#excel2Javascript(curPath)
	# 处理命令
	opts, args = getopt.getopt(sys.argv[1:], 'p:a:o:s:t:', ['path=', 'absolutepath' , 'out=', 'step=' , "type="])
	if(not parseCmd(opts, args)):
		return False
	# 获取所有Excel文件
	allFilepath = getAllExcelFile(srcPath);
	if len(allFilepath) <= 0:
		# 无Excel文件
		print "There is no excel file in this folder"
		return False
	else:
		# 解析Excel文件
		for file in allFilepath:
			print "Processing {0}{1} files".format(file["fileName"] , file["fileSuffix"])
			parseExcel(file["filePath"])
	return True
	
if __name__ == '__main__':
	main()
	os.system('pause')
	