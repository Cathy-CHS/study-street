import csv
import json

with open('database.csv', mode='r', encoding='utf-8') as infile:
    reader = csv.reader(infile)
    header = next(reader)
    key = "0"
    with open('databse'+key+'.txt', mode='w') as outfile:
        writer = csv.writer(outfile)        
        outDoc = {}
        for cols in reader:
            outDoc[cols[0]] = {col_name: col for col_name, col in zip(header, cols)}
        json.dump(outDoc, outfile, ensure_ascii= False, indent=2)
        # outfile.write(',\n')