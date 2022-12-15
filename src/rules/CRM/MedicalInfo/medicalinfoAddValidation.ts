import { z as zod } from 'zod'
import { toFormValidator } from '@vee-validate/zod'

const medicalinfoAddValidationSchema = toFormValidator(zod
    .object({
        blood_type:
            zod
                .string({

                }).optional()
        ,

        allergic:
            zod
                .string({
                })
                .optional(),
        chronic_diseases:
            zod
                .string({
                })
                .optional(),
        infectious_diseases:
            zod
                .string({
                })
                .optional(),
        smoking: zod.number().optional(),
        any_other_info: zod.string({
            invalid_type_error: "Invalid Type",
        }).optional()
    }));

export {
    medicalinfoAddValidationSchema
}