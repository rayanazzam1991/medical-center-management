import { defineStore, acceptHMRUpdate } from "pinia"
import { date } from "zod"
import { CreateCustomer, defaultCreateCustomer, UpdateCustomer, defaultUpdateCustomer, defaultCustomerProfilePic, CreateUpdateCustomerSocialMediaHelper } from "/@src/models/CRM/Customer/customer"
import { MedicalInfo, defaultMedicalInfo } from "/@src/models/CRM/MedicalInfo/medicalInfo"
import { Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser, defaultCreateUpdateUser } from "/@src/models/Others/User/user"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

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
    const userForm = ref<CreateUpdateUser>(defaultCreateUpdateUser)
    const medicalInfoForm = ref<MedicalInfo>(defaultMedicalInfo)
    const stepTitle = computed(() => {
        switch (step.value) {
            case 1:
                return i18n.global.t('customer.form.step_1_abbr_title')
            case 2:
                return i18n.global.t('customer.form.step_2_abbr_title')
            default:
                return i18n.global.t('customer.form.step_1_abbr_title')
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
        data.value.medical_info_id = 0
        medicalInfoForm.value.allergic = ''
        medicalInfoForm.value.blood_type = ''
        medicalInfoForm.value.chronic_diseases = ''
        medicalInfoForm.value.any_other_info = ''
        medicalInfoForm.value.infectious_diseases = ''
        medicalInfoForm.value.id = 0
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
