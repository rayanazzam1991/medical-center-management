import { AxiosInstance } from "axios"
import { ActivityLogSearchFilter } from "/@src/models/Others/ActivityLog/activityLog"
import { CustomResponseCollection } from "/@src/utils/response"



export async function getActivityLogListApi(
  api: AxiosInstance,
  searchFilter: ActivityLogSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('log/getList', {
    params: searchFilter,
  })
  return { response }
}
