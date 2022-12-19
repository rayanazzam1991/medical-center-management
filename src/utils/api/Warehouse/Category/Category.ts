import { AxiosInstance } from "axios"
import { CustomResponseSingle, CustomResponseCollection } from "/@src/utils/response"
import { Category, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"

export async function deleteCategoryApi(
    api: AxiosInstance,
    categoryId: number
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.delete(`category/${categoryId}`)

    return { response }
}
export async function addCategoryApi(
    api: AxiosInstance,
    category: Category
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`category`, category)

    return { response }
}
export async function editCategoryApi(
    api: AxiosInstance,
    category: Category
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `category/${category.id}`,
        category
    )

    return { response }
}

export async function getCategoryApi(
    api: AxiosInstance,
    category_id: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`category/${category_id}`)

    return { response }
}

export async function getCategoriesApi(
    api: AxiosInstance,
    searchFilter: CategorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('category/getCategoriesList', {
        params: searchFilter,
    })
    return { response }
}
export async function deactivateCategoryApi(
    api: AxiosInstance,
    categoryId: number
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.delete(`category/${categoryId}/deactivate`)

    return { response }
}
export async function activateCategoryApi(
    api: AxiosInstance,
    categoryId: number
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.delete(`category/${categoryId}/activate`)

    return { response }
}