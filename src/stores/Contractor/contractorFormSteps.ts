import { defineStore, acceptHMRUpdate } from "pinia"
import { defaultCreateUpdateUser } from "../Others/User/userStore"
import { defaultCreateContractor, defaultUpdateContractor } from "./contractorStore"
import { CreateContractor, CreateUpdateServicesHelper, UpdateContractor } from "/@src/utils/api/Contractor"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"




interface ContractorFormStepOptions {
  number: number
  canNavigate?: boolean
  skipable?: boolean
  previousStepFn?: () => Promise<void>
  validateStepFn?: () => Promise<void>
  skipStepFn?: () => Promise<void>

}

export const useContractorForm = defineStore('ContractorForm', () => {
  const step = ref(1)
  const loading = ref(false)
  const canNavigate = ref(false)
  const skipable = ref(false)
  const previousStepFn = shallowRef<ContractorFormStepOptions['previousStepFn'] | null>()
  const validateStepFn = shallowRef<ContractorFormStepOptions['validateStepFn'] | null>()
  const skipStepFn = shallowRef<ContractorFormStepOptions['skipStepFn'] | null>()
  const data = ref<CreateContractor>(defaultCreateContractor)
  const dataUpdate = ref<UpdateContractor>(defaultUpdateContractor)
  const userForm = ref<CreateUpdateUser>(defaultCreateUpdateUser)
  const contractorServicesForm = ref<Array<CreateUpdateServicesHelper>>([])
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Main Info'
      case 2:
        return 'Personal ID'
      case 3:
        return 'Services'
      default:
        return 'Main Info'
    }
  })

  function setLoading(value: boolean) {
    loading.value = value
  }
  function setStep(options?: ContractorFormStepOptions) {
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
    data.value = defaultCreateContractor
    dataUpdate.value = defaultUpdateContractor
    userForm.value = defaultCreateUpdateUser
    contractorServicesForm.value = []
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
    contractorServicesForm,
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
  import.meta.hot.accept(acceptHMRUpdate(useContractorForm, import.meta.hot))
}
