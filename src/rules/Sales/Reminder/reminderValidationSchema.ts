import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

const reminderValidationSchema = toFormValidator(zod
    .object({
        note:
            zod
                .string({
                    required_error: i18n.global.t('validation.required'),
                })
                .min(1, i18n.global.t('validation.required')),

        date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({ required_error: i18n.global.t('validation.required') })
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, i18n.global.t('validation.date.format'))
                ),
    }));
export {
    reminderValidationSchema
}
