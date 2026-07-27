import os, json, re

def isInt(s):
	try:
		float(s)
		return True
	except ValueError:
		return False

notFound = []

for filename in os.listdir('json'):
	#print('Laga '+filename)
	file = open('json/'+filename)
	data = json.load(file)

	changed = False

	for item in data:
		for histItem in item['residence_history']:
			if 'year' in histItem and histItem['year'] is not None:
				print(histItem['year'])
				yearFrags = list(filter(isInt, histItem['year'].split('-')))
				print(yearFrags)
				if len(yearFrags) > 0:
					histItem['year_from_value'] = int(re.sub('[^0-9]', '', yearFrags[0]))
				if len(yearFrags) == 2:
					histItem['year_to_value'] = int(re.sub('[^0-9]', '', yearFrags[1]))
				elif len(yearFrags) == 1:
					histItem['year_to_value'] = int(re.sub('[^0-9]', '', yearFrags[0]))
				print(histItem)

	with open('json/'+filename, 'w', encoding='utf-8') as file:
		json.dump(data, file, indent=4, ensure_ascii=False)

