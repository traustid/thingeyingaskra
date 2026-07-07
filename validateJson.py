import os, json, traceback

jsonDir = 'json'
#jsonDir = 'json_subset'

for filename in os.listdir(jsonDir):
	file = open(jsonDir+'/'+filename)

	try:
		data = json.load(file)
	except Exception:
		print(traceback.format_exc())
		print(filename+' contains errors')
		break
