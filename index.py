
import vk_api
from dotenv import load_dotenv
import os
import mysql.connector 

load_dotenv()

vk_token = os.environ.get("VK_TOKEN")


vk_session = vk_api.VkApi(token=vk_token)

vk = vk_session.get_api()
# 153 /хабаровск
response = vk.users.search(city=1, age_from=25, age_to=40, count=1000, sex=1, offset=0, fields='photo_200,relation')


mydb = mysql.connector.connect(
  host=os.environ.get("DB_HOST"),
  user=os.environ.get("DB_USER"),
  password=os.environ.get("DB_PASSWORD"),
  database=os.environ.get("DB_DATABASE")
)

mycursor = mydb.cursor()
  
index = 0

for user in response['items']:
    photo_url = user['photo_200']
    relation = user.get('relation', None)
    print(index, user['first_name'], user['last_name'], user['id'], user['is_closed'], photo_url, relation)
    sql = "INSERT INTO users (fio,link) VALUES (%s, %s)"
    val = (user['first_name'], user['id'])
    mycursor.execute(sql, val)
    mydb.commit()
    index += 1