import { CreateVariablePayment, defaultVariablePayment, UpdateVariablePayment, VariablePayment, VariablePaymentSearchFilter } from "/@src/models/HR/Payroll/VariablePayment/variablePayment"
import { useVariablePayment } from "/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore"
import { Pagination } from "/@src/utils/response"


export async function addVariablePayment(variablePaymentData: CreateVariablePayment) {
    const variablePaymentRespone = useVariablePayment()
    let variablePayment: VariablePayment = await variablePaymentRespone.createVariablePaymentStore(variablePaymentData) ?? defaultVariablePayment
    let success: boolean = variablePaymentRespone.success ?? false
    let error_code: string = variablePaymentRespone.error_code ?? ''
    let message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}

export async function editVariablePayment(variablePaymentId: number, variablePaymentData: UpdateVariablePayment) {
    const variablePaymentRespone = useVariablePayment()
    let variablePayment: VariablePayment = await variablePaymentRespone.updateVariablePaymentStore(variablePaymentId, variablePaymentData) ?? defaultVariablePayment
    let success: boolean = variablePaymentRespone.success ?? false
    let error_code: string = variablePaymentRespone.error_code ?? ''
    let message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}

export async function getVariablePayment(variablePaymentId: number) {
    const variablePaymentRespone = useVariablePayment()
    let variablePayment: VariablePayment = await variablePaymentRespone.getVariablePaymentStore(variablePaymentId) ?? defaultVariablePayment
    let success: boolean = variablePaymentRespone.success ?? false
    let error_code: string = variablePaymentRespone.error_code ?? ''
    let message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}
export async function getVariablePaymentsList(searchFilter: VariablePaymentSearchFilter) {
    const variablePaymentRespone = useVariablePayment()
    let variablePayments: VariablePayment[] = await variablePaymentRespone.getVariablePaymentsStore(searchFilter) ?? []
    let pagination: Pagination = variablePaymentRespone.pagination
    let success: boolean = variablePaymentRespone.success ?? false
    let error_code: string = variablePaymentRespone.error_code ?? ''
    let message: string = variablePaymentRespone.message ?? ''

    return { variablePayments, pagination, success, error_code, message }

}
