interface UserInterface {
  id: number;
  bdate: string | null;
  last_seen: { platform: number; time: number };
  first_name: string;
  last_name: string;
  // can_access_closed: true,
  is_closed: boolean;
}

export default async function getUsersData(
  usersIds: number[]
): Promise<UserInterface[]> {
  // console.log('usersIds', usersIds);

  const access_token =
    "vk1.a.tZ0qwIN585IP41uPJkOZ9AIgIxBGUuR7utg0RuLBvNW3ITPTCXYYa_5psc8RMtrThccgLCWk-kwUeWbrpMtTv0SSYsDg-FiGIEyhiBic6cY_eurjLv4yRDYHS_sPT89LOkfneln9ZQ8O422-tjS2EIVNhDiD6zYsVsZLZQ-GVksWpbG2gbwatBskpQWMRkOSZj35no3HfT35ENaNsHS2fQ";
  const qs = `https://api.vk.com/method/users.get?user_ids=${usersIds}&fields=bdate,last_seen&access_token=${access_token}&v=5.199`;

  return fetch(qs)
    .then((response) => response.json())
    .then((data) => {
      return data.response;
      const user = data.response[0];
      const bdate = user.bdate;
      console.log("bdate", bdate);
    })
    .catch((error) => {
      return null;
      console.error("err #fkfds9", error);
    });
}
