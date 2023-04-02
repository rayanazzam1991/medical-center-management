import { defineStore, acceptHMRUpdate } from "pinia"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { defaultCreateInventoryItemHistoryMovement } from "../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { CreateInventoryItem, defaultCreateInventoryItem } from "/@src/models/Warehouse/InventoryItem/inventoryItem";

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})



interface InventoryItemFormStepOptions {
    number: number
    canNavigate?: boolean
    skipable?: boolean
    previousStepFn?: () => Promise<void>
    validateStepFn?: () => Promise<void>
    skipStepFn?: () => Promise<void>

}

export const useInventoryItemForm = defineStore('InventoryItemForm', () => {
    const step = ref(1)
    const loading = ref(false)
    const canNavigate = ref(false)
    const skipable = ref(false)
    const previousStepFn = shallowRef<InventoryItemFormStepOptions['previousStepFn'] | null>()
    const validateStepFn = shallowRef<InventoryItemFormStepOptions['validateStepFn'] | null>()
    const skipStepFn = shallowRef<InventoryItemFormStepOptions['skipStepFn'] | null>()
    const data = ref<CreateInventoryItem>(defaultCreateInventoryItem)
    const stepTitle = computed(() => {
        switch (step.value) {
            case 1:
                return i18n.global.t('inventoryItem.fromMainInventoryForm.title')
            default:
                return i18n.global.t('inventoryItem.fromMainInventoryForm.title')
        }
    })

    function setLoading(value: boolean) {
        loading.value = value
    }
    function setStep(options?: InventoryItemFormStepOptions) {
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
        data.value.inventory_id = 0
        data.value.quantity = 0
        data.value.item_id = 0
        data.value.inventoryItemHistories = defaultCreateInventoryItemHistoryMovement
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

export const useToInventoryItemForm = defineStore('ToInventoryItemForm', () => {
    const step = ref(1)
    const loading = ref(false)
    const canNavigate = ref(false)
    const skipable = ref(false)
    const previousStepFn = shallowRef<InventoryItemFormStepOptions['previousStepFn'] | null>()
    const validateStepFn = shallowRef<InventoryItemFormStepOptions['validateStepFn'] | null>()
    const skipStepFn = shallowRef<InventoryItemFormStepOptions['skipStepFn'] | null>()
    const data = ref<CreateInventoryItem>(defaultCreateInventoryItem)
    const stepTitle = computed(() => {
        switch (step.value) {
            case 1:
                return i18n.global.t('inventoryItem.toMainInventoryForm.title')
            default:
                return i18n.global.t('inventoryItem.toMainInventoryForm.title')
        }
    })

    function setLoading(value: boolean) {
        loading.value = value
    }
    function setStep(options?: InventoryItemFormStepOptions) {
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
        data.value.inventory_id = 0
        data.value.quantity = 0
        data.value.item_id = 0
        data.value.inventoryItemHistories = defaultCreateInventoryItemHistoryMovement
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

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useInventoryItemForm, import.meta.hot))
}
