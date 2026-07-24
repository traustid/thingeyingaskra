import os, json, re, traceback, sys
from difflib import SequenceMatcher
from icelandic_mcp.server import lookup_word, get_variant, get_lemma

locationFile = open('ismusLocations.json')
locations = json.load(locationFile)

regionCount = {}

regions = {
	'L.': 'Laxárdalur',
	'K.': 'Kaldakinn',
	'r.': 'Reykjadalur',
	'T.': 'Tjörnes',
	'l.': 'Laxárdalur',
	'B.': 'Bárðardalur',
	'A.': 'Aðaldalur',
	'Rhv.': 'Reykjahverfi',
	'R. hv.': 'Reykjahverfi',
	'R.hv.': 'Reykjahverfi',
	'R.': 'Reykjadalur',
	'Rd.': 'Reykjadalur',
	'Fn.': 'Fnjóskadalur',
	't.': 'Tjörnes',
	'Fl.': 'Flateyjardalur',
	'Höfð.': 'Höfðahverfi',
	'Höfðahv.': 'Höfðahverfi',
	'Grýt.': 'Höfðahverfi',
	'Fj.': 'Hvalvatnsfjörður',
	'M.': 'Mývatnssveit',
	'K.': 'Kaldakinn',
	'Sv.': 'Svalbarðsströnd'
}
'''
	'v.',
	'n.',
	'ð.',
	'Þ.',
	'j.',
	'M.',
	'k.',
	'S.',
	'F.',
	'P.',
	'f.',
	'm.',
	'Á.',
	'G.',
	'b.',
	'J.',
	'g.',
	'N.',
	'd.',
	'H.',
	'Y.',
	'u.',
	'i.',
	's.',
	'x.'
	}
'''

locationCounter = 0
matchCounter = 0
notFound = {}
fileCounter = 0


minSequenceRation = 0.85
manualExcludePlaces = [
	#'Valadalur', 'Valadal', 'Hvammur', 'Hvammi'
]

jsonDir = 'json'
#jsonDir = 'json_subset'

def get_region_value(text):
	sorted_keys = sorted(regions.keys(), key=len, reverse=True)

	for key in sorted_keys:
		suffix_with_period = f" {key}"
		suffix_without_period = f" {key.rstrip('.')}"

		if text.endswith(suffix_with_period) or text.endswith(suffix_without_period):
			return key

	return False

