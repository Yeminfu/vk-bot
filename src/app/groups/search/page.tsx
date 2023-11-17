import Link from "next/link";
import Pagination from "./pagination";

export default async function Page(a: any) {
    const page = Number(a?.searchParams?.page) - 1;

    const count = 10;

    const response: any = await getGroups({
        url: "https://api.vk.com",
        method: "groups.search",
        version: '5.131',
        access_token: String(process.env.VK_TOKEN),
        count: count,
        offset: count * page,
        query: "прикол"
    }).then((x: any) => x.json());

    if (response?.error) {
        console.log("err #kfjsdfhyU", response.error);
        return null;
    }

    const groups: GroupInterface[] = response.response.items;

    const combinedGroups: {
        group: GroupInterface
        wall: WallInterface[]
        members: number[]
    }[] = [];


    for (let index = 0; index < groups.length; index++) {
        const group = groups[index];

        const membersResponse = await getMembers({ url: "https://api.vk.com", method: "groups.getMembers", version: '5.131', access_token: String(process.env.VK_TOKEN), group_id: group.id }).then(x => x.json());
        const members = membersResponse?.response?.items || [];

        const wallResponse = await getWall({ url: "https://api.vk.com", method: "wall.get", version: '5.131', access_token: String(process.env.VK_TOKEN), owner_id: group.id, count: 3 }).then(x => x.json());
        const wall = wallResponse?.response?.items || [];

        combinedGroups.push({
            group,
            members,
            wall,
        })

        await new Promise(resolve => setTimeout(() => {
            resolve(1)
        }, 200))

    }

    return <>
        <h1>Группы</h1>
        <Pagination />
        <div className="row flex-wrap">
            {combinedGroups.map(({ group, members, wall }) => <div key={group.id} className="col-2">
                <div className="card">
                    <div className="card-header">{group.name} ({group.id})</div>
                    <div className="card-body">
                        <Link href={`https://vk.com/public${group.id}`}><img src={group.photo_200} className="mw-100" /></Link>
                        <div>
                            участников: {members.length}
                        </div>
                        <div>
                            постов: {wall.length}
                        </div>
                        <div>
                            {wall
                                .map(post => {
                                    const { reposts, comments, likes, views } = post;
                                    return <>
                                        <pre>
                                            {JSON.stringify(
                                                {
                                                    reposts: post.reposts.count,
                                                    comments: post.comments.count,
                                                    likes: post.likes.count,
                                                    views: post.views?.count,
                                                },
                                                null, 2
                                            )}
                                        </pre>
                                        {/* {post.reposts.count} */}
                                        {/* {post.comments.count} */}
                                        {/* {post.likes.count} */}
                                        {/* {post.views.count} */}
                                        {/* reposts, comments, likes, views */}
                                    </>;
                                })
                            }
                            {/* <pre>{JSON.stringify(wall, null, 2)}</pre> */}
                        </div>
                        {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                    </div>
                </div>
            </div>)
            }
        </div>
    </>
}


interface GroupInterface {
    "id": number,
    "name": string,
    "is_closed": number,
    "type": string,
    "photo_50": string,
    "photo_100": string,
    "photo_200": string
}



interface GroupsConfigInterface {
    url: string,
    method: "groups.search"
    access_token: string,
    version: string,
    count: number,
    query: string,
    offset: number,
}

async function getGroups(parameters: GroupsConfigInterface) {
    const { url, method, access_token, version, count, query, offset } = parameters;
    const parametersObj = {
        access_token: access_token,
        v: version,
        q: query,
        count: count,
        offset: offset,
    }
    const parametersString = Object.entries(parametersObj).map(x => x[0] + "=" + x[1]).join("&");

    const apiUrlNew = `${url}/method/${method}?${parametersString}`;

    return fetch(apiUrlNew);
}



interface MembersCongigInterface {
    url: string,
    method: "groups.getMembers"
    access_token: string,
    version: string,
    group_id: number,
}

async function getMembers(parameters: MembersCongigInterface) {
    const { url, method, access_token, version, group_id } = parameters;
    const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}&q=&group_id=${group_id}`;
    return fetch(apiUrl);
}



interface WallCongigInterface {
    url: string,
    method: "wall.get"
    access_token: string,
    version: string,
    owner_id: number,
    count: number,
}

interface WallInterface {
    date: number,
    reposts: {
        count: number,
    },
    comments: {
        count: number,
    },
    views: {
        count: number,
    },
    likes: {
        count: number,
        user_likes: 0,
    },
    text: string
}

async function getWall(parameters: WallCongigInterface) {
    const { url, method, access_token, version, owner_id, count } = parameters;
    const apiUrl = `${url}/method/${method}?access_token=${access_token}&v=${version}&owner_id=-${owner_id}&count=${count}`;
    return fetch(apiUrl);
}
