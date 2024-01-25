import { db_connection } from "@/app/components/db"
import { userFromDbInterface } from "@/app/types/user";
import Paginator from "./pagination";
import Client from "./userCLient";

export default async function Page(props: { searchParams: { page: string } }) {

    const page = (Number(props?.searchParams?.page)) || 1;
    const per_page = 100;
    const offset = (page - 1) * 10;


    const total = await getTotalUsers();
    const pages = Math.ceil(total / per_page);

    const users = await getUsersFromDb(per_page, offset);

    const images = await Promise.all(
        users.map(async user => getImagesFromDb(user.id))
    );

    return <>
        <h1>users</h1>

        <Paginator page={page} pages={pages} />
        <div className="my-2">{JSON.stringify({ total, pages: pages })}</div>
        <div className="row">
            {users.map((user, i) =>
                <Client key={user.id} user={user} images={images[i]} />
            )}
        </div>
        <Paginator page={page} pages={pages} />
    </>

}

async function getUsersFromDb(limit: number, offset: number): Promise<userFromDbInterface[]> {
    console.log({ limit, offset });
    return db_connection.promise().query(`SELECT * FROM users 
        WHERE 
            can_write_private_message = 1 
            AND (relation IS NULL OR relation IN (1,7,6,0) ) 
            AND city = 'Хабаровск'
            AND (like_status IS NULL)
        LIMIT ?, ?`,
        [offset, limit]
    )
        .then(([x]: any) => x)
        .catch((error: any) => {
            console.error('#mf9f7', error);
            return [];
        })
}

async function getTotalUsers(): Promise<number> {
    return await new Promise(resolve => {
        db_connection.query(
            `SELECT COUNT(*) AS count FROM users 
                WHERE 
                    can_write_private_message = 1 
                    AND (relation IS NULL OR relation IN (1,7,6,0) 
                    AND city = 'Хабаровск' )
                    AND (like_status IS NULL OR like_status = 1)`,
            function (err, res: any) {
                if (err) {
                    console.log('err #fjfjd3Hn88', err);
                    resolve(0);
                }
                resolve(res.pop().count);
            }
        )
    })
}

async function getImagesFromDb(user_id: number): Promise<ImageFromDbInterface[]> {
    return await new Promise(resolve => {
        db_connection.query(
            "SELECT * FROM photos WHERE user = ? ",
            [user_id],
            function (err, res: any) {
                if (err) {
                    console.log('err #opopsJHn88', err);
                    resolve([]);
                }
                resolve(res);
            }
        )
    })
}


interface ImageFromDbInterface {
    id: number
    name: string
    type: "avatar"
    user: number
}