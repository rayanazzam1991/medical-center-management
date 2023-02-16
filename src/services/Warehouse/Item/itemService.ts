import { Item, ItemSearchFilter, defaultItem, ChangeItemStatus, CreateUpdateItem, ItemsInInventorySearchFilter, ItemsInInventory, defaultItemsInInventory } from "/@src/models/Warehouse/Item/item"
import { useItem } from "/@src/stores/Warehouse/Item/itemStore"
import { Pagination } from "/@src/utils/response"


export async function addItem(itemData: CreateUpdateItem) {
    const itemResponse = useItem()
    var item: Item = await itemResponse.addItemStore(itemData) ?? defaultItem
    var success: boolean = itemResponse.success ?? false
    var error_code: string = itemResponse.error_code ?? ''
    var message: string = itemResponse.message ?? ''
    return { success, error_code, message, item }

}

export async function editItem(itemData: CreateUpdateItem) {
    const itemResponse = useItem()
    await itemResponse.editItemStore(itemData)
    await itemResponse.editItemStore(itemData)
    var success: boolean = itemResponse.success ?? false
    var error_code: string = itemResponse.error_code ?? ''
    var message: string = itemResponse.message ?? ''
    return { success, error_code, message }

}
export async function changeItemStatus(itemData: ChangeItemStatus) {
    const itemResponse = useItem()
    await itemResponse.changeItemStatusStore(itemData)
    var success: boolean = itemResponse.success ?? false
    var error_code: string = itemResponse.error_code ?? ''
    var message: string = itemResponse.message ?? ''
    return { success, error_code, message }
}
export async function getItemsList(searchFilter: ItemSearchFilter) {
    const item = useItem()
    await item.getItemsStore(searchFilter)
    var items: Item[] = item.items
    var pagination: Pagination = item.pagination
    var success: boolean = item.success ?? false
    var error_code: string = item.error_code ?? ''
    var message: string = item.message ?? ''

    return { items, pagination, success, error_code, message }

}
export async function getItem(itemId: number) {
    const itemResponse = useItem()
    var item: Item = await itemResponse.getItemStore(itemId) ?? defaultItem
    var success: boolean = itemResponse.success ?? false
    var error_code: string = itemResponse.error_code ?? ''
    var message: string = itemResponse.message ?? ''
    return { success, error_code, message, item }

}
export async function getItemsInInventory(inventory_id: number, searchFilter: ItemsInInventorySearchFilter) {
    const item = useItem()
    const items_in_inventory: ItemsInInventory = await item.getItemsListByInventoryStore(inventory_id, searchFilter) ?? defaultItemsInInventory
    var pagination: Pagination = item.pagination
    var success: boolean = item.success ?? false
    var error_code: string = item.error_code ?? ''
    var message: string = item.message ?? ''

    return { items_in_inventory, pagination, success, error_code, message }

}
