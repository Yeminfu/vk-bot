import getUsers from "@/app/components/getUsers";
import { NextResponse } from "next/server";
import { UserFromVKUnterface } from "@/app/types/user";
import { db_connection } from "@/app/components/db";

export async function POST(res: any) {

    const { name } = await res.json()

    let offset = 0;


    let appended = 0;

    pages: while (true) {

        await new Promise(resolve => { setTimeout(() => { resolve(true); }, 200); })

        const conf = config({
            name: name,
            city: 153,
            count: 1000,
            offset: offset
        });

        const usersResponse = await getUsers(
            conf
        )
            .then(x => x.json());

        if (!usersResponse?.response) {
            console.log('errr #fksdfjvj4', usersResponse);
            break pages;
        } else {
            const { response: { count, items } } = usersResponse;

            appended += await saveUsers(items);
            offset += 999;
            if (offset > 3000) break pages;
        }
    }


    return NextResponse.json({
        success: true,
        appended
    });
}


function config(params: { name: string, city: number, count: number, offset: number }) {
    return {
        url: "https://api.vk.com",
        method: "users.search",
        access_token: String(process.env.VK_TOKEN),
        version: '5.131',
        q: params.name,
        city: params.city,
        count: params.count,
        sex: 1,
        offset: params.offset,
        fields: ["photo_200", "relation", "can_write_private_message", "bdate", "city"].join(","),
    };
}



async function saveUsers(users: UserFromVKUnterface[]): Promise<number> {
    let appended = 0;
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        const newUser: number | null = await new Promise(resolve => {
            db_connection.query(
                "INSERT INTO users (fio, link, friends, is_closed, relation, can_write_private_message, city ) VALUES (?,?,?,?,?,?,?)",
                [`${user.first_name} ${user.last_name}`, user.id, "", user.is_closed, user.relation, user.can_write_private_message, user.city ? user.city.title : null],
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
    return appended;
}