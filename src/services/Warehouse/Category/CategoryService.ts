import { Category, CategorySearchFilter, ChangeCategoryStatus, CreateUpdateCategory, defaultCategory } from "/@src/models/Warehouse/Category/category"
import { useCategory } from "/@src/stores/Warehouse/Category/CategoryStore"
import { Pagination } from "/@src/utils/response"


export async function addCategory(categoryData: CreateUpdateCategory) {
    const categoryResponse = useCategory()
    var category: Category = await categoryResponse.addCategoryStore(categoryData) ?? defaultCategory
    var success: boolean = categoryResponse.success ?? false
    var error_code: string = categoryResponse.error_code ?? ''
    var message: string = categoryResponse.message ?? ''
    return { success, error_code, message, category }

}

export async function changeCategoryStatus(categoryData: ChangeCategoryStatus) {
    const categoryResponse = useCategory()
    await categoryResponse.changeCategoryStatusStore(categoryData)
    var success: boolean = categoryResponse.success ?? false
    var error_code: string = categoryResponse.error_code ?? ''
    var message: string = categoryResponse.message ?? ''
    return { success, error_code, message }
}
export async function editCategory(categoryData: CreateUpdateCategory) {
    const categoryResponse = useCategory()
    await categoryResponse.editCategoryStore(categoryData)
    await categoryResponse.editCategoryStore(categoryData)
    var success: boolean = categoryResponse.success ?? false
    var error_code: string = categoryResponse.error_code ?? ''
    var message: string = categoryResponse.message ?? ''
    return { success, error_code, message }

}
export async function getCategoriesList(searchFilter: CategorySearchFilter) {
    const category = useCategory()
    await category.getCategoriesStore(searchFilter)
    var categories: Category[] = category.categories
    console.log(categories)
    var pagination: Pagination = category.pagination
    var success: boolean = category.success ?? false
    var error_code: string = category.error_code ?? ''
    var message: string = category.message ?? ''

    return { categories, pagination, success, error_code, message }

}
export async function getParentsList() {
    const category = useCategory()
    var categories: Category[] = await category.getParentsStore() ?? []
    var pagination: Pagination = category.pagination
    var success: boolean = category.success ?? false
    var error_code: string = category.error_code ?? ''
    var message: string = category.message ?? ''

    return { categories, pagination, success, error_code, message }

}
export async function getCategory(categoryId: number) {
    const categoryResponse = useCategory()
    var category: Category = await categoryResponse.getCategoryStore(categoryId) ?? defaultCategory
    var success: boolean = categoryResponse.success ?? false
    var error_code: string = categoryResponse.error_code ?? ''
    var message: string = categoryResponse.message ?? ''
    return { success, error_code, message, category }

}
