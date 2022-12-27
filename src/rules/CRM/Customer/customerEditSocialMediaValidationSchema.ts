import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const customerEditSocialMediaValidationSchema = toFormValidator(
    zod.record(
        zod.string().startsWith('social_media_url'),

        zod
            .string({ required_error: 'This field is required' })
            .regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/, 'Please enter a valid URL')
            .max(125, 'URL must contain at most 125 character(s)')
    ))


export {
    customerEditSocialMediaValidationSchema
}