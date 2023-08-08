import vk_api
from dotenv import load_dotenv
import os
load_dotenv()

token = os.environ.get("TOKEN")

vk_session = vk_api.VkApi(token=token)

vk = vk_session.get_api()
# 153 /хабаровск
response = vk.users.search(city=1, age_from=25, age_to=40, count=1000, sex=1, offset=0)

for user in response['items']:
    print(user['first_name'], user['first_name'], user['last_name'], user['id'], user['is_closed'])
