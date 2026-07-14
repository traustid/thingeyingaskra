from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
#from bson.objectid import ObjectId
import re, json

app = FastAPI()

origins = [
	'http://localhost:5173',
	'http://localhost:3000',
	'http://localhost:3016',
	'http://ginnungagap.arnastofnun.is:3016',
	'http://89.127.233.82:3016',
	'http://eggald.in:3016',
	'http://eggald.in'
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=['*'],
	allow_headers=['*'],
)

import config

client = MongoClient(config.mongo_url)

db = client['thskra']
collection = db['persons']

@app.get('/api/search/')
async def searchPerson(name = None, search = None, location = None, location_id = None):
	if name is not None:
		nameQuery = re.escape(name).replace(r'\.', '.*')
		query = {
			'person.name': {
				'$regex': nameQuery,
				'$options': 'i'
			}
		}
	elif location is not None:
		query = {
			'$or': [
				{
					'residence_history.location': location
				},
				{
					'residence_history.location_obj.name': location
				}
			]
		}
	elif location_id is not None:
		query = {
			'residence_history.location_obj.id': int(location_id)
		}
	elif search is not None:
		query = {
			'$or': [
				{
					'person.name': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'person.status': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'residence_history.location': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'residence_history.original_string': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.1': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.2': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.3': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.4': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.5': {
						'$regex': search,
						'$options': 'i'
					}
				},
				{
					'notes.6': {
						'$regex': search,
						'$options': 'i'
					}
				}
			],
		}

	results = collection.find(query).sort({
		'person.name': 1
	});

	if results:
		ret = []

		for person in results:
			person['_id'] = str(person['_id'])

			ret.append(person)

		return {
			'results': ret
		}
	else:
		return {
			'message': 'not found'
		}

@app.get('/api/person/{id}')
async def getPerson(id):
	results = collection.find_one({'_id': id})

	if results:
		results['_id'] = str(results['_id'])

		return results
	else:
		return {
			'message': 'not found'
		}

@app.get('/api/persons/')
async def getPersons(startId=None, order=None, birthyear=None):
	if (startId is not None):

		documents_before_target = collection.count_documents({'_id': {'$lt': startId}})

		calculated_offset = max(0, documents_before_target - 8)

		results = collection.find().sort('_id', 1).skip(calculated_offset).limit(50)
	else:
		query = {
		}

		if birthyear is not None:
			query['person.birth.date'] = {
				'$regex': birthyear
			}

		results = collection.find(query).limit(500)

		if order is not None and order == 'birth':
			results = results.sort('person.birth.date', 1)
		elif order is not None and order == '-birth':
			results = results.sort('person.birth.date', -1)
		else:
			results = results.sort('person.name')

	if results:
		ret = []

		for person in results:
			person['_id'] = str(person['_id'])

			ret.append(person)

		return {
			'results': ret
		}
	else:
		return {
			'message': 'not found'
		}

@app.get('/api/place/{placeId}')
async def getPlace(placeId):
	pipeline = [
		# 1. Flatten the array so every year/location entry becomes an individual row
		{"$unwind": "$residence_history"},
		
		# 2. Filter down to records matching your specific location
		{
			"$match": {
				# Switch this to "residence_history.location_obj.name": target_location_name if searching by string text
				"residence_history.location_obj.id": int(placeId) 
			}
		},
		
		# 3. Reshape the document to return only the target person info and that specific year
		{
			"$project": {
				"_id": 1, # Keep the primary person database record identifier
				"person": 1,
				"year": "$residence_history.year"
			}
		},
		
		# 4. Sort chronologically by the year string value ascending
		# (Use -1 instead of 1 if you want the most recent records first)
		{"$sort": {"year": 1}}
	]

	locationObjPipeline = [
		# 1. Fast match: Grab the first document that contains this location ID anywhere in its array
		{"$match": {"residence_history.location_obj.id": int(placeId)}},
		
		# 2. Optimization: Stop scanning the database after finding the first match
		{"$limit": 1},
		
		# 3. Flatten the history array so we can extract the individual sub-object
		{"$unwind": "$residence_history"},
		
		# 4. Filter the unrolled rows to isolate the exact target location object
		{"$match": {"residence_history.location_obj.id": int(placeId)}},
		
		# 5. Project only the location object structure, discarding the person metadata
		{
			"$project": {
				"_id": 0, # Hide MongoDB's internal object identifier
				"id": "$residence_history.location_obj.id",
				"name": "$residence_history.location_obj.name",
				"lat": "$residence_history.location_obj.lat",
				"lng": "$residence_history.location_obj.lng",
				"location_type": "$residence_history.location_obj.location_type",
				"parent": "$residence_history.location_obj.parent"
			}
		}
	]

	# Run the query
	result = list(collection.aggregate(locationObjPipeline))

	# Extract the single dictionary object from the result list safely
	location_obj = result[0] if result else None

	# Run the query
	results = list(collection.aggregate(pipeline))

	ret = []

	for person in results:
		person['_id'] = str(person['_id'])

	return {
		'place': location_obj,
		'results': results
	}

