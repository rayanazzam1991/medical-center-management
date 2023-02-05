import { AxiosInstance } from "axios"
import { InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
import { CustomResponseSingle, CustomResponseCollection } from "/@src/utils/response"



export async function getInventoriesApi(
    api: AxiosInstance,
    searchFilter: InventorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('inventory/getInventoriesList', {
        params: searchFilter,
    })
    return { response }
}