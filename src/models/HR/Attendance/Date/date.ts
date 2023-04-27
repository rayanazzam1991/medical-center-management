import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { BaseConsts } from "/@src/utils/consts/base"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface DaysPerMonth {
    year?: string
    month?: number
    number_of_days?: number
}
export interface DaysNamePerMonth {
    day: number
    day_name: string
}
export interface CurrentWeekStartAndEndDate {
    start_date_of_week: string
    end_date_of_week: string
}
export const defaultDaysPerMonth: DaysPerMonth = {
    year: undefined,
    month: undefined,
    number_of_days: undefined,
}
export const defaultDaysNamePerMonth: DaysNamePerMonth = {
    day: 1,
    day_name: '',
}
export const defaultCurrentWeekStartAndEndDate: CurrentWeekStartAndEndDate = {
    end_date_of_week: '',
    start_date_of_week: '',

}

class DateConsts extends BaseConsts {
    static readonly SUNDAY = 0;
    static readonly MONDAY = 1;
    static readonly TUESDAY = 2;
    static readonly WEDNESDAY = 3;
    static readonly THURSDAY = 4;
    static readonly FRIDAY = 5;
    static readonly SATURDAY = 6;
    static readonly WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    static readonly WEEK_DAYS_NAMES_ABBR = [
        i18n.global.t('dates.days_abbr_2.su'),
        i18n.global.t('dates.days_abbr_2.mo'),
        i18n.global.t('dates.days_abbr_2.tu'),
        i18n.global.t('dates.days_abbr_2.we'),
        i18n.global.t('dates.days_abbr_2.th'),
        i18n.global.t('dates.days_abbr_2.fr'),
        i18n.global.t('dates.days_abbr_2.sa'),
    ]
    public static getDayOfWeekNumber(day_name: string) {
        const dayName = day_name.toUpperCase()
        if (dayName == 'SUNDAY')
            return 0;
        if (dayName == 'MONDAY')
            return 1;
        if (dayName == 'TUESDAY')
            return 2;
        if (dayName == 'WEDNESDAY')
            return 3;
        if (dayName == 'THURSDAY')
            return 4;
        if (dayName == 'FRIDAY')
            return 5;
        if (dayName == 'SATURDAY')
            return 6;
        else return 0;
    }

    static readonly JANUARY = 1
    static readonly FEBRUARY = 2
    static readonly MARCH = 3
    static readonly APRIL = 4
    static readonly MAY = 5
    static readonly JUNE = 6
    static readonly JULY = 7
    static readonly AUGUST = 8
    static readonly SPETEMBER = 9
    static readonly OCTOBER = 10
    static readonly NOVEMBER = 11
    static readonly DECEMBER = 12
    static readonly MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public static getMonthNumber(month_name: string) {
        const MonthName = month_name.toUpperCase()
        if (MonthName == 'JANUARY')
            return 1;
        if (MonthName == 'FEBRUARY')
            return 2;
        if (MonthName == 'MARCH')
            return 3;
        if (MonthName == 'APRIL')
            return 4;
        if (MonthName == 'MAY')
            return 5;
        if (MonthName == 'JUNE')
            return 6;
        if (MonthName == 'JULY')
            return 7;
        if (MonthName == 'AUGUST')
            return 8;
        if (MonthName == 'SPETEMBER')
            return 9;
        if (MonthName == 'OCTOBER')
            return 10;
        if (MonthName == 'NOVEMBER')
            return 11;
        if (MonthName == 'DECEMBER')
            return 12;
        else return -1;
    }


}

export { DateConsts }