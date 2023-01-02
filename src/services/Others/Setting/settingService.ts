import { Setting } from "/@src/models/Others/Setting/setting"
import { useSetting } from "/@src/stores/Others/Setting/settingStore"
import { Pagination } from "/@src/utils/response"


export async function getSettings() {
    const settingResponse = useSetting()
    await settingResponse.getSettingsStore()
    var settings: Setting[] = settingResponse.settings
    var pagination: Pagination = settingResponse.pagination
    var success: boolean = settingResponse.success ?? false
    var error_code: string = settingResponse.error_code ?? ''
    var message: string = settingResponse.message ?? ''
    return { success, error_code, message, settings, pagination }

}

export function getSettingsFromStorage() {
    const settingResponse = useSetting()
    const settings : Setting[] = settingResponse.getSettings()
    return settings 

}
