import csv, json

MAIN_FILE = "Fig1a_Synchrony_1901_2012.txt"
MAIN_PROPS = ["alt", "synchrony", "code", "numSamples", "tMann", "pRann", "colora"]
MAIN_TYPES = [float, float, int, float, str, int, float, float, str]

FILEB = "Fig1b_Synchrony_CHANGE.txt"
PROPSB = ["change", "colorb"]
TYPESB = [float, str]

FILEC = "Fig1c_Synchrony_Significance.txt"
PROPSC = ["significance", "colorc"]
TYPESC = [float, str]

def convert(func, value):
    try:
        return func(value)
    except:
        return value

def update(properties, code, extras):
    for key, [source, color] in extras.items():
        properties.update(source.get(code, { key: "NA", color: "NA" }))

def main():
    features = []

    firstline = False

    change = {}
    with open(FILEB) as inFile:
        reader = csv.reader(inFile, delimiter='\t')
        for row in reader:
            if not firstline:
                firstline = True
            else:
                converted = [convert(*d) for d in zip(TYPESB, row[3:])]
                change[row[2]] = { k: v for [k, v] in zip(PROPSB, converted) }

    firstline = False

    significance = {}
    with open(FILEC) as inFile:
        reader = csv.reader(inFile, delimiter='\t')
        for row in reader:
            if not firstline:
                firstline = True
            else:
                converted = [convert(*d) for d in zip(TYPESC, row[4:])]
                significance[row[2]] = { k: v for [k, v] in zip(PROPSC, converted) }

    extras = {
        "change": [change, "colorb"],
        "significance": [significance, "colorc"]
    }

    firstline = False

    with open(MAIN_FILE) as inFile:
        reader = csv.reader(inFile, delimiter='\t')

        for row in reader:
            if not firstline:
                firstline = True
            else:
                converted = [convert(*d) for d in zip(MAIN_TYPES, row)]
                feature = {
                    "properties": { k: v for [k, v] in zip(MAIN_PROPS, converted[2:]) },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [converted[1], converted[0]]
                    }
                }
                code = converted[4]
                update(feature["properties"], code, extras)

                features.append(feature)

    collection = {
        "type": "FeatureCollection",
        "features": features
    }

    with open("../geojson.json", "w") as outFile:
        json.dump(collection, outFile)

if __name__ == "__main__":
    main()
