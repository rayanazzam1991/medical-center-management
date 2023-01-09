import { z as zod } from 'zod';
import { toFormValidator } from '@vee-validate/zod';


const employeeNumberEditValidationSchema = toFormValidator(zod
    .object({
        employee_number:
            zod.preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                    .min(1, "Please enter a valid number"),
            ),
    }));

export {
    employeeNumberEditValidationSchema
}