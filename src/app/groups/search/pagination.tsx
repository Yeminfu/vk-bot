"use client"

import { useRouter } from "next/navigation";

export default function Pagination() {
    const route = useRouter();

    return <>
        {Array.from({ length: 100 }, (_, i) => <button
            onClick={() => {
                const { pathname } = window.location;
                // const qs = Object.entries(data).filter(v => !!v[1]).map(v => `${v[0]}=${v[1]}`).join("&");
                const newLink = `${pathname}?page=${i + 1}`;
                route.push(newLink);
            }}
        >{i + 1}</button>)}
    </>

}