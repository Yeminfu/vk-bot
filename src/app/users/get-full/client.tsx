"use client"
export default function Client(props: {
    per_page: number, total: number, pages: number
}) {
    return <>

        <button
            onClick={() => {
                go(props.per_page, props.total, props.pages)

            }}
        >btn</button>

        <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
}


async function go(per_page: number, total: number, pages: number) {
    console.log('go');
    for (let page = 1; page <= pages; page++) {
        console.log('page', `${page} из ${pages}`);

        const offset = (page - 1) * per_page;

        // const total = await getTotalUsers();
        // const users = await getUsersFromDb(per_page, offset);
        // const links = users.map(user => user.link);
        // console.log(links.pop());

        // const element = array[index];
        // console.log('page', page);
        // await updateListOfUsers(links);
        await fetch(
            "/api/update-dates"
            , {
                method: "POST",
                body: JSON.stringify({
                    per_page, offset
                }),
            }
        )
        // if (page > 2)
        //     break;
    }

}