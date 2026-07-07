import os, json

names = open('nofn.txt').read().split()

notFound = []

ids = []

for filename in os.listdir('json'):
	file = open('json/'+filename)
	data = json.load(file)

	for index, item in enumerate(data):
		item['_id'] = filename.split('.')[0]+'-'+item['pageUrl'].split('/')[-1]

		if item['_id'] in ids:
			item['_id'] = item['_id']+'-'+str(index)

		ids.append(item['_id'])

	with open('json/'+filename, 'w', encoding='utf-8') as file:
		json.dump(data, file, indent=4, ensure_ascii=False)