def findPlace(placeItem):
	global locationCounter
	global matchCounter
	global notFound

	if len(sys.argv[1:]) and sys.argv[1] not in placeItem['location']:
		return;
	elif len(sys.argv[1:]) and sys.argv[1] in placeItem['location']:
		print('Leita að "'+sys.argv[1]+'"')

	if 'location_obj' in placeItem:
		placeItem['location_obj'] = None
		del placeItem['location_obj']

	#if not placeItem['location'].startswith('Hallbjarn'):
	#	continue

	#if placeItem['location'].endswith('.'):
	#	match = re.search(r'([A-ZÁÐÉÍÓÚÝÞÆÖ]{1,5}\.)$', placeItem['location'], re.IGNORECASE)

	#	try:
	#		lookupRegion = match.group(1)
	#	except:
	#		lookupRegion = False
	#else:
	#	lookupRegion = False

	lookupRegion = get_region_value(placeItem['location'])

	histName = placeItem['location'].replace(', ', ' ').split(' ')[0].strip()

	histNameLemma = get_lemma(histName)

	if len(histNameLemma['lemmas']) > 0:
		histNameLemma = get_lemma(histName)['lemmas'][0]['lemma'].strip()
	else:
		histNameLemma = False

	print('')
	print('histName: "'+histName+'"')
	if histNameLemma:
		print('histNameLemma: "'+histNameLemma+'"')

	matches = []

	print('region:')
	print(lookupRegion)

	hasRegion = re.search(r'([A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö]{1,8}\.)( )?([A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö]{1,8}\.)?$', placeItem['location'], re.IGNORECASE)

	for location in locations:
		locationCounter += 1

		#if location['location_type']['id'] != 8 and location['location_type']['id'] != 88:
		if location['location_type']['id'] != 8 and histName not in manualExcludePlaces and histNameLemma not in manualExcludePlaces:
			if hasRegion:
				if lookupRegion in regions and any(d['name'] == regions[lookupRegion] for d in location['parent']) and (location['name'] == histName or (histNameLemma and location['name'] == histNameLemma)):
					matches.append({
						'location': location,
						'probability': 1
					})
			elif SequenceMatcher(None, location['name'].lower(), histName.lower()).ratio() >= minSequenceRation+0.05:
				matches.append({
					'location': location,
					'probability': 2
				})
			elif location['name'] == histName or (histNameLemma and location['name'] == histNameLemma):
				matches.append({
					'location': location,
					'probability': 3
				})
			elif lookupRegion and lookupRegion in regions and any(d['name'] == regions[lookupRegion] for d in location['parent']) and SequenceMatcher(None, location['name'].lower(), histName.lower()).ratio() >= minSequenceRation or (histNameLemma and SequenceMatcher(None, location['name'].lower(), histNameLemma.lower()).ratio() >= minSequenceRation):
				diffRatio = SequenceMatcher(None, location['name'].lower(), histName.lower()).ratio()

				if histNameLemma:
					diffRatio = SequenceMatcher(None, location['name'].lower(), histNameLemma.lower()).ratio()

				matches.append({
					'location': location,
					'probability': 4+diffRatio
				})
				
			#if len(matches) == 0 and SequenceMatcher(None, location['name'], histName).ratio() >= minSequenceRation or histNameLemma and SequenceMatcher(None, location['name'].lower(), histNameLemma.lower()).ratio() >= minSequenceRation:
			#	matches.append(location)
			#elif location['name'].startswith(histName.replace('.', '')):
			#	print('match 2')
			#	matches.append(location)
			#elif SequenceMatcher(None, location['name'], histName).ratio() > minSequenceRation:
			#	print('match 3')
			#	matches.append(location)

	#matches = [location for location in locations if location['location_type'] and ('location_type' not in location or location['location_type']['id'] == 1) and SequenceMatcher(None, location['name'], placeItem['location'].split(' ')[0]).ratio() > 0.78]

	if len(matches) > 0:
		matches = sorted(matches, key=lambda d: d['probability'])
		matchCounter += 1

		print('match: '+matches[0]['location']['name'])
		print('match parent: '+matches[0]['location']['parent'][0]['name'])
		print('probability: '+str(matches[0]['probability']))

		placeItem['location_obj'] = matches[0]['location']
	else:
		if histName not in notFound:
			notFound[histName] = 1
		else:
			notFound[histName] = notFound[histName]+1

for filename in os.listdir(jsonDir):
	file = open(jsonDir+'/'+filename)
	fileCounter += 1

	try:
		data = json.load(file)

		for item in data:
			#if item['person']['name'] != 'Ingibjörg Ívarsdóttir':
			#	continue

			if 'person' in item and item['person'] is not None and 'birth' in item['person'] and item['person']['birth'] is not None and 'location' in item['person']['birth'] and item['person']['birth']['location'] is not None:
				findPlace(item['person']['birth'])

			if 'person' in item and item['person'] is not None and 'death' in item['person'] and item['person']['death'] is not None and 'location' in item['person']['death'] and item['person']['death']['location'] is not None:
				findPlace(item['person']['death'])

			for histItem in item['residence_history']:
				findPlace(histItem)

		with open(jsonDir+'/'+filename, 'w', encoding='utf-8') as file:
			json.dump(data, file, indent=4, ensure_ascii=False)
	except Exception:
		print(traceback.format_exc())
		print(filename+' contains errors')
		break

print('locations: '+str(locationCounter))
print('matches: '+str(matchCounter))

print('not found ('+str(len(notFound))+'):')
print(notFound)

notFoundSorted = {k: v for k, v in sorted(notFound.items(), key=lambda item: item[1])}

with open('unknownLocations.json', 'w', encoding='utf-8') as output:
	json.dump(notFoundSorted, output, indent=4, ensure_ascii=False)