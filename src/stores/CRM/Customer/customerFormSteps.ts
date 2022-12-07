import { defineStore, acceptHMRUpdate } from "pinia"
import { defaultCreateUpdateUser } from "../../Others/User/userStore"
import { defaultMedicalInfo } from "../MedicaInfo/medicalInfoStore"
import { defaultCreateUpdateCustomer } from "./customerStore"
import { CreateUpdateCustomer, CreateUpdateCustomerSocialMediaHelper } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"



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
  const data = ref<CreateUpdateCustomer>(defaultCreateUpdateCustomer)
  const userForm = ref<CreateUpdateUser>(defaultCreateUpdateUser)
  const medicalInfoForm = ref<MedicalInfo>(defaultMedicalInfo)
  const customerSocialMediaForm = ref<Array<CreateUpdateCustomerSocialMediaHelper>>([])
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Main Info'
      case 2:
        return 'Additional Info'
      case 3:
        return 'Profile Picture'
      case 4:
        return 'Medical Info'
      case 5:
        return 'Social Media'
      case 6:
        return 'Preview'
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
    data.value = defaultCreateUpdateCustomer
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
