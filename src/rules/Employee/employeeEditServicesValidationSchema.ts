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

const employeeEditServicesValidationSchema = toFormValidator(
    // @ts-ignore
    zod.record(
        zod.string().startsWith('service_id'),
        zod.preprocess(
            (input) => {
                const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                return processed.success ? processed.data : input;
            },
            zod
                .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                .min(0, i18n.global.t('validation.number.invalid_type_error')),
        ),
    ))

export {
    employeeEditServicesValidationSchema
}