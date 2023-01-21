import { defineStore, acceptHMRUpdate } from "pinia"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { addQuantity, defaultAddQuantityItem, defaultWithdrawQuantityItem, itemHistory, withdrawQuantity } from "/@src/models/Warehouse/ItemHistory/itemHistory"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})



interface ItemHistoryFormStepOptions {
    number: number
    canNavigate?: boolean
    skipable?: boolean
    previousStepFn?: () => Promise<void>
    validateStepFn?: () => Promise<void>
    skipStepFn?: () => Promise<void>

}

export const useItemHistoryForm = defineStore('ItemHistoryForm', () => {
    const step = ref(1)
    const loading = ref(false)
    const canNavigate = ref(false)
    const skipable = ref(false)
    const previousStepFn = shallowRef<ItemHistoryFormStepOptions['previousStepFn'] | null>()
    const validateStepFn = shallowRef<ItemHistoryFormStepOptions['validateStepFn'] | null>()
    const skipStepFn = shallowRef<ItemHistoryFormStepOptions['skipStepFn'] | null>()
    const data = ref<addQuantity>(defaultAddQuantityItem)
    const stepTitle = computed(() => {
        switch (step.value) {
            case 1:
                return i18n.global.t('add_quantity.form.title')
            default:
                return i18n.global.t('add_quantity.form.title')
        }
    })

    function setLoading(value: boolean) {
        loading.value = value
    }
    function setStep(options?: ItemHistoryFormStepOptions) {
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
        data.value.add_item_cost = 0
        data.value.note = ''
        data.value.item_id = 0
        data.value.item_quantity = 0
        data.value.status = 0
        data.value.invoice_number = ''
    }
    async function save() {
        loading.value = true
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
        setLoading,
        setStep,
        getStep,
        save,
        reset,
    } as const
})

export const useWithdrawItemForm = defineStore('useWithdrawItemForm', () => {
    const step = ref(1)
    const loading = ref(false)
    const canNavigate = ref(false)
    const skipable = ref(false)
    const previousStepFn = shallowRef<ItemHistoryFormStepOptions['previousStepFn'] | null>()
    const validateStepFn = shallowRef<ItemHistoryFormStepOptions['validateStepFn'] | null>()
    const skipStepFn = shallowRef<ItemHistoryFormStepOptions['skipStepFn'] | null>()
    const dataWithdraw = ref<withdrawQuantity>(defaultWithdrawQuantityItem)
    const stepTitle = computed(() => {
        switch (step.value) {
            case 1:
                return i18n.global.t('withdraw_quantity.form.title')
            default:
                return i18n.global.t('withdraw_quantity.form.title')
        }
    })

    function setLoading(value: boolean) {
        loading.value = value
    }
    function setStep(options?: ItemHistoryFormStepOptions) {
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
        dataWithdraw.value.requester_name = ''
        dataWithdraw.value.note = ''
        dataWithdraw.value.item_id = 0
        dataWithdraw.value.user_id = 0
        dataWithdraw.value.item_quantity = 0
        dataWithdraw.value.status = 0
        dataWithdraw.value.requester_type = ''
    }

    async function save() {
        loading.value = true
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
        dataWithdraw,
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
    import.meta.hot.accept(acceptHMRUpdate(useItemHistoryForm, import.meta.hot))
}
