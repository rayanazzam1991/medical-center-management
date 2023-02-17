import { acceptHMRUpdate, defineStore } from "pinia";
import { useApi } from "/@src/composable/useApi";
import { CreateRecords } from "/@src/models/Accounting/Transaction/record";
import { createRecordsApi } from "/@src/utils/api/Accounting/Transaction/transaction";
import sleep from "/@src/utils/sleep";

export const useTransaction = defineStore('transaction', () => {

    const api = useApi();
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function createRecords(records: CreateRecords) {
        if (loading.value) return
        loading.value = true
        await sleep(1000);
        try {
            const returnedResponse = await createRecordsApi(api, records)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    return {
        loading,
        success,
        error_code,
        message,
        createRecords
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
    import.meta.hot.accept(acceptHMRUpdate(useTransaction, import.meta.hot))
}
