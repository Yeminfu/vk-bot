import Link from "next/link";
import Filter from "./filter";

export interface SearchUsersInterface {
  city: number
  sex: number
  age_from: string
}


export default async function Page(props: { searchParams: SearchUsersInterface }) {

  const searchUSersParameters = {
    url: "https://api.vk.com",
    method: "users.search",
    access_token: String(process.env.VK_TOKEN),
    version: '5.131',
    q: "",
    city: props.searchParams.city,
    count: 100,
    sex: props.searchParams.sex,
    offset: 0,
    fields: ["photo_200", "relation", "can_write_private_message", "bdate", "photos"].join(","),
    age_from: props.searchParams.age_from,
  };

  const { response } = await getUsers(searchUSersParameters).then(x => x.json());

  const cities = await getCities(searchCitiesParameters)
    .then(x => x.json()).then(x => x.response.items);

  if (!response) return <>
    <h1>Пользователи </h1>
    <Filter cities={cities} searchParams={props.searchParams} />
  </>


  const { count, items: users }: { count: number, items: UserUnterface[] } = response;


  return <>
    <h1>Пользователи {count}</h1>
    <Filter cities={cities} searchParams={props.searchParams} />
    <pre>{JSON.stringify(searchUSersParameters, null, 2)}</pre>
    {!users.length ? null : <table>
      <tbody>
        {users.map(user => <tr key={user.id}>
          <td> <Link href={`https://vk.com/id${user.id}`}>{user.id}</Link>  </td>
          <td>{user.first_name}</td>
          <td>{user.last_name}</td>
          <td>{user.bdate}</td>
          <td>{user.is_closed ? "закрыто" : "открыто"}</td>
          <td><img src={user.photo_200} /></td>
          <td><pre>{JSON.stringify(user, null, 2)}</pre></td>
        </tr>)}
      </tbody>
    </table>}
    <pre>{JSON.stringify([users], null, 2)}</pre>

  </>
}

interface UserUnterface {
  id: number,
  photo_200: string,
  can_write_private_message: 0 | 1,
  // track_code: 86e836f41XBVawr0aGGAQzgZKjaPCkMBfvNB_BfL-mmIjvpJRH-yGUE7W549adUWCaTxsD8LKw948EH8Ga2IAA,
  first_name: string,
  last_name: string,
  can_access_closed: boolean,
  is_closed: boolean
  bdate?: string
  online: any
}


interface UsersConfigInterface {
  url: string
  method: string
  access_token: string
  version: string
  count: number
  q: string
  city: number
  sex: number
  offset: number
  fields: string
}

async function getUsers(searchUSersParameters: UsersConfigInterface) {
  const { url, method, access_token, version, count, ...more } = searchUSersParameters;
  const moreString = Object.entries(more).map(([key, value]) => key + "=" + value).join("&");
  const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}&q=&count=${count}&${moreString}`;
  return fetch(apiUrl);
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