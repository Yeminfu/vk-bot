import { db_connection } from "@/app/components/db"
import { userFromDbInterface } from "@/app/types/user";
import Paginator from "./pagination";

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

        <div className="my-2">{JSON.stringify({ total, pages: pages })}</div>
        <div className="row">
            {users.map((user, i) => <div key={user.id} className="col-3">
                <div className="card mb-4">
                    <div className="card-header">
                        {user.fio}
                    </div>
                    <div className="card-body">
                        <a href={`https://vk.com/id${user.link}`} target="_blank">
                            {images[i].map(image => <div key={image.id}>
                                <img src={image.name} alt="" style={{ width: "100%" }} />
                            </div>)}
                        </a>
                        <div className="d-flex mt-2 justify-content-between">
                            <div className="btn btn-sm btn-outline-success">like</div>
                            <div className="btn btn-sm btn-outline-danger">diss</div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
        <Paginator page={page} pages={pages} />
    </>

}

async function getUsersFromDb(limit: number, offset: number): Promise<userFromDbInterface[]> {
    return await new Promise(resolve => {
        db_connection.query(
            `SELECT * FROM users WHERE can_write_private_message = 1 AND (relation IS NULL OR relation IN (1,7,6,0) ) AND city = 'Хабаровск' LIMIT ${offset}, ${limit}`,
            function (err, res: any) {
                if (err) {
                    console.log('err #fjfjsJHn88', err);
                    resolve([]);
                }
                resolve(res);
            }
        )
    })
}

async function getTotalUsers(): Promise<number> {
    return await new Promise(resolve => {
        db_connection.query(
            `SELECT COUNT(*) AS count FROM users WHERE can_write_private_message = 1 AND (relation IS NULL OR relation IN (1,7,6,0) AND city = 'Хабаровск' )`,
            function (err, res: any) {
                if (err) {
                    console.log('err #fjfjsJHn88', err);
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