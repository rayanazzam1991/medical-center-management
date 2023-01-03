import { DateConsts } from "/@src/models/HR/Attendance/Date/date";
import { City, CitySearchFilter, defaultCity } from "/@src/models/Others/City/city"
import { Setting } from "/@src/models/Others/Setting/setting";
import { getSettings, getSettingsFromStorage } from "/@src/services/Others/Setting/settingService"
import { useCity } from "/@src/stores/Others/City/cityStore"
import { Pagination } from "/@src/utils/response"



export async function getWeekDays() {
    let settings: Setting[];
    settings = getSettingsFromStorage()
    if (settings.length == 0) {
        const settingsResponse = await getSettings()
        settings = settingsResponse.settings
    }
    const startOfWeek = settings.find((setting) => setting.key == 'start_of_week')?.value
    const days = DateConsts.WEEK_DAYS;
    const firstDayIndex = days.findIndex((day) => day == startOfWeek);
    let newWeek = [];
    for (let i = firstDayIndex; i < days.length; i++) {
        newWeek.push(days[i]);

    }
    if (newWeek.length < 7) {
        for (let i = 0; i < days.length; i++) {
            newWeek.push(days[i]);
            if (newWeek.length == 7)
                break
        }
    }


    return newWeek

}



