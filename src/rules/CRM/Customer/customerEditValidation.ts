import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const customerEditvalidationSchema = toFormValidator(zod
    .object({
        first_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        last_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        birth_date:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$|^$/, 'Date must be a vaild date format YYYY-MM-DD')
                        .optional()),
        phone_number:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                        .min(9, "Please enter a valid number"),
                ),
        address:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .optional()),
        gender: zod.string().optional(),
        city_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .optional(),
            ),
        room_id:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                        .optional()),
        user_status_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .optional(),
            ),
        emergency_contact_name:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod
                        .string({
                            invalid_type_error: "Please enter a text"
                        })
                        .optional()),

        emergency_contact_phone:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .regex(/\d+|$^/, 'Please enter a valid number')
                        .optional()),
        customer_group_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
            ),

    }));

export {
    customerEditvalidationSchema
}