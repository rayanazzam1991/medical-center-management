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
    }));
export {
    addQuantityvalidationSchema
}