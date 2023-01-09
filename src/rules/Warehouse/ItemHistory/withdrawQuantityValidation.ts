import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const withdrawQuantityvalidationSchema = toFormValidator(zod
    .object({
        note: zod
            .preprocess(
                val => val == undefined ? "" : val,
                zod.string({})
                    .optional()),
        withdraw_item_price:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(1, "Please enter a valid number"),
            ),
        item_quantity:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(1, "Please enter a valid number")
            ),
        item_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
        user_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
        status: zod
            .number({ required_error: "Please choose one" }),
    }));
export {
    withdrawQuantityvalidationSchema
}