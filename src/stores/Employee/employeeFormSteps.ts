import { defineStore, acceptHMRUpdate } from 'pinia'
import { defaultCreateUpdateUser } from '../Others/User/userStore'
import { defaultCreateEmployee, defaultUpdateEmployee } from './employeeStore'
import { CreateEmployee } from '/@src/utils/api/Employee'
import { UpdateEmployee } from '/@src/utils/api/Employee'
import { MedicalInfo } from '/@src/utils/api/CRM/MedicalInfo'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

interface EmployeeFormStepOptions {
  number: number
  canNavigate?: boolean
  skipable?: boolean
  previousStepFn?: () => Promise<void>
  validateStepFn?: () => Promise<void>
  skipStepFn?: () => Promise<void>
}

export const useEmployeeForm = defineStore('EmployeeForm', () => {
  const step = ref(1)
  const loading = ref(false)
  const canNavigate = ref(false)
  const skipable = ref(false)
  const previousStepFn = shallowRef<EmployeeFormStepOptions['previousStepFn'] | null>()
  const validateStepFn = shallowRef<EmployeeFormStepOptions['validateStepFn'] | null>()
  const skipStepFn = shallowRef<EmployeeFormStepOptions['skipStepFn'] | null>()
  const data = ref<CreateEmployee>(defaultCreateEmployee)
  const dataUpdate = ref<UpdateEmployee>(defaultUpdateEmployee)
  const userForm = ref<CreateUpdateUser>(defaultCreateUpdateUser)
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Main Info'
      case 2:
        return 'Personal ID'
      default:
        return 'Main Info'
    }
  })

  function setLoading(value: boolean) {
    loading.value = value
  }
  function setStep(options?: EmployeeFormStepOptions) {
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
    data.value = defaultCreateEmployee
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
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeForm, import.meta.hot))
}
