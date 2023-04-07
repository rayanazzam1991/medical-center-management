import { defaultUser, User } from "../User/user"



export interface ActivityLog {
  id:number
  log_name: string
  description: string
  subject_type: string
  subject_type_view:string
  subject_id:number
  event: string
  createdBy: User
}

export const defaultActivityLog :ActivityLog ={
id:0,
log_name: '',
description: '',
subject_type: '',
subject_type_view: '',
subject_id: 0,
event: '',
createdBy: defaultUser
}


export interface ActivityLogSearchFilter {
  subject_type_view?: string
  user_id? : number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}


export const defaultActivityLogSearchFilter: ActivityLogSearchFilter = {
  subject_type_view: undefined,
  user_id : undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}
