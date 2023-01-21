import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Item, ItemSearchFilter, ChangeItemStatus, CreateUpdateItem } from "/@src/models/Warehouse/Item/item"
import { changeItemStatusApi, getItemApi, addItemApi, editItemApi, getItemsApi } from "/@src/utils/api/Warehouse/Item"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useItem = defineStore('item', () => {
    const api = useApi()
    const items = ref<Item[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()


    async function getItemStore(itemId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getItemApi(api, itemId)
            var returnedItem: Item
            returnedItem = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedItem
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
    async function addItemStore(item: CreateUpdateItem) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addItemApi(api, item)
            var returnedItem: Item
            returnedItem = response.response.data
            items.value.push(returnedItem)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedItem
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
    async function editItemStore(item: CreateUpdateItem) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await editItemApi(api, item)
            var returnedItem: Item
            returnedItem = response.response.data
            items.value.splice(
                items.value.findIndex((itemElement) => (itemElement.id = item.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            items.value.push(returnedItem)
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
    async function getItemsStore(searchFilter: ItemSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getItemsApi(api, searchFilter)
            items.value = returnedResponse.response.data
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

    async function changeItemStatusStore(item: ChangeItemStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changeItemStatusApi(api, item)
            var returnedItem: Item
            returnedItem = response.response.data
            items.value.splice(
                items.value.findIndex((itemElement) => (itemElement.id = item.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            items.value.push(returnedItem)
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
        items,
        pagination,
        loading,
        addItemStore,
        editItemStore,
        getItemStore,
        getItemsStore,
        changeItemStatusStore
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
    import.meta.hot.accept(acceptHMRUpdate(useItem, import.meta.hot))
}
