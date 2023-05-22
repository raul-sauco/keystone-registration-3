import json


def compare_json_keys(file1, file2):
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        data1 = json.load(f1)
        data2 = json.load(f2)

    diff_keys = set(data1.keys()) ^ set(data2.keys())

    lines = []
    for key in diff_keys:
        if key in data1:
            lines.append(
                f"Key '{key}' is present in {file1} but not in {file2}. Line: {data1[key]}")
        else:
            lines.append(
                f"Key '{key}' is present in {file2} but not in {file1}. Line: {data2[key]}")

    return lines


# Usage
file1 = 'src/assets/i18n/en.json'
file2 = 'src/assets/i18n/zh-cmn-Hans.json'
result = compare_json_keys(file1, file2)

if result:
    print("Keys with differences:")
    for line in result:
        print(line)
else:
    print("No key differences found.")