@app.get('/api/places/')
async def getPlaces():
	pipeline = [
		# 1. Flatten the array so we can inspect every history element
		{"$unwind": "$residence_history"},
		
		# 2. Guard against missing or corrupted location objects
		{
			"$match": {
				"residence_history.location_obj.id": {"$exists": True, "$ne": None}
			}
		},
		
		# 3. Group by unique location ID and calculate the dual counts
		{
			"$group": {
				"_id": "$residence_history.location_obj.id",
				# Base field assignments
				"name": {"$first": "$residence_history.location_obj.name"},
				"lat": {"$first": "$residence_history.location_obj.lat"},
				"lng": {"$first": "$residence_history.location_obj.lng"},
				"location_type": {"$first": "$residence_history.location_obj.location_type"},
				"parent": {"$first": "$residence_history.location_obj.parent"},
				
				# COUNT 1: Collect unique root document IDs to find total distinct people/records
				"unique_records": {"$addToSet": "$_id"},
				
				# COUNT 2: Increment by 1 for every history item that matches this location
				"total_history_appearances": {"$sum": 1}
			}
		},
		
		# 4. Reshape the final output payload
		{
			"$project": {
				"_id": 0,
				"id": "$_id",
				"name": 1,
				"lat": 1,
				"lng": 1,
				"location_type": 1,
				"parent": 1,
				# Measure the size of our accumulated unique record set
				"records_count": {"$size": "$unique_records"},
				"residence_count": "$total_history_appearances"
			}
		}
	]

	# Run the aggregation query
	locations = list(collection.aggregate(pipeline))

	return {
		'results': locations
	}

@app.get('/api/spouse/{personId}')
async def getSpouse(personId):
	targetPerson = collection.find_one({'_id': personId})
	if not targetPerson:
		return {'results': []}

	spouse_list = targetPerson.get('spouse', [])
	if not spouse_list:
		return {'results': []}
	
	ret = []
	
	# 1. Clean and split the target person's name parts
	# Example: "Anna Friðrika Eiríksdóttir" -> ["Anna", "Friðrika", "Eiríksdóttir"]
	target_name = targetPerson.get('person', {}).get('name', '')
	target_parts = [part.strip() for part in target_name.split() if part.strip()]

	for spouse_entry in spouse_list:
		spouse_search_name = spouse_entry.get('name', '')
		search_parts = [part.strip() for part in spouse_search_name.split() if part.strip()]
		
		if not search_parts:
			continue

		# 2. Build flexible cross-matching criteria
		# A) Candidate's person record must contain all components we are looking for
		dbQuery = {
			'_id': {'$ne': personId},
			'person.names': {'$all': search_parts}
		}

		# B) Candidate's spouse record must contain the essential parts of the target's name
		# We look at the first name and last name of the target to build a relaxed verification
		if len(target_parts) >= 2:
			# Matches documents where spouse.name contains both the first and last name tokens 
			# anywhere in the string, bypasses middle name discrepancies entirely.
			dbQuery['$and'] = [
				{'spouse.name': {'$regex': re.escape(target_parts[0]), '$options': 'i'}},
				{'spouse.name': {'$regex': re.escape(target_parts[-1]), '$options': 'i'}}
			]
		elif target_parts:
			dbQuery['spouse.name'] = {'$regex': re.escape(target_parts[0]), '$options': 'i'}

		results = list(collection.find(dbQuery))

		if results:
			for matched_person in results:
				matched_person['_id'] = str(matched_person['_id'])
				if not any(item['_id'] == matched_person['_id'] for item in ret):
					ret.append(matched_person)
		else:
			ret.append(spouse_entry)
			
	return {
		'results': ret
	}

