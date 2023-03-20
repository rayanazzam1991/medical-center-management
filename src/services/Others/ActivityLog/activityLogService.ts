
import { ActivityLog, ActivityLogSearchFilter } from "/@src/models/Others/ActivityLog/activityLog"
import { useActivityLog } from "/@src/stores/Others/ActivityLog/activityLogStore"
import { Pagination } from "/@src/utils/response"




export async function getActivityLogList(searchFilter: ActivityLogSearchFilter) {
    const activityLog = useActivityLog()
    await activityLog.getActivityLogStore(searchFilter)
    var activitiesLog: ActivityLog[] = activityLog.activitiesLog
    var pagination: Pagination = activityLog.pagination
    var success: boolean = activityLog.success ?? false
    var error_code: string = activityLog.error_code ?? ''
    var message: string = activityLog.message ?? ''

    return { activitiesLog, pagination, success, error_code, message }

}

