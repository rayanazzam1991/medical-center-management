import { AxiosError } from "axios"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Wallet, WalletSearchFilter } from "/@src/models/Contractor/wallet"
import { getWalletsApi } from "/@src/utils/api/Contractor/Wallet"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"




export const useWallet = defineStore('wallet', () => {
    const api = useApi()
    const wallets = ref<Wallet[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const loading = ref(false)


    async function getWalletsStore(searchFilter: WalletSearchFilter) {
        if (loading.value) return
        loading.value = true
        try {
            const returnedResponse = await getWalletsApi(api, searchFilter)
            wallets.value = returnedResponse.response.data
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message


        }
        catch (error: any) {
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
        wallets,
        loading,
        getWalletsStore,
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
    import.meta.hot.accept(acceptHMRUpdate(useWallet, import.meta.hot))
}