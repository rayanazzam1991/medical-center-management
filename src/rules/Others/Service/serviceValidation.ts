import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const servicevalidationSchema = toFormValidator(zod
    .object({
        name: zod
            .string({
                required_error: "This field is required",
            })
            .min(1, "This field is required"),
        description: zod.string().optional(),
        duration_minutes:   
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(0, "Please enter a valid number"),
            ),

        service_price:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(1, "Please enter a valid number"),
            ),
        status: zod
            .number({ required_error: "Please choose one" }),
    }));
export {
    servicevalidationSchema
}