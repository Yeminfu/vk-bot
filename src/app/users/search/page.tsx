import Link from "next/link";
import Filter from "./filter";
import { db_connection } from "@/app/components/db";
import { UserFromVKUnterface } from "@/app/types/user";
import getUsers from "@/app/components/getUsers";

export interface SearchUsersInterface {
  city: number
  sex: number
  age_from: string
  age_to: string
  offset: number
  q: string
}


export default async function Page(props: { searchParams: SearchUsersInterface }) {

  const searchUSersParameters = {
    url: "https://api.vk.com",
    method: "users.search",
    access_token: String(process.env.VK_TOKEN),
    version: '5.131',
    q: props.searchParams.q,
    city: props.searchParams.city,
    count: 1000,
    sex: props.searchParams.sex,
    offset: Number(props.searchParams.offset),
    fields: ["photo_200", "relation", "can_write_private_message", "bdate", "city"].join(","),
    age_from: props.searchParams.age_from,
    age_to: props.searchParams.age_to,
  };

  const response = await getUsers(searchUSersParameters).then(x => x.json());

  const cities = await getCities(searchCitiesParameters)
    .then(x => x.json()).then(x => x.response.items);

  if (!response?.response) {
    return <>
      <h1>Пользователи </h1>
      <Filter cities={cities} searchParams={props.searchParams} />
    </>
  }
  const { count, items: users }: { count: number, items: UserFromVKUnterface[] } = response.response;


  let appended = 0;

  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const newUser: number | null = await new Promise(resolve => {
      db_connection.query(
        "INSERT INTO users (fio, link, friends, is_closed, relation, can_write_private_message ) VALUES (?,?,?,?,?,?)",
        [`${user.first_name} ${user.last_name}`, user.id, "", user.is_closed, user.relation, user.can_write_private_message],
        function (err, res: any) {
          if (err) {
            resolve(null);
            return;
          }
          resolve(res.insertId)
        }
      )
    });
    if (newUser) {
      appended++;
      db_connection.query(
        "INSERT INTO photos (name,type,user  ) VALUES (?,?,?)",
        [user.photo_200, 'avatar', newUser],
        function (err, res: any) {
          if (err) {
            console.log('err #jdjf4jJc6', err);
          }
        }
      )
    };

  }



  return <>
    <h1>users.search {count} (добавлено в бд {appended})</h1>
    <Filter cities={cities} searchParams={props.searchParams} />
    <pre>{JSON.stringify(searchUSersParameters, null, 2)}</pre>
    {!users.length ? null : <table>
      <tbody>
        {users.map(user => <tr key={user.id}>
          <td><Link href={`https://vk.com/id${user.id}`}>{user.id}</Link></td>
          <td>{user.first_name}</td>
          <td>{user.last_name}</td>
          <td>{(() => {
            const relations: any = {
              "1": "не женат/не замужем",
              "2": "есть друг/есть подруга",
              "3": "помолвлен/помолвлена",
              "4": "женат/замужем",
              "5": "всё сложно",
              "6": "в активном поиске",
              "7": "влюблён/влюблена",
              "8": "в гражданском браке",
              "0": "не указано",
            }

            return relations[user.relation] || "хз"
          })()}</td>
          <td>{user.bdate}</td>
          <td>{user.can_write_private_message ? "открыто" : "закрыто"}</td>
          <td><img src={user.photo_200} /></td>
          <td><pre>{JSON.stringify(user, null, 2)}</pre></td>
        </tr>)}
      </tbody>
    </table>}
    <pre>{JSON.stringify([users], null, 2)}</pre>

  </>
}



const searchCitiesParameters = {
  url: "https://api.vk.com",
  method: "database.getCities",
  access_token: String(process.env.VK_TOKEN),
  version: '5.131',
};

async function getCities(searchCitiesParameters: {
  url: string; method: string; access_token: string; version: string;
}) {
  const { url, method, access_token, version, ...more } = searchCitiesParameters;
  const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}`;
  return fetch(apiUrl);
}