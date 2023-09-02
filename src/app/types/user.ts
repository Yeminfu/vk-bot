export interface userFromDbInterface {
  "id": number,
  "fio": string
  "link": number
  "friends": number
  "is_closed": number,
  "relation": number,
  "city": null,
  "can_write_private_message": number
  "like_status": number
}


export interface UserFromVKUnterface {
  id: number,
  photo_200: string,
  can_write_private_message: 0 | 1,
  first_name: string,
  last_name: string,
  can_access_closed: boolean,
  is_closed: boolean
  bdate?: string
  online: any
  relation: number
  city?: {
    id: number;
    title: string
  }
}


export interface UsersConfigInterface {
  url: string
  method: string
  access_token: string
  version: string
  count: number
  q: string
  city: number
  sex: number
  offset: number
  fields: string
}
