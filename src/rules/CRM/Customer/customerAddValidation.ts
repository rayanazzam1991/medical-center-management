import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const customerAddvalidationSchema = toFormValidator(zod
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
                .optional(),
        birth_date:
            zod
                .preprocess(
                    val => val === "" ? undefined : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date must be a vaild date format YYYY-MM-DD')
                        .optional()),
        gender: zod.string(),
        phone_number:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/^\d{9}$/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid phone number" })
                    ,
                ),
        address:
            zod
                .string({
                    required_error: "This field is required",
                })
                .optional(),

        city_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
        room_id:
            zod
                .preprocess(
                    val => val == "" ? undefined : val,
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
                    .min(1, "This field is required"),
            ),
        emergency_contact_name:
            zod
                .string({
                    invalid_type_error: "Please enter a text"
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
                        .number({ invalid_type_error: "Please enter a valid number" })
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
