import { Category, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { useCategory } from "/@src/stores/Warehouse/Category/CategoryStore"
import { Pagination } from "/@src/utils/response"


export async function addCategory(categoryData: Category) {
    const category = useCategory()
    return await category.addCategoryStore(categoryData)
}

export async function deleteCategory(categoryId: number) {
    const category = useCategory()
    await category.deleteCategoryStore(categoryId)
}
export async function editCategory(categoryData: Category) {
    const category = useCategory()
    await category.editCategoryStore(categoryData)
}
export async function getCategoriesList(searchFilter: CategorySearchFilter) {
    const category = useCategory()
    await category.getCategoriesStore(searchFilter)
    var categories: Category[] = category.categories
    var pagination: Pagination = category.pagination
    return { categories, pagination }

}
export async function getCategory(categoryId: number) {
    const category = useCategory()
    return await category.getCategoryStore(categoryId)
}
export async function deactivateCategory(categoryId: number) {
    const category = useCategory()
    await category.deactivateCategoryStore(categoryId)
}
export async function activateCategory(categoryId: number) {
    const category = useCategory()
    await category.activateCategoryStore(categoryId)
}
