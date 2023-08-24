import vk_api
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

access_token = os.environ.get("VK_TOKEN")
vk_session = vk_api.VkApi(token=access_token)
response = vk_session.method('wall.get', {'count': 100,'owner_id':-1})

if 'items' in response:
    items = response['items']
    for item in items:
        post_id = item['id']
        text = item['text']
        likes_count = item['likes']['count']
        date = item['date']
        dt = datetime.datetime.fromtimestamp(date)
        
        print(f"likes_count ID: {likes_count}")
        print(f"Post ID: {post_id}")
        print(f"dt: {dt}")
        print("---")
else:
    print("No news found.")