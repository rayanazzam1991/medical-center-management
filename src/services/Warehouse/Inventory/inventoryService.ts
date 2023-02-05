import { Pagination } from "/@src/utils/response"
import { useInventory } from "/@src/stores/Warehouse/Inventory/inventoryStore"
import { Inventory, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"

export async function getInventoriesList(searchFilter: InventorySearchFilter) {
    const inventory = useInventory()
    await inventory.getInventoriesStore(searchFilter)
    let inventories: Inventory[] = inventory.inventories
    let pagination: Pagination = inventory.pagination
    let success: boolean = inventory.success ?? false
    let error_code: string = inventory.error_code ?? ''
    let message: string = inventory.message ?? ''
    return { inventories, pagination, success, error_code, message }

}