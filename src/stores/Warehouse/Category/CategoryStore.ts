import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Category, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { deleteCategoryApi, getCategoryApi, addCategoryApi, editCategoryApi, getCategoriesApi, deactivateCategoryApi, activateCategoryApi } from "/@src/utils/api/Warehouse/Category/Category"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useCategory = defineStore('category', () => {
    const api = useApi()
    const categories = ref<Category[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)

    async function deleteCategoryStore(categoryId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const response = await deleteCategoryApi(api, categoryId)
            categories.value.splice(
                categories.value.findIndex((category: Category) => category.id === categoryId),
                1
            )
        } finally {
            loading.value = false
        }
    }
    async function getCategoryStore(categoryId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getCategoryApi(api, categoryId)
            var returnedCategory: Category
            returnedCategory = response.response.data
            return returnedCategory
        } finally {
            loading.value = false
        }
    }
    async function addCategoryStore(category: Category) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addCategoryApi(api, category)
            var returnedCategory: Category
            returnedCategory = response.response.data
            categories.value.push(returnedCategory)
            return returnedCategory
        } finally {
            loading.value = false
        }
    }
    async function editCategoryStore(category: Category) {
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
            categories.value.push(returnedCategory)
        } finally {
            loading.value = false
        }
    }
    async function getCategoriesStore(searchFilter: CategorySearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getCategoriesApi(api, searchFilter)
            categories.value = returnedResponse.response.data
            pagination.value = returnedResponse.response.pagination
        } finally {
            loading.value = false
        }
    }

    async function deactivateCategoryStore(categoryId: number) {
        // if (loading.value) return

        // loading.value = true

        // try {
        //     const response = await deactivateCategoryApi(api, categoryId)
        //     categories.value.splice(
        //         categories.value.findIndex((category: Category) => category.id === categoryId),
        //         1
        //     )
        // } finally {
        //     loading.value = false
        // }
    }
    async function activateCategoryStore(categoryId: number) {
        // if (loading.value) return

        // loading.value = true

        // try {
        //     const response = await activateCategoryApi(api, categoryId)
        //     categories.value.splice(
        //         categories.value.findIndex((category: Category) => category.id === categoryId),
        //         1
        //     )
        // } finally {
        //     loading.value = false
        // }
    }



    return {
        categories,
        pagination,
        deleteCategoryStore,
        addCategoryStore,
        editCategoryStore,
        getCategoryStore,
        getCategoriesStore,
        deactivateCategoryStore,
        activateCategoryStore,
        loading
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