@app.get('/api/parents/{personId}')
async def getParents(personId):
	targetPerson = collection.find_one({'_id': personId})
	if not targetPerson:
		return {'results': []}

	parents = targetPerson.get('parents', [])
	if not parents:
		return {'results': []}
	
	# Helper function to extract the core stem of an Icelandic patronymic name
	def get_patronymic_stem(last_name):
		if not last_name:
			return ""
		# Remove trailing dots and normalize casing
		name = last_name.strip().rstrip('.')
		
		# Strip common variations down to the base possessive/genitive stem (e.g., "Jóakims", "Ásmunds")
		suffixes = ['dóttir', 'son', 'dótt', 'dót', 'sona', 'd', 's']
		for suffix in suffixes:
			if name.lower().endswith(suffix):
				# We slice off the suffix but preserve the genitive 's' if it belongs to the stem
				stem = name[:-len(suffix)]
				if suffix in ['dóttir', 'son', 'd', 's'] and not stem.endswith('s'):
					# Fallback check: if the stem lost its genitive connection, add it back if needed
					pass
				return stem if stem else name
		return name

	def build_flexible_person_query(prefix, first_name, last_name):
		cond = {}
		
		# --- FIRST NAME MATCHING (Handles initials and truncations) ---
		if first_name:
			clean_first = first_name.rstrip('.')
			if first_name.endswith('.'):
				# Target name is short ("J."). Match anything starting with it ("Jón")
				cond[f'{prefix}.firstName'] = {'$regex': f'^{re.escape(clean_first)}', '$options': 'i'}
			else:
				# Target name is long ("Jón"). Match full name or progressive initials ("J.", "J")
				prefixes = [clean_first[:i] for i in range(1, len(clean_first) + 1)]
				prefix_pattern = '|'.join([re.escape(p) for p in prefixes])
				cond[f'{prefix}.firstName'] = {'$regex': f'^({prefix_pattern})\.?$', '$options': 'i'}

		# --- LAST NAME MATCHING (Handles patronymic stem matching) ---
		if last_name:
			stem = get_patronymic_stem(last_name)
			if stem:
				# Matches any last name that starts with the base stem, 
				# ignoring whether it ends in son, dóttir, d., or s.
				cond[f'{prefix}.lastName'] = {'$regex': f'^{re.escape(stem)}', '$options': 'i'}
				
		return cond

	response = []

	def getParentRecord(parent1, parent2):
		# Parent 1 is matched against the 'person' block
		cond1 = build_flexible_person_query('person', parent1.get('firstName'), parent1.get('lastName'))
		# Parent 2 must be matched against the 'spouse' block to confirm the pair match
		cond2 = build_flexible_person_query('spouse', parent2.get('firstName'), parent2.get('lastName'))
		
		dbQuery = {
			'_id': {'$ne': personId},
			**cond1,
			**cond2
		}

		matched_doc = collection.find_one(dbQuery)
		
		if matched_doc:
			matched_doc['_id'] = str(matched_doc['_id'])
			return matched_doc
		
		# If no full record database entry is found, return the original parent metadata dictionary
		return parent1

	if len(parents) == 2:
		# Check both ordering configurations (Father as main person vs Mother as main person)
		response.append(getParentRecord(parents[0], parents[1]))
		response.append(getParentRecord(parents[1], parents[0]))

	return {
		'results': response
	}

