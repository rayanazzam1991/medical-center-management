import { z as zod } from 'zod'
import { toFormValidator } from "@vee-validate/zod";

const socialmediavalidationSchema = toFormValidator(zod
    .object({
        name: zod
            .string({
                required_error: "This field is required",
            })
            .min(1, "This field is required"),
        // icon: zod
        // .string({ required_error: "This field is required" }).regex(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|ico|png)/, "Please enter a valid icon or image"),
        icon: zod
            .string({ required_error: "This field is required" }).min(1, "This field is required"),

        status: zod
            .number({ required_error: "Please choose one" }),
    }));
export {
    socialmediavalidationSchema
}