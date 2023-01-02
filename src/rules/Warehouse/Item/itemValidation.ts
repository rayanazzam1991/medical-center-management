import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const itemvalidationSchema = toFormValidator(zod
    .object({
        name: zod
            .string({
                required_error: "This field is required",
            })
            .min(1, "This field is required"),
        description: zod
            .preprocess(
                val => val == undefined ? "" : val,
                zod.string({})
                    .optional()),
        price:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(0, "Please enter a valid number"),
            ),
        cost:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(0, "Please enter a valid number"),
            ),
        quantity:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(0, "Please enter a valid number"),
            ),
        min_quantity:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+|^$/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({})
                        .optional()),
        category_id: zod
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
    itemvalidationSchema
}