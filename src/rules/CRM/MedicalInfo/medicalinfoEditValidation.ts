import { z as zod } from 'zod'
import { toFormValidator } from '@vee-validate/zod'

const medicalinfoEditValidationSchema = toFormValidator(zod
    .object({
        blood_type:
            zod
                .string({

                }).optional()
        ,

        allergic:
            zod
                .any().optional(),
        chronic_diseases:
            zod
                .any().optional(),
        infectious_diseases:
            zod
                .any().optional(),
        smoking: zod.number().optional(),
        any_other_info: zod.any().optional(),
    }));

export {
    medicalinfoEditValidationSchema
}