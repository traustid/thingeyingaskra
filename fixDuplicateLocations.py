import os, json

notFound = []

for filename in os.listdir('json'):
	file = open('json/'+filename)
	data = json.load(file)

	changed = False

	for item in data:
		locationMap = {}

		for histItem in item['residence_history']:
			if 'location_obj' in histItem:
				if histItem['location_obj']['name'] not in locationMap:
					locationMap[histItem['location_obj']['name']] = histItem['location_obj']

				if locationMap[histItem['location_obj']['name']]['id'] != histItem['location_obj']['id']:
					histItem['location_obj'] = locationMap[histItem['location_obj']['name']]
					print(histItem['location_obj']['name']+' ('+str(histItem['location_obj']['id'])+') er ekki '+histItem['location_obj']['name']+' ('+str(locationMap[histItem['location_obj']['name']]['id'])+')')
					changed = True

	if changed:
		with open('json/'+filename, 'w', encoding='utf-8') as file:
			json.dump(data, file, indent=4, ensure_ascii=False)
		print('Lagaði '+filename)

