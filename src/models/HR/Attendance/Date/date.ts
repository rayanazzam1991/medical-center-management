import { BaseConsts } from "/@src/utils/consts/base"

class DateConsts extends BaseConsts {
    static readonly SUNDAY = 0;
    static readonly MONDAY = 1;
    static readonly TUESDAY = 2;
    static readonly WEDNESDAY = 3;
    static readonly THURSDAY = 4;
    static readonly FRIDAY = 5;
    static readonly SATURDAY = 6;

    public static getDayOfWeekNumber ( day_name : string) {
       const _day_name = day_name.toUpperCase()
        if(_day_name == 'SUNDAY')
            return 0  ; 
            if(_day_name == 'MONDAY')
            return 1  ; 
            if(_day_name == 'TUESDAY')
            return 2  ; 
            if(_day_name == 'WEDNESDAY')
            return 3  ; 
            if(_day_name == 'THURSDAY')
            return 4  ; 
            if(_day_name == 'FRIDAY')
            return 5  ; 
            if(_day_name == 'SATURDAY')
            return 6  ; 
            else return -1 ;
    }


}

export {DateConsts}