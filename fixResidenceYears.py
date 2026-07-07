import os, json

notFound = []

for filename in os.listdir('json'):
	print('Laga '+filename)
	file = open('json/'+filename)
	data = json.load(file)

	for item in data:
		for histItem in item['residence_history']:
			if not 'year' in histItem and 'year_or_period' in histItem:
				histItem['year'] = histItem['year_or_period']
	with open('json/'+filename, 'w', encoding='utf-8') as file:
		json.dump(data, file, indent=4, ensure_ascii=False)

