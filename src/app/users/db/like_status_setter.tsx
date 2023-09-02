"use client"
export default function LikeStatusSetter({ status, user, callBack }: { status: number, user: number, callBack: any }) {
    return <div className={`btn btn-sm btn-outline-${status ? "success" : "danger"}`}
        onClick={() => {
            fetch(
                "/api/girls/set_like_status",
                {
                    method: "POST",
                    body: JSON.stringify({ like_status: status, id: user })
                }
            )
                .then(x => x.json())
                .then(x => {
                    callBack(x.likeStatusIdUpdated);
                })
        }}
    >
        {status ? "like" : "diss"}
    </div>
}