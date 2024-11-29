import os
import json
import csv
from itertools import chain

# 대회 이름
competition = input("대회 이름(띄어쓰기 꼭 지켜주세요) >> ")
competition = ''.join(segment.capitalize() for segment in competition.split())

# 필요한 절대경로 구하기
current_directory = os.getcwd()
path_competition = os.path.join(current_directory, 'competition', competition)
path_db = os.path.join(current_directory, 'DB')

# wcif JSON 파일 불러오기
with open(path_competition + '/wcif.json', 'r') as file_json:
    data_json = json.load(file_json)

# 1행(헤더) 생성
events = [element['id'] for element in data_json['events']]
prs = [event + 'Pr' for event in events]
scrambles = [event + 'Scr' for event in events]
header = [['name', 'nameKr', 'country', 'age', 'wcaId', 'wcaLiveId', 'KCCU'] + events + prs + scrambles]


# 참가자 수 계산
# persons에서 가공할 object 불러오기
num_competitors = 0
competitors = []
for competitor in data_json['persons']:
    if (competitor['registration'] is not None) and (competitor['registration']['isCompeting'] == True) and (competitor['registration']['status'] == "accepted"):
        competitors.append(competitor)
        num_competitors += 1

# 국문명 DB 불러오기
dict_nameKr = {}
with open(path_competition + '/nameKr.csv', 'r') as nameKr_DB:
    reader = csv.DictReader(nameKr_DB)
    for row in reader:
        dict_nameKr[row['wcaUserId']] = row['nameKr']

# 정회원 DB 불러오기
with open(path_db + '/kccuWcaId.csv', 'r') as kccu_DB:
    kccu = csv.reader(kccu_DB)
    kccu = list(chain.from_iterable(list(kccu)))

# ISO DB 불러오기
dict_iso = {}
with open(path_db + '/ISO.csv', 'r') as iso_DB:
    reader = csv.DictReader(iso_DB)
    for row in reader:
        dict_iso[row['iso2']] = row['id']

# csv 파일에 작성할 데이터 틀 생성
data_csv = header + [[] for __ in range(num_competitors)]

# object 별로 가공하여 한 행씩 제작
for idx, competitor in enumerate(competitors):
    idx += 1

    # name
    data_csv[idx].append(competitor['name'])

    # nameKr
    wcaUserId = str(competitor['wcaUserId'])
    data_csv[idx].append(dict_nameKr[wcaUserId])

    # country
    iso = competitor['countryIso2']
    data_csv[idx].append(dict_iso[iso])

    # age
    currentYear = int(competition[-4:])
    birthdate = competitor['birthdate']
    birthyear = int(birthdate[:4])
    age = currentYear - birthyear + 1
    data_csv[idx].append(age)

    # wcaId
    data_csv[idx].append(competitor['wcaId'] if competitor['wcaId'] else None)

    # wcaLiveId
    data_csv[idx].append(competitor['registrantId'])

    # KCCU
    data_csv[idx].append(1 if competitor['wcaId'] in kccu else 0)

    # events
    for event in events:
        data_csv[idx].append(1 if event in competitor['registration']['eventIds'] else 0)

    # prs
    dict_pr = {}
    list_pr = competitor['personalBests']
    for pr in list_pr:
        if pr['eventId'] in ['333bf', '333mbf', '444bf', '555bf']:
            if pr['type'] == 'single':
                dict_pr[pr['eventId']] = pr['best']
        else:
            if pr['type'] == 'average':
                dict_pr[pr['eventId']] = pr['best']
    keys_dict_pr = list(dict_pr.keys())

    for event in events:
        if event in keys_dict_pr:
            if event == '333mbf':
                data_csv[idx].append(99 - int(str(dict_pr[event])[:2]))
            else:
                data_csv[idx].append(dict_pr[event])
        else:
            data_csv[idx].append(None)

    # scrambles
    # 블라인드 종목은 NNN 데이터로 들어감
    dict_corresponding_scramble = {'333bf': '333', '333mbf': '333', '444bf': '444', '555bf': '555'}
    keys_dict_corresponding_scramble = list(dict_corresponding_scramble.keys())
    for event in events:
        if event in keys_dict_corresponding_scramble:
            if dict_corresponding_scramble[event] in keys_dict_pr:
                data_csv[idx].append(dict_pr[dict_corresponding_scramble[event]])
            else:
                data_csv[idx].append(None)
        else:
            if event in keys_dict_pr:
                data_csv[idx].append(dict_pr[event])
            else:
                data_csv[idx].append(None)

with open(os.path.join(path_competition, 'grouping_DB.csv'), 'w', newline='') as file_csv:
    writer = csv.writer(file_csv)
    writer.writerows(data_csv)

