#!/bin/bash

SOURCE="bok1.pdf"
START_PAGE=7
END_PDF=266
CHUNK_SIZE=20

for (( i=$START_PAGE; i<=$END_PDF; i+=$CHUNK_SIZE )); do
    # Calculate the end of the current chunk
    TOP=$(( i + CHUNK_SIZE - 1 ))
    
    # Ensure we don't exceed the total page count
    if [ $TOP -gt $END_PDF ]; then
        TOP=$END_PDF
    fi
    
    # Generate the chunk
    OUTPUT="${SOURCE}_${i}_to_${TOP}.pdf"
    echo "Creating $OUTPUT..."
    pdftk "$SOURCE" cat $i-$TOP output "$OUTPUT"
done