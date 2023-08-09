import vk_api
from dotenv import load_dotenv
import os
import mysql.connector
import json
import time

load_dotenv()

vk_token = os.environ.get("VK_TOKEN")


vk_session = vk_api.VkApi(token=vk_token)

vk = vk_session.get_api()

mydb = mysql.connector.connect(
  host=os.environ.get("DB_HOST"),
  user=os.environ.get("DB_USER"),
  password=os.environ.get("DB_PASSWORD"),
  database=os.environ.get("DB_DATABASE")
)

mycursor = mydb.cursor()





with open('names.json', 'r') as file:
    data = json.load(file)
    for name in data:
      print(name)
      response = vk.users.search(q=name,city=153, count=1000, sex=1, offset=0, fields='photo_200,relation,can_write_private_message')
      for user in response['items']:
          can_write_private_message = user['can_write_private_message']
          photo_url = user['photo_200']
          relation = user.get('relation', None)
          first_name = user['first_name']
          last_name = user['last_name']
          fio = f'{first_name} {last_name}'

          try:
            user_sql = "INSERT INTO users (fio,link, is_closed, relation, can_write_private_message ) VALUES (%s, %s, %s, %s, %s)"
            user_val = (fio, user['id'], user['is_closed'], relation, can_write_private_message)
            mycursor.execute(user_sql, user_val)
            mydb.commit()
            user_id = mycursor.lastrowid
            # print(user_id)
            photo_sql = "INSERT INTO photos (name, type, user) VALUES (%s, %s, %s)"
            photo_val = (photo_url, "avatar", user_id)
            mycursor.execute(photo_sql, photo_val)
            mydb.commit()  
          except mysql.connector.Error as error:
            # print("Error: {}".format(error))
            a=0
      time.sleep(0.5)

