import { UsersConfigInterface } from "../types/user";

export default async function getUsers(searchUSersParameters: UsersConfigInterface) {
    const { url, method, access_token, version, count, ...more } = searchUSersParameters;
    const moreString = Object.entries(more).filter(item => item[1]).map(([key, value]) => key + "=" + value).join("&");
    const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}&q=&count=${count}&${moreString}`;
    return fetch(apiUrl);
}