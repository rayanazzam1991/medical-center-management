import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const userstatusvalidationSchema = toFormValidator(
    zod
        .object({
            name: zod
                .string({
                    required_error: 'This field is required',
                })
                .min(1, 'This field is required'),
        })

)
export {
    userstatusvalidationSchema
}