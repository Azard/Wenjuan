import csv
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client.wenjuan
user = db.user

with open('student_list.csv', newline='', encoding='utf-8') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    index = 0
    for row in spamreader:
        index += 1
        if index == 1:
            continue
        data = {
            'name': row[0],
            'student': row[1],
            'id': row[4]
        }
        if data['student'][0] == '5':
            data['role'] = 'b'
        else:
            data['role'] = 's'
        user.insert_one(data)
        print(index)