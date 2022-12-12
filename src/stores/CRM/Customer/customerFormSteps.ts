import { defineStore, acceptHMRUpdate } from 'pinia'
import { defaultCreateUpdateUser } from '../../Others/User/userStore'
import { defaultMedicalInfo } from '../MedicaInfo/medicalInfoStore'
import { defaultCreateCustomer, defaultCustomerProfilePic, defaultUpdateCustomer } from './customerStore'
import {
  CreateCustomer,
  CreateUpdateCustomerSocialMediaHelper,
  UpdateCustomer,
} from '/@src/utils/api/CRM/Customer'
import { MedicalInfo } from '/@src/utils/api/CRM/MedicalInfo'
import { Media } from '/@src/utils/api/Others/Media'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

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
  const profilePicture = ref<Media>(defaultCustomerProfilePic)
  const customerSocialMediaForm = ref<Array<CreateUpdateCustomerSocialMediaHelper>>([])
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Main Info'
      case 2:
        return 'Profile Picture'
      case 3:
        return 'Medical Info'
      case 4:
        return 'Social Media'
      default:
        return 'Customer Form'
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

    console.log(data.value)

    loading.value = false
  }

  function reset() {
    data.value = defaultCreateCustomer
    dataUpdate.value = defaultUpdateCustomer
    userForm.value = defaultCreateUpdateUser
    customerSocialMediaForm.value = []
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
    profilePicture,
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
