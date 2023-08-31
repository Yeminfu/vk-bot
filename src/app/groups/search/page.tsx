export default async function Page() {

    const groups = await getGroups({
        url: "https://api.vk.com",
        method: "groups.search",
        version: '5.131',
        access_token: String(process.env.VK_TOKEN),
        count: 1
    }).then(x => x.json());


    return <>
        groups
        <pre>{JSON.stringify(groups, null, 2)}</pre>
    </>
}



interface GroupsConfigInterface {
    url: string,
    method: "groups.search"
    access_token: string,
    version: string,
    count: number,
}

async function getGroups(parameters: GroupsConfigInterface) {
    const { url, method, access_token, version, count } = parameters;
    const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}&q=&count=${count}`;
    return fetch(apiUrl);
}
