import os, json

books = {
	'bok1': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_1',
	'bok2': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_2',
	'bok3': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_3',
	'bok4': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_4',
	'bok5': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_5',
	'bok6': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_6',
	'bok7': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_7',
	'bok8': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_8',
	'bok9': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_9',
	'bok10': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_10',
	'bok11': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_11',
	'bok12': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_12',
	'bok13': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_13',
	'bok14': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_14',
	'bok15': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_15',
	'bok16': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_16',
	'bok17': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_17',
	'bok18': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_18',
	'bok19': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_19',
	'bok20': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_20',
	'bok21': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_21',
	'bok22': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_22',
	'bok23': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_23',
	'bok24': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_24',
	'bok25': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_25',
	'bok26': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_26',
	'bok27': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_27',
	'bok28': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_28',
	'bok29': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_29',
	'bok30': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_30',
	'bok31': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_31',
	'bok32': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_32',
	'bok33': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_33',
	'bok34': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_34',
	'bok35': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_35',
	'bok36': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_36',
	'bok37': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_37',
	'bok38': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_38',
	'bok39': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_39',
	'bok40': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_40',
	'bok41': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_41',
	'bok42': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_42',
	'bok43': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_43',
	'bok44': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_44',
	'bok45': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_45',
	'bok46': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_46',
	'bok47': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_47',
	'bok48': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_48',
	'bok49': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_49',
	'bok50': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_50',
	'bok51': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_51',
	'bok52': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_52',
	'bok53': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_53_-_allt',
	'bok54': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/b_k_54_-_allt',
	'bok55': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-55',
	'bok56': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-56',
	'bok57': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-57',
	'bok58': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-58',
	'bok59': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-59',
	'bok60': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1729-60',
	'bok61': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-61',
	'bok62': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-62',
	'bok63': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-63',
	'bok64': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-64',
	'bok65': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-65',
	'bok66': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-66',
	'bok67': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-67',
	'bok68': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-68',
	'bok69': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-69',
	'bok70': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-70',
	'bok71': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-71',
	'bok72': 'https://issuu.com/heradsskjalasafnthingeyinga/docs/e-1726-72?'
}

for filename in os.listdir('json'):
	file = open('json/'+filename)

	book = filename.split('.pdf')[0]

	pageFrom = int(filename.split('_')[1])
	pageTo = int(filename.split('_')[3].replace('.pdf.json', ''))

	print(book+': '+str(pageFrom)+'-'+str(pageTo))

	bookUrl = books[book]

	print(bookUrl)

	try:
		data = json.load(file)

		counter = pageFrom
		for item in data:
			if 'pageUrl' not in item:
				item['pageUrl'] = bookUrl+'/'+str(counter)
				item['bok'] = book
				item['number'] = counter

				print(item['person']['name'])
				print(item['pageUrl'])
			else:
				print('Skip '+item['person']['name']+', url exists')
			counter += 1

		with open('json/'+filename, 'w', encoding='utf-8') as file:
			json.dump(data, file, indent=4, ensure_ascii=False)
	except:
		print(filename+' contains errors')
		break
