import os, json

names = open('nofn.txt').read().split()

notFound = []

for filename in os.listdir('json'):
	file = open('json/'+filename)
	data = json.load(file)

	for item in data:
		nameParts = item['person']['name'].split(' ')
		if nameParts[0] not in names and nameParts[0] not in notFound:
			notFound.append(nameParts[0])

		if 'spouse' in item:
			for spouse in item['spouse']:
				spouseNameParts = spouse['name'].split(' ')
				if spouseNameParts[0] not in names and spouseNameParts[0] not in notFound:
					notFound.append(spouseNameParts[0])

				spouse['names'] = spouseNameParts
				spouse['firstName'] = spouseNameParts[0]
				spouse['lastName'] = spouseNameParts[len(spouseNameParts)-1]

		if 'parents' in item:
			for parent in item['parents']:
				parentNameParts = parent['name'].split(' ')
				if parentNameParts[0] not in names and parentNameParts[0] not in notFound:
					notFound.append(parentNameParts[0])

				parent['names'] = parentNameParts
				parent['firstName'] = parentNameParts[0]
				parent['lastName'] = parentNameParts[len(parentNameParts)-1]

		item['person']['names'] = nameParts
		item['person']['firstName'] = nameParts[0]
		item['person']['lastName'] = nameParts[len(nameParts)-1]

	with open('json/'+filename, 'w', encoding='utf-8') as file:
		json.dump(data, file, indent=4, ensure_ascii=False)

for name in notFound:
	print(name)
