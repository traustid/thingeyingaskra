#python3 prepareName.py
#python3 createIds.py
#python3 addLinks.py
#python3 processLocations.py

docker exec -it mongodb_container mongo thskra --eval "db.dropDatabase()"

for f in json/*.json; do
    docker exec -i mongodb_container mongoimport --db thskra --collection persons --jsonArray < "$f"
done
