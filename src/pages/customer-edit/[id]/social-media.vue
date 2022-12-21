<script setup lang="ts">
import {useHead} from "@vueuse/head"
import {useNotyf} from "/@src/composable/useNotyf"
import {SocialMedia, defaultSocialMediaSearchFilter} from "/@src/models/CRM/SocialMedia/socialMedia"
import {getCustomer, updateCustomer} from "/@src/services/CRM/Customer/customerService"
import {getSocialMediasList} from "/@src/services/CRM/SocialMedia/socialMediaService"
import {useCustomerForm} from "/@src/stores/CRM/Customer/customerFormSteps"
import {useViewWrapper} from "/@src/stores/viewWrapper"
import {useForm} from "vee-validate";
import { toFormValidator } from '@vee-validate/zod';
import { z as zod } from 'zod';

const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle('Customer Social Media')
const head = useHead({
  title: 'Customer',
})
const notif = useNotyf()
const customerForm = useCustomerForm()
customerForm.setStep({
  number: 4,
  canNavigate: true,
  skipable: true,
  validateStepFn: async () => {
    var isValid = await onSubmitEdit()
    if (isValid) {
      customerForm.reset()
      router.push({
        path: `/customer/${customerId.value}`,
      })
    }

  },
  skipStepFn: async () => {
    customerForm.reset()
    router.push({
      path: `/customer/${customerId.value}`,
    })
  }

})
const pageTitle = 'Step 4: Customer Social Media'
const socialMediasList = ref<SocialMedia[]>([])

interface SocialMediaChecked {
  socialMedia: SocialMedia
  checked: boolean
  url: string
}

const fetchCustomer = async () => {

  const {customer} = await getCustomer(customerId.value)
  for (let i = 0; i < customer.social_medias.length; i++) {
    // @ts-ignore

    customerForm.customerSocialMediaForm.push({
      social_media_id: customer.social_medias[i].id,
      url: customer.social_medias[i].url
    })

  }

  customerForm.medicalInfoForm.allergic = customer?.medical_info?.allergic ?? undefined
  customerForm.medicalInfoForm.any_other_info = customer?.medical_info?.any_other_info ?? undefined
  customerForm.medicalInfoForm.blood_type = customer?.medical_info?.blood_type ?? undefined
  customerForm.medicalInfoForm.chronic_diseases = customer?.medical_info?.chronic_diseases ?? undefined
  customerForm.medicalInfoForm.infectious_diseases = customer?.medical_info?.infectious_diseases ?? undefined
  customerForm.medicalInfoForm.smoking = customer?.medical_info?.smoking ?? undefined
  customerForm.medicalInfoForm.id = customer?.medical_info?.id ?? undefined

  customerForm.userForm.id = customer.user.id
  customerForm.userForm.first_name = customer.user.first_name
  customerForm.userForm.last_name = customer.user.last_name
  customerForm.userForm.gender = customer.user.gender
  customerForm.userForm.birth_date = customer.user.birth_date
  customerForm.userForm.phone_number = customer.user.phone_number
  customerForm.userForm.address = customer.user.address
  customerForm.userForm.room_id = customer.user.room.id
  customerForm.userForm.city_id = customer.user.city.id
  customerForm.userForm.user_status_id = customer.user.status.id
  customerForm.dataUpdate.emergency_contact_name = customer.emergency_contact_name
  customerForm.dataUpdate.emergency_contact_phone = customer.emergency_contact_phone
  customerForm.dataUpdate.customer_group_id = customer.customer_group.id
  customerForm.dataUpdate.id = customerId.value

}


const socialMediaChecked = ref<SocialMediaChecked[]>([])
let validationObject = ref({})
var validationObjectSchema = ref({})

const initialValuesObject: Record<string, any> = {};

onMounted(async () => {
  const {socialMedias} = await getSocialMediasList(defaultSocialMediaSearchFilter)
  socialMediasList.value = socialMedias
  if (customerForm.dataUpdate.id != customerId.value) {

    await fetchCustomer()
  }


  for (let index = 0; index < socialMediasList.value.length; index++) {
    // @ts-ignore
    let socialMedia = customerForm.customerSocialMediaForm.find((element) => element.social_media_id == socialMediasList.value[index].id)
    if (socialMedia) {
      socialMediaChecked.value.push({socialMedia: socialMediasList.value[index], checked: true, url: socialMedia.url})
    } else {
      socialMediaChecked.value.push({socialMedia: socialMediasList.value[index], checked: false, url: ''})

    }

  }
  if(socialMediaChecked.length>0){
    for (let i = 0; i < socialMediaChecked.length; i++) {
      console.log("i",i)
      validationObject.socialMediaChecked.value[index] = zod
        .string({
          required_error: "This field is required",
        })
        .min(4, "This field is required");

    }
  }
  validationObjectSchema = toFormValidator(zod
    .object(validationObject));

    console.log("initialValuesObject",initialValuesObject)

})

const validationSchema = validationObjectSchema;
const {handleSubmit} = useForm({
  validationSchema,
  initialValues:initialValuesObject
});

const onSubmitEdit = async () => {
  customerForm.customerSocialMediaForm.splice(0, customerForm.customerSocialMediaForm.length)
  for (let i = 0; i < socialMediaChecked.value.length; i++) {
    if (socialMediaChecked.value[i].checked == true) {
      customerForm.customerSocialMediaForm.push({
        social_media_id: socialMediaChecked.value[i].socialMedia.id as number,
        url: socialMediaChecked.value[i].url
      })

    }

  }
  customerForm.dataUpdate.is_completed = true
  console.log(customerForm.userForm)
  const customer = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
  if (customer.success) {
    // @ts-ignore
    notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} social medias was added successfully`)

    return true
  } else {
    // @ts-ignore

    notif.error(customer.success)

  }

}


</script>

<template>
  <div class="page-content-inner">
    <form class="form-layout" @submit.prevent="onSubmitEdit()">
      <div class="form-outer">
        <div class="form-body">
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ pageTitle }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-12">

                <VField>

                  <VControl v-for="socialMedia in socialMediaChecked" raw nogrow subcontrol>
                    <VCheckbox :label="socialMedia.socialMedia.name"
                               :name="socialMedia.socialMedia.id" color="primary"
                               :key="socialMedia.socialMedia.id" v-model="socialMedia.checked"/>
                    <VIcon :icon="socialMedia.socialMedia.icon"
                           class="has-text-primary is-size-5"/>

                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField v-for="socialMedia in socialMediaChecked" :id="socialMedia.socialMedia.name">

                  <VLabel class="required" v-if="socialMedia.checked">Customer's {{
                                            socialMedia.socialMedia.name
                                    }}
                    URL:
                  </VLabel>
                  <VControl v-if="socialMedia.checked" icon="feather:chevrons-right">
                    <VInput type="text" placeholder="" autocomplete="" v-model="socialMedia.url"
                            :key="socialMedia.socialMedia.id"/>

                  </VControl>

                </VField>
              </div>
            </div>
          </div>


        </div>
      </div>
    </form>


  </div>
</template>
<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
    content: " *";
    color: var(--danger);
}

.optional::after {
    content: " (optional)";
    color: var(--placeholder);
    font-style: italic;
}

.form-layout .form-outer .form-body {
  padding: 20px 40px 40px;
}
</style>
