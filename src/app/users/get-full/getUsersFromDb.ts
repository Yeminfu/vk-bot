import { db_connection } from "@/app/components/db";
import { userFromDbInterface } from "@/app/types/user";

export default async function getUsersFromDb(
  limit: number,
  offset: number
): Promise<userFromDbInterface[]> {
  return db_connection
    .promise()
    .query(
      `SELECT * FROM users 
        WHERE 
            can_write_private_message = 1 
            AND (relation IS NULL OR relation IN (1,7,6,0) ) 
            AND city = 'Хабаровск'
            AND (like_status IS NULL)
        LIMIT ?, ?`,
      [offset, limit]
    )
    .then(([x]: any) => x)
    .catch((error: any) => {
      console.error("#mf9f7", error);
      return [];
    });
}
