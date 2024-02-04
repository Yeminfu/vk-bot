// import { db_connection } from "@/app/components/db";
// import { userFromDbInterface } from "@/app/types/user";
import getTotalUsers from "./getTotalUsers";
// import getUsersFromDb from "./getUsersFromDb";
// import dayjs from "dayjs";
// import getUsersData from "./getUsersData";
import Client from "./client";

export default async function Page(props: any) {

    // const page = (Number(props?.searchParams?.page)) || 1;
    // const per_page = 100;
    // const offset = (page - 1) * 10;

    const per_page = 100;
    const total = await getTotalUsers();
    const pages = Math.ceil(Number(total) / per_page);


    return <Client per_page={per_page} total={total} pages={pages}/>

    // for (let page = 1; page <= pages; page++) {
    //     console.log('page', `${page} из ${pages}`);

    //     const offset = (page - 1) * 10;

    //     // const total = await getTotalUsers();
    //     const users = await getUsersFromDb(per_page, offset);
    //     const links = users.map(user => user.link);
    //     // console.log(links.pop());

    //     // const element = array[index];
    //     // console.log('page', page);
    //     await updateListOfUsers(links);
    //     // if (page > 2)
    //     //     break;
    // }


    // return;



    // return <>
    //     получить поные данные пользователей
    //     {/*<pre>{JSON.stringify(newUsersData, null, 2)}</pre> */}
    //     {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    // </>
}



