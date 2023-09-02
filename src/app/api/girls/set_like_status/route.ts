import { db_connection } from "@/app/components/db";
import { NextResponse } from "next/server";

export async function POST(response: any) {
    const { like_status, id } = await response.json();

    const likeStatusIdUpdated = await new Promise(resolve => {
        db_connection.query(
            "UPDATE users SET like_status = ? WHERE id = ?",
            [like_status, id],
            function (err: any, res: any) {
                resolve(res?.changedRows || 0)
            }
        )
    })
    return NextResponse.json({
        success: true,
        likeStatusIdUpdated
    });
}
