import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const contractorEditServicesValidationSchema = toFormValidator(
    zod.record(
        zod.string().startsWith('service_price_'),
        zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ invalid_type_error: "Please enter a valid number", required_error: 'This field is required' })
                    .min(1, 'Please enter a valid price'),

            )))


export {
    contractorEditServicesValidationSchema
}