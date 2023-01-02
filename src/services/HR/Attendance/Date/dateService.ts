import { City, CitySearchFilter, defaultCity } from "/@src/models/Others/City/city"
import { getSettingsFromStorage } from "/@src/services/Others/Setting/settingService"
import { useCity } from "/@src/stores/Others/City/cityStore"
import { Pagination } from "/@src/utils/response"



// export async function getWeekDays() {
//     const settings = getSettingsFromStorage()
//     const startOfWeek = settings.find((setting) => setting.key == 'start_of_week')?.value
//     const

//     var city: City = await cityResponse.addCityStore(cityData) ?? defaultCity
//     var success: boolean = cityResponse.success ?? false
//     var error_code: string = cityResponse.error_code ?? ''
//     var message: string = cityResponse.message ?? ''
//     return { success, error_code, message, city }

// }

