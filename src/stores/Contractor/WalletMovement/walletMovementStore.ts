import { AxiosError } from "axios"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"
import { addWalletMovementApi } from "/@src/utils/api/Contractor/WalletMovement"
import { CreateWalletMovement, WalletMovement } from "/@src/models/Contractor/walletMovement"




export const useWalletMovement = defineStore('walletMovement', () => {
    const api = useApi()
    const walletMovements = ref<WalletMovement[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const loading = ref(false)

    async function addWalletMovementStore(walletMovement: CreateWalletMovement) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addWalletMovementApi(api, walletMovement)

            var returnedWalletMovement: WalletMovement
            returnedWalletMovement = response.response.data
            walletMovements.value.push(returnedWalletMovement)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedWalletMovement
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
        success,
        error_code,
        message,
        walletMovements,
        pagination,
        loading,
        addWalletMovementStore,
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
    import.meta.hot.accept(acceptHMRUpdate(useWalletMovement, import.meta.hot))
}