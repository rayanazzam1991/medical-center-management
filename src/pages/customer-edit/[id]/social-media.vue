<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { SocialMedia, defaultSocialMediaSearchFilter } from "/@src/models/CRM/SocialMedia/socialMedia"
import { getCustomer, updateCustomer } from "/@src/services/CRM/Customer/customerService"
import { getSocialMediasList } from "/@src/services/CRM/SocialMedia/socialMediaService"
import { useCustomerForm } from "/@src/stores/CRM/Customer/customerFormSteps"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { ErrorMessage, useForm } from "vee-validate";
import { customerEditSocialMediaValidationSchema } from '/@src/rules/CRM/Customer/customerEditSocialMediaValidationSchema';
import sleep from "/@src/utils/sleep"
import { Notyf } from "notyf"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle(t('customer.form.step_3_title'))
const head = useHead({
  title: t('customer.form.page_title'),
})
const notif = useNotyf() as Notyf
const customerForm = useCustomerForm()
customerForm.setStep({
  number: 3,
  canNavigate: true,
  validateStepFn: async () => {
    var isValid = await onSubmitEdit()
    if (isValid) {
      router.push({
        path: `/customer/${customerId.value}`,
        query: { tab: 'Social Media' }
      })
      customerForm.reset()

    }
  },

})
const socialMediasList = ref<SocialMedia[]>([])

interface SocialMediaChecked {
  socialMedia: SocialMedia
  checked: boolean
  url: string
}

const fetchCustomer = async () => {

  const { customer } = await getCustomer(customerId.value)
  for (let i = 0; i < customer.social_medias.length; i++) {

    customerForm.customerSocialMediaForm.push({
      // @ts-ignore
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
  customerForm.userForm.room_id = customer.user?.room?.id
  customerForm.userForm.city_id = customer.user.city.id
  customerForm.userForm.room_id = undefined
  customerForm.userForm.user_status_id = customer.user.status.id
  customerForm.dataUpdate.emergency_contact_name = customer.emergency_contact_name
  customerForm.dataUpdate.emergency_contact_phone = customer.emergency_contact_phone
  customerForm.dataUpdate.customer_group_id = customer.customer_group.id
  customerForm.dataUpdate.id = customerId.value

}


const socialMediaChecked = ref<SocialMediaChecked[]>([])

onMounted(async () => {
  const { socialMedias } = await getSocialMediasList(defaultSocialMediaSearchFilter)
  socialMediasList.value = socialMedias
  if (customerForm.dataUpdate.id != customerId.value) {

    await fetchCustomer()
  }


  for (let index = 0; index < socialMediasList.value.length; index++) {
    // @ts-ignore
    let socialMedia = customerForm.customerSocialMediaForm.find((element) => element.social_media_id == socialMediasList.value[index].id)
    if (socialMedia) {
      socialMediaChecked.value.push({ socialMedia: socialMediasList.value[index], checked: true, url: socialMedia.url })
    } else {
      socialMediaChecked.value.push({ socialMedia: socialMediasList.value[index], checked: false, url: '' })

    }
  }
  for (let index = 0; index < socialMediasList.value.length; index++) {
    let socialMedia = customerForm.customerSocialMediaForm.find((element) => element.social_media_id == socialMediasList.value[index].id)
    if (socialMedia) {
      setFieldValue(`social_media_url_${socialMedia.social_media_id}`, socialMedia.url);
    } else {
      socialMediaChecked.value.push({
        socialMedia: socialMediasList.value[index],
        checked: false,
        url: '',
      })
    }
  }

})

const validationSchema = customerEditSocialMediaValidationSchema

const { handleSubmit, setFieldValue } = useForm({
  validationSchema
});


const onSubmitEdit = handleSubmit(async () => {
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
  const { customer, message, success } = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
  if (success) {
    // @ts-ignore
    await sleep(200);

    notif.success(t('toast.success.add'))

    return true
  } else {
    // @ts-ignore
    await sleep(200);

    notif.error(message)

  }

})


</script>

<template>
  <div class="page-content-inner">
    <form class="form-layout" @submit.prevent="onSubmitEdit()">
      <div class="form-outer">
        <div class="form-body">
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ t('customer.form.choose_social_media') }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-12">

                <VField>

                  <VControl v-for="socialMedia in socialMediaChecked" raw nogrow subcontrol>
                    <VCheckbox :label="socialMedia.socialMedia.name" :name="socialMedia.socialMedia.id" color="primary"
                      :key="socialMedia.socialMedia.id" v-model="socialMedia.checked" />
                    <VIcon :icon="socialMedia.socialMedia.icon" class="has-text-primary is-size-5" />

                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <!-- <div class="column is-12">
                  <div :class="socialMedia.checked ? 'mb-3' : ''" v-for="socialMedia in socialMediaChecked">

                    <VField :key="socialMedia.socialMedia.id" :id="`social_media_${socialMedia.socialMedia.id}`">

                      <VLabel class="required" v-if="socialMedia.checked">Customer's {{
      socialMedia.socialMedia.name
  }}
                        URL:
                      </VLabel>
                      <VControl v-if="socialMedia.checked" icon="feather:chevrons-right">
                        <VInput v-if="socialMedia.checked" type="text" placeholder="" autocomplete=""
                          v-model="socialMedia.url" :key="socialMedia.socialMedia.id" />

                      </VControl>
                      <ErrorMessage class="help is-danger" :name="`social_media_${socialMedia.socialMedia.id}`" />


                    </VField>

                  </div>
                </div> -->
              <div class="column is-12">
                <div :class="socialMedia.checked ? 'mb-3' : ''" v-for="socialMedia in socialMediaChecked">
                  <VField v-if="socialMedia.checked" :key="socialMedia.socialMedia.id"
                    :id="`social_media_url_${socialMedia.socialMedia.id}`">

                    <VLabel class="required" v-if="socialMedia.checked">
                      {{ t('customer.form.social_media_url', { social_media: socialMedia.socialMedia.name }) }}
                    </VLabel>
                    <VControl v-if="socialMedia.checked" icon="feather:chevrons-right">
                      <VInput :placeholder="socialMedia.url" class="input" type="text" v-model="socialMedia.url"
                        :key="socialMedia.socialMedia.id" />

                    </VControl>
                    <ErrorMessage class="help is-danger" :name="`social_media_url_${socialMedia.socialMedia.id}`" />


                  </VField>
                </div>

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


.form-layout .form-outer .form-body {
  padding: 20px 40px 40px;
}

.layout {
  min-width: 50%;
}

.form-fieldset {
  max-width: 40%;
}
</style>
