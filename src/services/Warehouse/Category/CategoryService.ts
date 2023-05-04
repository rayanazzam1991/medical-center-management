import { Category, CategorySearchFilter, ChangeCategoryStatus, CreateUpdateCategory, defaultCategory } from "/@src/models/Warehouse/Category/category"
import { useCategory } from "/@src/stores/Warehouse/Category/CategoryStore"
import { Pagination } from "/@src/utils/response"


export async function addCategory(categoryData: CreateUpdateCategory) {
    const categoryResponse = useCategory()
    let category: Category = await categoryResponse.addCategoryStore(categoryData) ?? defaultCategory
    let success: boolean = categoryResponse.success ?? false
    let error_code: string = categoryResponse.error_code ?? ''
    let message: string = categoryResponse.message ?? ''
    return { success, error_code, message, category }

}

export async function changeCategoryStatus(categoryData: ChangeCategoryStatus) {
    const categoryResponse = useCategory()
    await categoryResponse.changeCategoryStatusStore(categoryData)
    let success: boolean = categoryResponse.success ?? false
    let error_code: string = categoryResponse.error_code ?? ''
    let message: string = categoryResponse.message ?? ''
    return { success, error_code, message }
}
export async function editCategory(categoryData: CreateUpdateCategory) {
    const categoryResponse = useCategory()
    await categoryResponse.editCategoryStore(categoryData)
    await categoryResponse.editCategoryStore(categoryData)
    let success: boolean = categoryResponse.success ?? false
    let error_code: string = categoryResponse.error_code ?? ''
    let message: string = categoryResponse.message ?? ''
    return { success, error_code, message }

}
export async function getCategoriesList(searchFilter: CategorySearchFilter) {
    const category = useCategory()
    await category.getCategoriesStore(searchFilter)
    let categories: Category[] = category.categories
    let pagination: Pagination = category.pagination
    let success: boolean = category.success ?? false
    let error_code: string = category.error_code ?? ''
    let message: string = category.message ?? ''
    return { categories, pagination, success, error_code, message }

}
export async function getFilterCategoriesList(searchFilter: CategorySearchFilter) {
    const category = useCategory()
    const categories = await category.getFilterCategoriesStore(searchFilter) as Category[]
    let pagination: Pagination = category.pagination
    let success: boolean = category.success ?? false
    let error_code: string = category.error_code ?? ''
    let message: string = category.message ?? ''
    return { categories, pagination, success, error_code, message }

}
export async function getCategory(categoryId: number) {
    const categoryResponse = useCategory()
    let category: Category = await categoryResponse.getCategoryStore(categoryId) ?? defaultCategory
    let success: boolean = categoryResponse.success ?? false
    let error_code: string = categoryResponse.error_code ?? ''
    let message: string = categoryResponse.message ?? ''
    return { success, error_code, message, category }

}
