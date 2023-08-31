import vk_api
from dotenv import load_dotenv
import os
import datetime
import mysql.connector


load_dotenv()

access_token = os.environ.get("VK_TOKEN")
vk_session = vk_api.VkApi(token=access_token)
groups_response = vk_session.method('groups.search', {'q':"",'count':1 ,'market':1})

mydb = mysql.connector.connect(
  host=os.environ.get("DB_HOST"),
  user=os.environ.get("DB_USER"),
  password=os.environ.get("DB_PASSWORD"),
  database="vk_groups_parsing"
)

mycursor = mydb.cursor()

if groups_response:
    groups = groups_response['items']
    for group in groups:
        id = group['id']
        name = group['name']
        is_closed = group['is_closed']
        type = group['type']
        photo_200 = group['photo_200']

        try:
            members_response = vk_session.method('groups.getMembers', {'group_id':id,'sort':6})
            members_count=members_response['count']
            print({
                'id':id,
                'name':name,
                'members_count':members_count,
                'is_closed':is_closed,
                'type':type,
                'photo_200':photo_200,
            })
            # user_sql = "INSERT INTO `groups` (group_name, members_count, is_closed, group_type, vk_id, photo_200) VALUES (%s, %s, %s, %s, %s, %s)"
            # user_val = (name, members_count, is_closed, type, id, photo_200)
            # mycursor.execute(user_sql, user_val)
            # mydb.commit()
        except Exception:
            print("Error: {}".format(Exception))
else:
    print("Failed to retrieve the news feed")