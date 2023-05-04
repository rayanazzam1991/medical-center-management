import { z as zod } from 'zod'
import { toFormValidator } from '@vee-validate/zod'
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

const medicalinfoAddValidationSchema = toFormValidator(zod
    .object({
        blood_type:
            zod
                .preprocess(
                    val => val === undefined ? "" : val,
                    zod.string({})
                        .optional()),

        allergic:
            zod
                .preprocess(
                    val => val === undefined ? "" : val,
                    zod.string({})
                        .optional()),
        chronic_diseases:
            zod
                .preprocess(
                    val => val === undefined ? "" : val,
                    zod.string({})
                        .optional()),
        infectious_diseases:
            zod
                .preprocess(
                    val => val === undefined ? "" : val,
                    zod.string({})
                        .optional()),
        smoking: zod.number().optional(),
        any_other_info: zod.string({
            invalid_type_error: i18n.global.t('validation.text.invalid_type_error'),
        }).optional()
    }));

export {
    medicalinfoAddValidationSchema
}