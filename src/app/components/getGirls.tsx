"use client"
import names from "@/app/names.json.js"



import { createEvent, createStore } from "effector"
import { useStore } from "effector-react";

const setLog = createEvent<any>()
const $log = createStore<any>([])
    .on(setLog, (a, b) => {
        console.log({ a, b });
        return [
            b,
            ...a,
        ];
    });

export default function GetGirls() {
    const log = useStore($log);

    return <>
        <h1>get girls</h1>
        {log.length} из {names.length}
        <button
            onClick={async () => {

                for (let index = 0; index < names.length; index++) {
                    const name = names[index];
                    const data = await fetch(
                        "/api/getAllGirlsFromCity",
                        {
                            method: "POST",
                            body: JSON.stringify({ name })
                        }
                    ).then(x => x.json());
                    setLog(`${name} ${data.appended}`);
                }
                alert('собрали всех')
            }}
        >go</button>
        <pre>{JSON.stringify(log, null, 2)}</pre>
    </>
}