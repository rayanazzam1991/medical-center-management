import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Category, CategorySearchFilter, ChangeCategoryStatus, CreateUpdateCategory } from "/@src/models/Warehouse/Category/category"
import { changeCategoryStatusApi, getParentApi, getCategoryApi, addCategoryApi, editCategoryApi, getCategoriesApi } from "/@src/utils/api/Warehouse/Category"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useCategory = defineStore('category', () => {
    const api = useApi()
    const categories = ref<Category[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()


    async function getCategoryStore(categoryId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getCategoryApi(api, categoryId)
            var returnedCategory: Category
            returnedCategory = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedCategory
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
    async function addCategoryStore(category: CreateUpdateCategory) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addCategoryApi(api, category)
            var returnedCategory: Category
            returnedCategory = response.response.data
            categories.value.push(returnedCategory)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedCategory
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
    async function editCategoryStore(category: CreateUpdateCategory) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await editCategoryApi(api, category)
            var returnedCategory: Category
            returnedCategory = response.response.data
            categories.value.splice(
                categories.value.findIndex((categoryElement) => (categoryElement.id = category.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            categories.value.push(returnedCategory)
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
    async function getCategoriesStore(searchFilter: CategorySearchFilter) {
        if (loading.value) return
        loading.value = true
        try {
            const returnedResponse = await getCategoriesApi(api, searchFilter)
            console.log(returnedResponse.response.data)
            categories.value = returnedResponse.response.data
            console.log(returnedResponse)

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

    async function getParentsStore() {
        if (loading.value) return
        loading.value = true
        try {
            const returnedResponse = await getParentApi(api)
            console.log(returnedResponse.response.data)
            // categories.value = returnedResponse.response.data
            // console.log(categories.value)

            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Category[]
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


    async function changeCategoryStatusStore(category: ChangeCategoryStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changeCategoryStatusApi(api, category)
            var returnedCategory: Category
            returnedCategory = response.response.data
            categories.value.splice(
                categories.value.findIndex((categoryElement) => (categoryElement.id = category.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            categories.value.push(returnedCategory)
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
        categories,
        pagination,
        loading,
        addCategoryStore,
        editCategoryStore,
        getCategoryStore,
        getCategoriesStore,
        getParentsStore,
        changeCategoryStatusStore
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
    import.meta.hot.accept(acceptHMRUpdate(useCategory, import.meta.hot))
}
