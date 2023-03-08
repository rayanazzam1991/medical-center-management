import { CreateVariablePayment, defaultVariablePayment, UpdateVariablePayment, VariablePayment, VariablePaymentSearchFilter } from "/@src/models/HR/Payroll/VariablePayment/variablePayment"
import { defaultWaitingList, WaitingList, WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { useVariablePayment } from "/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore"
import { useWaitingList } from "/@src/stores/Sales/WaitingList/waitingListStore"
import { Pagination } from "/@src/utils/response"



export async function getWaitingLists(searchFilter: WaitingListSearchFilter) {
    const response = useWaitingList()
    let waiting_lists: WaitingList[] = await response.getWaitingListsStore(searchFilter) ?? []
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { waiting_lists, success, error_code, message }

}
export async function getWaitingListByProvider(providerId: number) {
    const response = useWaitingList()
    let waiting_list: WaitingList = await response.getWaitingListByProviderStore(providerId) ?? defaultWaitingList
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { waiting_list, success, error_code, message }

}
