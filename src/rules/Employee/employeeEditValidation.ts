import { z as zod } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})


const employeeEditvalidationSchema = toFormValidator(zod
    .object({
        first_name:
            zod
                .string({
                    required_error: i18n.global.t('validation.required'),
                })
                .min(1, i18n.global.t('validation.required')),
        last_name:
            zod
                .string({})
                .min(1, i18n.global.t('validation.required')),
        birth_date:
            zod
                .preprocess(
                    (input) => {
                        if (typeof input == "string" || input instanceof Date) return new Date(input)

                    },
                    zod.date({
                        required_error: i18n.global.t('validation.date.required_error'),
                        invalid_type_error: i18n.global.t('validation.date.invalid_type_error'),
                    }),
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
                    zod.string({ invalid_type_error: i18n.global.t('validation.required') })),
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
                        required_error: i18n.global.t('validation.date.required_error'),
                        invalid_type_error: i18n.global.t('validation.date.invalid_type_error'),
                    }),
                ),
        end_date:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$|^$/, i18n.global.t('validation.date.format'))
                        .optional()),
        basic_salary:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                    .min(1, i18n.global.t('validation.number.invalid_type_error')),
            ),
        nationality_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number(),
            ),

    }));
export {
    employeeEditvalidationSchema
}