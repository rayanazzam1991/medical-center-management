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

const addQuantityvalidationSchema = toFormValidator(zod
    .object({
        note: zod
            .preprocess(
                val => val == undefined ? "" : val,
                zod.string({})
                    .optional()),
        invoice_number: zod
            .preprocess(
                val => val == undefined ? "" : val,
                zod.string({})
                    .optional()),
        add_item_cost:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                    .min(1, i18n.global.t('validation.number.invalid_type_error')),
            ),
        item_quantity:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                    .min(1, i18n.global.t('validation.number.invalid_type_error')),
            ),
        sub_category_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        item_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
        status: zod
        .number({ required_error: i18n.global.t('validation.redio.required') }),
        supplier_account: zod
        .preprocess(
            (input) => {
                const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                return processed.success ? processed.data : input;
            },
            zod
                .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                .min(1, i18n.global.t('validation.required')),
        ),

        cash_account: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),
            total_amount:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                    .min(1, i18n.global.t('validation.number.invalid_type_error')),

            ),
            currency_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.required') })
                    .min(1, i18n.global.t('validation.required')),
            ),

        currency_rate:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                    .min(1, i18n.global.t('validation.number.invalid_type_error')),

            ),
        date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({
                        errorMap: (issue, { defaultError }) => ({
                            message: issue.code === "invalid_date" ? i18n.global.t('validation.date.format') : i18n.global.t('validation.required'),
                        }),
                    })
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, i18n.global.t('validation.date.format'))

                ),

                remain_amount:
                zod.preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                        .min(0, i18n.global.t('validation.number.invalid_type_error')),

                ),
                cash_amount:
                zod.preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: i18n.global.t('validation.required'), invalid_type_error: i18n.global.t('validation.number.invalid_type_error') })
                        .min(1, i18n.global.t('validation.number.invalid_type_error')),

                ),

    }));
export {
    addQuantityvalidationSchema
}
