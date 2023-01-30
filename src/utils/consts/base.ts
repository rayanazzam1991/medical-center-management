import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})
export class BaseConsts {
    static readonly ACTIVE = 1
    static readonly INACTIVE = 0
    static readonly TRUE = 1
    static readonly FALSE = 0

    public static showStatusName(status: number): string {
        if (status === BaseConsts.ACTIVE)
            return i18n.global.t('status.active')
        if (status === BaseConsts.INACTIVE)
            return i18n.global.t('status.inactive')
        return ''
    }
    public static showBoolean(value: number | undefined): string {
        if (value === BaseConsts.TRUE)
            return i18n.global.t('boolean.true')

        if (value === BaseConsts.FALSE)
            return i18n.global.t('boolean.false')
        if (value === undefined)
            return ''

        return ''
    }
}
