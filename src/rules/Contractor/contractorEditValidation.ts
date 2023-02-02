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

const contractorEditvalidationSchema = toFormValidator(zod
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
                    val => val === undefined ? "" : val,
                    zod.string({
                        errorMap: (issue, { defaultError }) => ({
                            message: issue.code === "invalid_date" ? i18n.global.t('validation.date.format') : i18n.global.t('validation.required'),
                        }),
                    })
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, i18n.global.t('validation.date.format'))

                ),
        phone_number:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                        .min(9, i18n.global.t('validation.number.invalid_type_error')),
                ),
        address:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({ required_error: i18n.global.t('validation.required') })
                        .min(1, i18n.global.t('validation.required')),
                ),
        city_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        speciality_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        room_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        user_status_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        starting_date:
            zod
                .preprocess(
                    (input) => {
                        if (typeof input == "string" || input instanceof Date) return new Date(input)

                    },
                    zod.date({
                        errorMap: (issue, { defaultError }) => ({
                            message: issue.code === "invalid_date" ? i18n.global.t('validation.date.format') : i18n.global.t('validation.required'),
                        }),
                    }),
                ),
        end_date:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$|^$/, i18n.global.t('validation.date.format'))
                        .optional()),
        payment_percentage:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                        .min(1, i18n.global.t('validation.number.payment_percentage')).max(100, i18n.global.t('validation.number.payment_percentage')),
                ),

    }));
export {
    contractorEditvalidationSchema
}