@app.get('/api/children/{personId}')
async def getChildren(personId):
	targetPerson = collection.find_one({'_id': personId})
	if not targetPerson:
		return {
			'results': []
		}

	parent_info = targetPerson.get('person', {})
	parent_first = parent_info.get('firstName')
	parent_last = parent_info.get('lastName')

	spouses = targetPerson.get('spouse', [])

	if not spouses or len(spouses) == 0:
		return {
			'results': []
		}

	# 1. Updated helper to apply the array prefix (e.g., 'parents.0') directly to the keys
	def build_parent_query_dict(prefix, first_name, last_name):
		cond = {}
		
		if first_name:
			# 1. Clean up target string (e.g., "Sigurj." -> "Sigurj")
			clean_first = first_name.rstrip('.')
			
			if first_name.endswith('.'):
				# Scenario A: Target parent is truncated/initial (e.g., "Sigurj." or "S.")
				# The child's record must START with that prefix (e.g., "Sigurjón")
				cond[f'{prefix}.firstName'] = {'$regex': f'^{re.escape(clean_first)}', '$options': 'i'}
			else:
				# Scenario B: Target parent has the full name (e.g., "Sigurjón")
				# The child's record could be the full name OR any valid prefix truncation
				# We build a regex that matches "S", "Si", "Sig", "Sigurj", up to "Sigurjón"
				# Pattern shape: ^(S|Si|Sig|Sigurjón)\.?$
				
				# Build progressive prefix steps down to a minimum of 1 character
				prefixes = [clean_first[:i] for i in range(1, len(clean_first) + 1)]
				# Join them together: "S|Si|Sig|Sigu|Sigur|Sigurj|Sigurjó|Sigurjón"
				prefix_pattern = '|'.join([re.escape(p) for p in prefixes])
				
				cond[f'{prefix}.firstName'] = {'$regex': f'^({prefix_pattern})\.?$', '$options': 'i'}

		if last_name:
			clean_last = last_name.rstrip('.')
			if last_name.endswith('.'):
				cond[f'{prefix}.lastName'] = {'$regex': f'^{re.escape(clean_last)}', '$options': 'i'}
			else:
				prefixes_last = [clean_last[:i] for i in range(1, len(clean_last) + 1)]
				prefix_pattern_last = '|'.join([re.escape(p) for p in prefixes_last])
				cond[f'{prefix}.lastName'] = {'$regex': f'^({prefix_pattern_last})\.?$', '$options': 'i'}
				
		return cond

	or_conditions = []

	# 2. Build positional conditions for each spouse combination cleanly
	for spouse in spouses:
		spouse_first = spouse.get('firstName')
		spouse_last = spouse.get('lastName')

		# Combo 1: Target parent is index 0, Spouse is index 1
		combo1 = {}
		combo1.update(build_parent_query_dict('parents.0', parent_first, parent_last))
		combo1.update(build_parent_query_dict('parents.1', spouse_first, spouse_last))
		or_conditions.append(combo1)
		
		# Combo 2: Spouse is index 0, Target parent is index 1
		combo2 = {}
		combo2.update(build_parent_query_dict('parents.0', spouse_first, spouse_last))
		combo2.update(build_parent_query_dict('parents.1', parent_first, parent_last))
		or_conditions.append(combo2)

	# Fallback if no registered spouse exists
	if not or_conditions:
		or_conditions.append(build_parent_query_dict('parents.0', parent_first, parent_last))
		or_conditions.append(build_parent_query_dict('parents.1', parent_first, parent_last))

	# 3. Standard .find() query structure
	dbQuery = {
		'$or': or_conditions
	}
	print(dbQuery)

	results = collection.find(dbQuery).sort("person.birth.date", 1)
	
	response = []
	for child in results:
		child['_id'] = str(child['_id'])
		response.append(child)

	return {
		'results': response
	}

@app.get('/api/years/')
async def getYears():
	pipeline = [
		# 1. Filter out nulls and explicitly empty strings early to save processing
		{
			"$match": {
				"person.birth.date": {
					"$type": "string",
					"$ne": "" # Excludes empty strings
				}
			}
		},
		# 2. Extract the year safely using $convert
		{
			"$addFields": {
				"birthYear": {
					"$convert": {
						"input": {
							"$trim": { # Trims hidden whitespace before conversion
								"input": { 
									"$first": { "$split": ["$person.birth.date", "-"] } 
								}
							}
						},
						"to": "int",
						"onError": None, # If conversion fails (e.g., text instead of numbers), yield None instead of crashing
						"onNull": None
					}
				}
			}
		},
		# 3. Filter for valid years strictly within your 1700-1900 range
		# (Because malformed strings became None in Step 2, they will safely fail this match)
		{
			"$match": {
				"birthYear": {"$gte": 1700, "$lte": 1900}
			}
		},
		# 4. Group by the year and count the occurrences
		{
			"$group": {
				"_id": "$birthYear",
				"count": {"$sum": 1}
			}
		},
		# 5. Sort the results chronologically by year
		{
			"$sort": {
				"_id": 1
			}
		}
	]

	# Execute the aggregation
	results = list(collection.aggregate(pipeline))

	year_counts = {item['_id']: item['count'] for item in results}

	return year_counts

@app.get('/api/related_places/{placeId}')
async def getRelatedPlaces(placeId):
	pipeline = [
		# 1. Match: Find only the persons who have the target location in their history
		{
			"$match": {
				"residence_history.location_obj.id": int(placeId)
			}
		},
		# 2. Unwind: Deconstruct the residence_history array into separate documents 
		# so we can process each location individually
		{
			"$unwind": "$residence_history"
		},
		# 3. Match (Filter): Keep only the locations that are NOT the target location.
		# Also ensures we only look at entries that actually have a location_obj.
		{
			"$match": {
				"residence_history.location_obj": {"$exists": True, "$ne": None},
				"residence_history.location_obj.id": {"$ne": int(placeId)}
			}
		},
		# 4. Group: Group by the *other* location IDs. 
		# We grab the first instance of the location object's details and count how many people moved between these two places.
		{
			"$group": {
				"_id": "$residence_history.location_obj.id",
				"location_obj": {"$first": "$residence_history.location_obj"},
				"shared_people_count": {"$sum": 1}
			}
		},
		# 5. Sort: Order the results so the locations with the most shared people appear at the top
		{
			"$sort": {
				"shared_people_count": -1
			}
		}
	]

	# Execute the aggregation
	results = list(collection.aggregate(pipeline))

	return {
		'results': results
	}
