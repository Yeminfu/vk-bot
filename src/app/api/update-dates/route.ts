import { db_connection } from "@/app/components/db";
import getUsersData from "@/app/users/get-full/getUsersData";
import getUsersFromDb from "@/app/users/get-full/getUsersFromDb";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { per_page, offset } = await request.json();
  console.log("body", { per_page, offset });

  const users = await getUsersFromDb(per_page, offset);
  const links = users.map((user) => user.link);
  console.log("links", links.length);
  await updateListOfUsers(links);

  return NextResponse.json({
    success: null,
  });
}

async function updateListOfUsers(usersArr: number[]) {
  // console.log('updateListOfUsers', usersArr.length);

  const newUsersData = await getUsersData(usersArr);

  for (let index = 0; index < newUsersData.length; index++) {
    const user = newUsersData[index];
    const { last_seen, bdate } = user;
    // if (!last_seen?.time) {
    //   console.log("user err", user);
    // }
    const lastSeenFormatted =
      last_seen?.time &&
      dayjs(last_seen.time * 1000).format("YYYY-MM-DD HH:mm:ss");
    await updateUser(user.id, lastSeenFormatted, bdate);
  }
}

async function updateUser(user_link: number, last_seen_date: any, bdate: any) {
  // console.log(
  //     `UPDATE users SET last_seen_date = "${last_seen_date}", bdate = "${bdate}" WHERE link = ${user_link}`
  // );

  return db_connection
    .promise()
    .query("UPDATE users SET last_seen_date = ?, bdate = ? WHERE link = ?", [
      last_seen_date,
      bdate,
      user_link,
    ])
    .then(([res]: any) => {
      // console.log('res #fkff994', res);
    })
    .catch((error) => {
      console.error("error #ff884h", error);
    });
}
