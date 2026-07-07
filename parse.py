import sys
import os
import time

from google import genai
from google.genai import errors


client = genai.Client(api_key='AIzaSyBHRQSp_1Ch491QUlqS0zrrm7RtFeKd2Ag')

def processFile(fileName):
	print('Uploading file '+fileName)

	pdfFile = client.files.upload(file=fileName)

	print('Processing file')

	while pdfFile.state.name == 'PROCESSING':
		time.sleep(5)

	print('File processed')

	prompt = '''
	System Role: You are an expert paleographer and genealogist specializing in early 20th-century Icelandic records. Your task is to transcribe handwritten registry pages into a precise, machine-readable JSON format.

	Extraction Rules:
	Person Data:
	Birth/Death: Extract as an object with three fields: original_string (full text), date (yyyy-mm-dd), and place (the base form of the location, removing Icelandic adpositions like í, á, að, frá).
	Status: Text found in parentheses immediately following a name belongs in a status field.
	Unmarried: If the abbreviation "Óg." is present, set a boolean field unmarried: true.
	Spouse & Parents:
	Spouse: Object containing original_string, date (yyyy-mm-dd), name, and status. Spouse string can include multiple spouses if the person re-married. In those cases each name is preceded with a number, remove that number from the names and add as separate objects. Add the full spouse string as spouse_original_string.
	Parents: An array of names. Split the string by the word "og" and add each name to a name field in an object. More information on parents could be found within parentheses, add those to a notes field in the parents object, then add the whole parents string to parent_original_string field.
	Residence History:
	Create a residence array of objects.
	Fields: original_string, year_or_period, age, status, location, and note.
	Location Logic: Attempt to find the base form of the place name (e.g., "Eyri" instead of "á Eyri"). Include suffixes after commas (e.g., "Eyri, Fj.").
	Parentheses Logic: If a number is in parentheses at the end of a residence entry, it is the age. If it is text, it is a note.
	Notes & References:
	Look for numbered notes at the bottom (e.g., "1)").
	Store these in a root-level notes array.
	If a data item in the main entry contains a reference number (e.g., "1"), add a note_ref: 1 field to that specific JSON object.

	Constraints:
	Do not translate any names, statuses, or notes. Keep them in the original Icelandic.
	Output ONLY valid JSON. No conversational text.

	{
	"person": {
		"name": "",
		"status": "",
		"unmarried": false,
		"birth": { "original_string": "", "date": "yyyy-mm-dd", "place": "" },
		"death": { "original_string": "", "date": "yyyy-mm-dd", "place": "" }
	},
	"spouse": [
		{ "name": "", "date": "yyyy-mm-dd", "status": "" }
	],
	"spouse_original_string": "",
	"parents": [
		{
		"name": "Parent 1",
		"note": ""
		},
		{
		"name": "Parent 2",
		"note": ""
		}
	],
	"parents_original_string": "",
	"residence_history": [
		{
		"original_string": "",
		"year": "",
		"age": null,
		"status": "",
		"location": "",
		"note": "",
		"note_ref": null
		}
	],
	"notes": {
		"1": "Note text here"
	}
	}'''

	try:
		response = client.models.generate_content(
			model="gemini-3-flash-preview",
			contents=[pdfFile, prompt]
		)
		file = open(fileName.replace('pdf/', 'json/')+'.json', 'w')
		file.write(response.text.replace('```json', '').replace('```', ''))

		print('Response written to '+fileName.replace('pdf/', '')+'.json')

		newFileName = fileName.replace('pdf/', 'done/')
		os.rename(fileName, newFileName)
		print(fileName+' moved to '+newFileName)

		time.sleep(10)

	except errors.ServerError as e:
		if e.code  == 503 and e.status == 'UNAVAILABLE':
			print('503 unavailable error. Wait two minutes...')
			time.sleep(120)

			print('Try again')
			processFile(fileName)


for file in os.listdir('pdf'):
	if file.endswith('.pdf'):
		processFile('pdf/'+file)