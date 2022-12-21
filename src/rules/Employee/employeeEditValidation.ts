import { z as zod } from 'zod';
import { toFormValidator } from '@vee-validate/zod';


const employeeEditvalidationSchema = toFormValidator(zod
    .object({
        first_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        last_name:
            zod
                .string({})
                .min(1, "This field is required"),
        birth_date:
            zod
                .preprocess(
                    (input) => {
                        if (typeof input == "string" || input instanceof Date) return new Date(input)

                    },
                    zod.date({
                        required_error: "Please select a date and time",
                        invalid_type_error: "That's not a date!",
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
                        .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                        .min(9, "Please enter a valid number"),
                ),
        address:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({ invalid_type_error: 'This field is required' })),
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
                    .min(1, "This field is required"),
            ),
        starting_date:
            zod
                .preprocess(
                    (input) => {
                        if (typeof input == "string" || input instanceof Date) return new Date(input)

                    },
                    zod.date({
                        required_error: "Please select a date and time",
                        invalid_type_error: "That's not a date!",
                    }),
                ),
        end_date:
            zod
                .preprocess(
                    val => val == undefined ? "" : val,
                    zod.string({})
                        .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$|^$/, 'Date must be a vaild date format YYYY-MM-DD')
                        .optional()),
        basic_salary:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid salary number" })
                    .min(0, "Please enter a valid salary number"),
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