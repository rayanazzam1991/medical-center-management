import { CreateVariablePayment, defaultVariablePayment, UpdateVariablePayment, VariablePayment } from "/@src/models/HR/Payroll/VariablePayment/variablePayment"
import { useVariablePayment } from "/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore"
import { Pagination } from "/@src/utils/response"


export async function addVariablePayment(variablePaymentData: CreateVariablePayment) {
    const variablePaymentRespone = useVariablePayment()
    var variablePayment: VariablePayment = await variablePaymentRespone.createVariablePaymentStore(variablePaymentData) ?? defaultVariablePayment
    var success: boolean = variablePaymentRespone.success ?? false
    var error_code: string = variablePaymentRespone.error_code ?? ''
    var message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}

export async function editVariablePayment(variablePaymentId: number, variablePaymentData: UpdateVariablePayment) {
    const variablePaymentRespone = useVariablePayment()
    var variablePayment: VariablePayment = await variablePaymentRespone.updateVariablePaymentStore(variablePaymentId, variablePaymentData) ?? defaultVariablePayment
    var success: boolean = variablePaymentRespone.success ?? false
    var error_code: string = variablePaymentRespone.error_code ?? ''
    var message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}

export async function getVariablePayment(variablePaymentId: number) {
    const variablePaymentRespone = useVariablePayment()
    var variablePayment: VariablePayment = await variablePaymentRespone.getVariablePaymentStore(variablePaymentId) ?? defaultVariablePayment
    var success: boolean = variablePaymentRespone.success ?? false
    var error_code: string = variablePaymentRespone.error_code ?? ''
    var message: string = variablePaymentRespone.message ?? ''
    return { success, error_code, message, variablePayment }

}
