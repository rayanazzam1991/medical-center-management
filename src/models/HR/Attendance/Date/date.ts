import { BaseConsts } from "/@src/utils/consts/base"

export interface DaysPerMonth {
    year?: string
    month?: number
    number_of_days?: number
}
export interface DaysNamePerMonth {
    day: number
    day_name: string
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

class DateConsts extends BaseConsts {
    static readonly SUNDAY = 0;
    static readonly MONDAY = 1;
    static readonly TUESDAY = 2;
    static readonly WEDNESDAY = 3;
    static readonly THURSDAY = 4;
    static readonly FRIDAY = 5;
    static readonly SATURDAY = 6;
    static readonly WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday', 'Saturday'];
    public static getDayOfWeekNumber(day_name: string) {
        const _day_name = day_name.toUpperCase()
        if (_day_name == 'SUNDAY')
            return 0;
        if (_day_name == 'MONDAY')
            return 1;
        if (_day_name == 'TUESDAY')
            return 2;
        if (_day_name == 'WEDNESDAY')
            return 3;
        if (_day_name == 'THURSDAY')
            return 4;
        if (_day_name == 'FRIDAY')
            return 5;
        if (_day_name == 'SATURDAY')
            return 6;
        else return -1;
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


}

export { DateConsts }