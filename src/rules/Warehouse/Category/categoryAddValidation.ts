import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const categoryvalidationSchema = toFormValidator(zod
    .object({
        name: zod
            .string({
                required_error: "This field is required",
            })
            .min(1, "This field is required"),
        status: zod
            .number({ required_error: "Please choose one" }),
        parent_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+|^$/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod.number()
                    .optional(),
            ),
    }));
export {
    categoryvalidationSchema
}
