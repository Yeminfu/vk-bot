import vk_api
from dotenv import load_dotenv
import os
load_dotenv()

token = os.environ.get("TOKEN")

vk_session = vk_api.VkApi(token=token)

vk = vk_session.get_api()

response = vk.users.search(q='Ольга', city=1, age_from=25, age_to=40)
print(response)