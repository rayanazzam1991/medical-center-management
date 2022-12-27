import { defineStore, acceptHMRUpdate } from "pinia"
import { CreateEmployee, defaultCreateEmployee, UpdateEmployee, defaultUpdateEmployee } from "/@src/models/Employee/employee"
import { CreateUpdateUser, defaultCreateUpdateUser } from "/@src/models/Others/User/user"

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
  function reset() {
    data.value.basic_salary = 0
    data.value.end_date = ''
    data.value.nationality_id = 0
    data.value.starting_date = ''
    data.value.user.first_name = ''
    data.value.user.last_name = ''
    data.value.user.gender = ''
    data.value.user.address = ''
    data.value.user.birth_date = ''
    data.value.user.phone_number = ''
    data.value.user.city_id = 0
    data.value.user.room_id = 0
    data.value.user.user_status_id = 0
    dataUpdate.value.basic_salary = 0
    dataUpdate.value.end_date = ''
    dataUpdate.value.nationality_id = 0
    dataUpdate.value.starting_date = ''
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
  async function save() {
    loading.value = true

    console.log(data.value)

    loading.value = false
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
