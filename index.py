
import vk_api
from dotenv import load_dotenv
import os
import mysql.connector 

load_dotenv()

vk_token = os.environ.get("VK_TOKEN")


vk_session = vk_api.VkApi(token=vk_token)

vk = vk_session.get_api()
# 153 /хабаровск
response = vk.users.search(city=1, count=4, sex=1, offset=0, fields='photo_200,relation')


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
    first_name = user['first_name']
    last_name = user['last_name']
    fio = f'{first_name} {last_name}'
    # print(index, user['first_name'], user['last_name'], user['id'], user['is_closed'], photo_url, relation)
    
    user_sql = "INSERT INTO users (fio,link, is_closed, relation ) VALUES (%s, %s, %s, %s)"
    user_val = (fio, user['id'], user['is_closed'], relation)
    mycursor.execute(user_sql, user_val)
    mydb.commit()
    index += 1
    print(index)
    user_id = mycursor.lastrowid
    photo_sql = "INSERT INTO photos (name, type, user) VALUES (%s, %s, %s)"
    photo_val = (photo_url, "avatar", user_id)
    mycursor.execute(photo_sql, photo_val)
    mydb.commit()
