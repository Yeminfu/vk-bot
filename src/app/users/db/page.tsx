import { db_connection } from "@/app/components/db"
import { userFromDbInterface } from "@/app/types/user";

export default async function Page() {
    const users = await getUsersFromDb();

    const images = await Promise.all(
        users.map(async user => getImagesFromDb(user.id))
    );
    console.log(images);

    return <>
        <h1>users</h1>
        <div className="row">
            {users.map((user, i) => <div key={user.id} className="col-2">
                <div className="card mb-4">
                    <div className="card-header">
                        {user.fio}
                    </div>
                    <div className="card-body">

                        <pre>{JSON.stringify(user, null, 2)}</pre>
                        {images[i].map(image => <div key={image.id}>
                            <img src={image.name} alt="" />
                        </div>)}
                    </div>
                </div>
            </div>)}

        </div>
        {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </>
}

async function getUsersFromDb(): Promise<userFromDbInterface[]> {
    return await new Promise(resolve => {
        db_connection.query(
            "SELECT * FROM users LIMIT 10",
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