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
def parseExcel(excelFilepath):
	print "Parse Excel : " + excelFilepath
	data = xlrd.open_workbook(excelFilepath) # ��xls�ļ�
	allSheet = data.sheets()
	sheetCount = len(allSheet)
	for sheet in allSheet:
		data = parseExcelSheet(sheet)
		excelDataToCsv(data)
	

# ����Excel Sheet��
def parseExcelSheet(sheetObj):
	print "parse Excel sheet : " , sheetObj.name
	dataObj = []
	nrows = sheetObj.nrows # ��ȡ�������
	if nrows <= stepLine + 1:
		print "this sheetObj " + "[" + sheetObj.name + "]" + " is not have data"
		return None
	for i in range(nrows): # ѭ�����д�ӡ
		lineData = sheetObj.row_values(i)
		object = []
		if i == stepLine: #��ʱΪ�ֶ�
			for value in lineData:
				object.append(value)
		else:
			for value in lineData:
				object.append(value)
		dataObj.append(object)
	return dataObj
	
# ʹ�����ݽ�����CSV
def excelDataToCsv(dataObj):
	#print len(dataObj) , "package data"
	lineStr = ""
	for i in range(len(dataObj)): # ѭ�����д�ӡ
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
	
# ʹ�����ݽ�����Json
def excelDataToJson(dataObj):
	print ""
	
# ʹ�����ݽ�����JavascriptԴ�ļ�
def excelDataToJs(dataObj):
	print ""

# �����������
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
	
	print 'Դ�ļ�·��' , path
	print 'Դ�ļ�����·��' , abPath
	print '���·��' , outputPath
	print '��������' , stepLine
	print '������ļ�����' , outputFileType
	return True

def main():
	#curPath = os.path.join(sys.path[0] , "excel_data")
	#excel2Javascript(curPath)
	# ��������
	opts, args = getopt.getopt(sys.argv[1:], 'p:a:o:s:t:', ['path=', 'absolutepath' , 'out=', 'step=' , "type="])
	if(not parseCmd(opts, args)):
		return False
	# ��ȡ����Excel�ļ�
	allFilepath = getAllExcelFile(srcPath);
	if len(allFilepath) <= 0:
		# ��Excel�ļ�
		print "There is no excel file in this folder"
		return False
	else:
		# ����Excel�ļ�
		for file in allFilepath:
			print "Processing {0}{1} files".format(file["fileName"] , file["fileSuffix"])
			parseExcel(file["filePath"])
	return True
	
if __name__ == '__main__':
	main()
	os.system('pause')
	