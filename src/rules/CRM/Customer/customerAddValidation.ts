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

const customerAddvalidationSchema = toFormValidator(zod
    .object({
        first_name:
            zod
                .string({
                    required_error: i18n.global.t('validation.required'),
                })
                .min(1, i18n.global.t('validation.required')),
        last_name:
            zod
                .string({
                    required_error: i18n.global.t('validation.required'),
                })
                .min(1, i18n.global.t('validation.required')),
        birth_date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, i18n.global.t('validation.date.format'))
                        .optional()),
        gender: zod.string().optional(),
        phone_number:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/^\d{9}$/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.phone_number') })
                    ,
                ),
        address:
            zod
                .string({
                    required_error: i18n.global.t('validation.required'),
                })
                .optional(),

        city_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+|^$/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
            ),
        user_status_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
                    .optional(),
            ),
        emergency_contact_name:
            zod
                .string({
                    invalid_type_error: i18n.global.t('validation.text.invalid_type_error')
                })
                .optional(),
        emergency_contact_phone:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+|$^/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                        .optional(),
                ),
        customer_group_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+|$^/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
                    .optional(),
            ),

    }));

export {
    customerAddvalidationSchema
}
