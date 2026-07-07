#python3 prepareName.py
#python3 createIds.py
#python3 addLinks.py
#python3 processLocations.py

mongosh thskra --eval "db.dropDatabase()"

for f in json/*.json; do
    mongoimport --db thskra --collection persons --file "$f" --jsonArray
done
