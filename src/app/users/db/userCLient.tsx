"use client"

import { userFromDbInterface } from "@/app/types/user"
import LikeStatusSetter from "./like_status_setter";
import { useState } from "react";

export default function Client({ user, images }: { user: userFromDbInterface; images: any[] }) {

    const [like_status, setLikeStatus] = useState(user.like_status);
    if (like_status === 0) return null
    return <>
        <div key={user.id} className="col-lg-3">
            <div className="card mb-4">
                <div className="card-header">
                    {user.fio}
                    {JSON.stringify([like_status,], null, 2)}
                </div>
                <div>{JSON.stringify(user.bdate)}</div>
                <div className="card-body">
                    <a href={`https://vk.com/id${user.link}`} target="_blank">
                        {images.map(image => <div key={image.id}>
                            <img src={image.name} alt="" style={{ width: "100%" }} />
                        </div>)}
                    </a>
                    {
                        (() => {
                            if (like_status === null) return <div className="d-flex mt-2">
                                <div className="me-2"><LikeStatusSetter status={1} user={user.id} callBack={() => {
                                    setLikeStatus(1);
                                }} /></div>
                                <div>
                                    <LikeStatusSetter status={0} user={user.id} callBack={() => {
                                        setLikeStatus(0);
                                    }} />
                                </div>

                            </div>
                            if (like_status === 0) return <>залупа</>
                            if (like_status === 1) return <>збс</>


                        })()
                    }
                </div>
            </div >
        </div>
    </>
}