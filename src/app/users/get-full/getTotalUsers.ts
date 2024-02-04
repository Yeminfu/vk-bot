import { db_connection } from "@/app/components/db";

export default async function getTotalUsers(): Promise<number> {
  return db_connection
    .promise()
    .query(
      `SELECT COUNT(*) AS count FROM users 
            WHERE 
                can_write_private_message = 1 
                AND (relation IS NULL OR relation IN (1,7,6,0) ) 
                AND city = 'Хабаровск'
                AND (like_status IS NULL)`
    )
    .then(([users]: any) => users.pop().count)
    .catch((error: any) => {
      console.error("#0duu", error);
      return 0;
    });
}
