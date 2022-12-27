import { defineStore, acceptHMRUpdate } from "pinia"
import { date } from "zod"
import { CreateCustomer, defaultCreateCustomer, UpdateCustomer, defaultUpdateCustomer, defaultCustomerProfilePic, CreateUpdateCustomerSocialMediaHelper } from "/@src/models/CRM/Customer/customer"
import { MedicalInfo, defaultMedicalInfo } from "/@src/models/CRM/MedicalInfo/medicalInfo"
import { Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser, defaultCreateUpdateUser } from "/@src/models/Others/User/user"

interface CustomerFormStepOptions {
  number: number
  canNavigate?: boolean
  skipable?: boolean
  previousStepFn?: () => Promise<void>
  validateStepFn?: () => Promise<void>
  skipStepFn?: () => Promise<void>
}

export const useCustomerForm = defineStore('CustomerForm', () => {
  const step = ref(1)
  const loading = ref(false)
  const canNavigate = ref(false)
  const skipable = ref(false)
  const previousStepFn = shallowRef<CustomerFormStepOptions['previousStepFn'] | null>()
  const validateStepFn = shallowRef<CustomerFormStepOptions['validateStepFn'] | null>()
  const skipStepFn = shallowRef<CustomerFormStepOptions['skipStepFn'] | null>()
  const data = ref<CreateCustomer>(defaultCreateCustomer)
  const dataUpdate = ref<UpdateCustomer>(defaultUpdateCustomer)
  const userForm = ref<CreateUpdateUser>(defaultCreateUpdateUser)
  const medicalInfoForm = ref<MedicalInfo>(defaultMedicalInfo)
  const customerSocialMediaForm = ref<Array<CreateUpdateCustomerSocialMediaHelper>>([])
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Main Info'
      case 2:
        return 'Medical Info'
      case 3:
        return 'Social Media'
      default:
        return 'Main Info'
    }
  })

  function setLoading(value: boolean) {
    loading.value = value
  }
  function setStep(options?: CustomerFormStepOptions) {
    step.value = options?.number || 1
    canNavigate.value = options?.canNavigate ?? false
    skipable.value = options?.skipable ?? false
    previousStepFn.value = options?.previousStepFn ?? null
    validateStepFn.value = options?.validateStepFn ?? null
    skipStepFn.value = options?.skipStepFn ?? null
  }
  function getStep() {
    return step.value
  }

  async function save() {
    loading.value = true
    loading.value = false
  }

  function reset() {
    data.value.emergency_contact_name = ''
    data.value.emergency_contact_phone = ''
    data.value.customer_group_id = 1
    data.value.is_completed = false
    data.value.user.first_name = ''
    data.value.user.last_name = ''
    data.value.user.gender = ''
    data.value.user.address = ''
    data.value.user.birth_date = ''
    data.value.user.phone_number = ''
    data.value.user.city_id = 0
    data.value.user.room_id = 0
    data.value.user.user_status_id = 0
    data.value.medical_info_id = undefined
    medicalInfoForm.value.allergic = undefined
    medicalInfoForm.value.blood_type = undefined
    medicalInfoForm.value.chronic_diseases = undefined
    medicalInfoForm.value.any_other_info = undefined
    medicalInfoForm.value.infectious_diseases = undefined
    medicalInfoForm.value.smoking = undefined
    medicalInfoForm.value.id = undefined
    customerSocialMediaForm.value = []
    dataUpdate.value.emergency_contact_name = ''
    dataUpdate.value.emergency_contact_phone = ''
    dataUpdate.value.customer_group_id = 1
    dataUpdate.value.is_completed = false
    dataUpdate.value.user.first_name = ''
    dataUpdate.value.user.last_name = ''
    dataUpdate.value.user.gender = ''
    dataUpdate.value.user.address = ''
    dataUpdate.value.user.birth_date = ''
    dataUpdate.value.user.phone_number = ''
    dataUpdate.value.user.city_id = 0
    dataUpdate.value.user.room_id = 0
    dataUpdate.value.user.user_status_id = 0
  }

  return {
    canNavigate,
    skipable,
    previousStepFn,
    validateStepFn,
    skipStepFn,
    step,
    loading,
    stepTitle,
    data,
    dataUpdate,
    userForm,
    medicalInfoForm,
    customerSocialMediaForm,
    setLoading,
    setStep,
    getStep,
    save,
    reset,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomerForm, import.meta.hot))
}
