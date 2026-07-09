import os, json, re

notFound = []

for filename in os.listdir('json'):
	#print('Laga '+filename)
	file = open('json/'+filename)
	data = json.load(file)

	changed = False

	for item in data:
		if 'birth' in item['person'] and item['person']['birth'] is not None and 'location' in item['person']['birth']:
			birthObj = item['person']['birth']

			birthYear = False
			if 'date' in birthObj and birthObj['date'] is not None:
				birthYear = birthObj['date'].split('-')[0]
			elif 'original_string' in birthObj and birthObj['original_string'] is not None:
				birthYearSearch = re.search('([0-9]{4})', birthObj['original_string'])
				if birthYearSearch:
					birthYear = birthYearSearch.group(1)

			if birthYear and (('location' in birthObj and birthObj['location'] is not None and birthObj['location'] != '') or 'location_obj' in birthObj and birthObj['location_obj'] is not None):
				residence_history_item = {
					'year': birthYear
				}

				if 'original_string' in birthObj and birthObj['original_string'] is not None:
					residence_history_item['original_string'] = birthObj['original_string']
				residence_history_item['age'] = 0
				residence_history_item['status'] = 'Fæðingarstaður'
				if 'location' in birthObj and birthObj['location'] is not None and birthObj['location'] != '':
					residence_history_item['location'] = birthObj['location']
				if 'location_obj' in birthObj and birthObj['location_obj'] is not None:
					residence_history_item['location_obj'] = birthObj['location_obj']

				item['residence_history'] = [residence_history_item]+item['residence_history']
				changed = True

		if 'death' in item['person'] and item['person']['death'] is not None and 'location' in item['person']['death']:
			deathObj = item['person']['death']

			deathYear = False
			if 'date' in deathObj and deathObj['date'] is not None:
				deathYear = deathObj['date'].split('-')[0]
			elif 'original_string' in deathObj and deathObj['original_string'] is not None:
				deathYearSearch = re.search('([0-9]{4})', deathObj['original_string'])
				if deathYearSearch:
					deathYear = deathYearSearch.group(1)

			if deathYear and (('location' in deathObj and deathObj['location'] is not None and deathObj['location'] != '') or 'location_obj' in deathObj and deathObj['location_obj'] is not None):
				residence_history_item = {
					'year': deathYear
				}

				if 'original_string' in deathObj and deathObj['original_string'] is not None:
					residence_history_item['original_string'] = deathObj['original_string']
				residence_history_item['age'] = 0
				residence_history_item['status'] = 'Dánarstaður'
				if 'location' in deathObj and deathObj['location'] is not None and deathObj['location'] != '':
					residence_history_item['location'] = deathObj['location']
				if 'location_obj' in deathObj and deathObj['location_obj'] is not None:
					residence_history_item['location_obj'] = deathObj['location_obj']

				item['residence_history'] = item['residence_history']+[residence_history_item]

				changed = True

		print(item['residence_history'])
	
	if changed:
		print('Breytti '+filename)

		#with open('json/'+filename, 'w', encoding='utf-8') as file:
		#	json.dump(data, file, indent=4, ensure_ascii=False)

