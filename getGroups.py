import vk_api
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

access_token = os.environ.get("VK_TOKEN")
vk_session = vk_api.VkApi(token=access_token)
groups_response = vk_session.method('groups.search', {'q':"",'count':1 })

if groups_response:
    groups = groups_response['items']
    for group in groups:
        group_id = group['id']
        print(group)

        try:
            members_response = vk_session.method('groups.getMembers', {'group_id':group_id,'sort':6})
            members_count=members_response['count']
            print([group_id,members_count])
        except Exception:
            print("Error: {}".format(Exception))
else:
    print("Failed to retrieve the news feed")