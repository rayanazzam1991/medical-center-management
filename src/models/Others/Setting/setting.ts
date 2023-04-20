import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { BaseConsts } from "/@src/utils/consts/base"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface Setting {
    id?: number
    key: string
    value: string
}
export const defaultSetting: Setting = {
    id: undefined,
    key: '',
    value: '',
}
class UnjustifiedHoursRoundConsts {
    static readonly NO_ROUND = 1;
    static readonly NEAREST_15_MIN = 2;
    static readonly NEAREST_30_MIN = 3;
    static readonly NEAREST_60_MIN = 4;

    static readonly ROUNDING_OPTIONS = [this.NO_ROUND, this.NEAREST_15_MIN, this.NEAREST_30_MIN, this.NEAREST_60_MIN]


    public static getRoundingOptionName(option: number) {
        if (option == this.NO_ROUND)
            return i18n.global.t('unjustified_hours_rounding_options.no_round')
        else if (option == this.NEAREST_15_MIN)
            return i18n.global.t('unjustified_hours_rounding_options.nearest_15')
        else if (option == this.NEAREST_30_MIN)
            return i18n.global.t('unjustified_hours_rounding_options.nearest_30')
        else if (option == this.NEAREST_60_MIN)
            return i18n.global.t('unjustified_hours_rounding_options.nearest_60')
        else return ''
    }
}

export { UnjustifiedHoursRoundConsts }
class ReservationsTimeSlotsConsts {
    static readonly TEN_MINS = '10';
    static readonly FIFTEEN_MINS = '15';
    static readonly TWENTY_MINS = '20';
    static readonly THIRTY_MINS = '30';
    static readonly FORTY_MINS = '40';
    static readonly FIFTY_MINS = '50';
    static readonly SIXTY_MINS = '60';

    static readonly OPTIONS = [this.TEN_MINS, this.FIFTEEN_MINS, this.TWENTY_MINS, this.THIRTY_MINS, this.FORTY_MINS, this.FIFTY_MINS, this.SIXTY_MINS];


    public static getOptionName(option: string) {
        return i18n.global.t('reservations_time_slot_options.full_name', { value: option })
    }
}

export { ReservationsTimeSlotsConsts }