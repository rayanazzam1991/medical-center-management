import {toFormValidator} from '@vee-validate/zod';
import {z as zod} from 'zod';

let nameVar = "name"
let statusVar = "status"

const obj = {
  [nameVar]:zod
    .string({
      required_error: "This field is required",
    })
    .min(1, "This field is required"),
  [statusVar]:zod
    .number({required_error: "Please choose one"})
}

// obj.nameVar = zod
//   .string({
//     required_error: "This field is required",
//   })
//   .min(1, "This field is required")
// obj.statusVar = zod
//   .number({required_error: "Please choose one"})

const schemaObj = zod
  .object(obj)
const cityvalidationSchema = toFormValidator(schemaObj);
export {
  cityvalidationSchema,
  schemaObj
}
