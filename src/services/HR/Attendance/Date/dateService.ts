import { DateConsts, DaysNamePerMonth, DaysPerMonth, defaultDaysPerMonth } from "/@src/models/HR/Attendance/Date/date";
import { Setting } from "/@src/models/Others/Setting/setting";
import { getSettingsFromStorage, getSettings } from "/@src/services/Others/Setting/settingService";
import { useDate } from "/@src/stores/HR/Attendance/Date/dateStore";



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


export async function getDaysPerMonth(year: number) {
    const dateResponse = useDate()
    let daysPerMonth: DaysPerMonth[] = await dateResponse.getDaysPerMonthStore(year) ?? []
    let success: boolean = dateResponse.success ?? false
    let error_code: string = dateResponse.error_code ?? ''
    let message: string = dateResponse.message ?? ''
    return { success, error_code, message, daysPerMonth }

}
export async function getDaysNamePerMonth(year: number, month: number) {
    const dateResponse = useDate()
    let daysName: DaysNamePerMonth[] = await dateResponse.getDaysNamePerMonthStore(year, month) ?? []
    let success: boolean = dateResponse.success ?? false
    let error_code: string = dateResponse.error_code ?? ''
    let message: string = dateResponse.message ?? ''
    return { success, error_code, message, daysName }

}




