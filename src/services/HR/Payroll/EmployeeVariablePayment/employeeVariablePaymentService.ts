import { CreateEmployeeVariablePayment, defaultEmployeeVariablePayment, EmployeeVariablePayment, EmployeeVariablePaymentSearchFilter, UpdateEmployeeVariablePayment } from "/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment"
import { useEmployeeVariablePayment } from "/@src/stores/HR/Payoll/EmployeeVariablePayment/employeeVariablePaymentStore"
import { Pagination } from "/@src/utils/response"


export async function addEmployeeVariablePayment(employeeVariablePaymentData: CreateEmployeeVariablePayment) {
    const employeeVariablePaymentRespone = useEmployeeVariablePayment()
    await employeeVariablePaymentRespone.createEmployeeVariablePaymentStore(employeeVariablePaymentData)
    let success: boolean = employeeVariablePaymentRespone.success ?? false
    let error_code: string = employeeVariablePaymentRespone.error_code ?? ''
    let message: string = employeeVariablePaymentRespone.message ?? ''
    return { success, error_code, message }

}

export async function editEmployeeVariablePayment(employeeVariablePaymentId: number, employeeVariablePaymentData: UpdateEmployeeVariablePayment) {
    const employeeVariablePaymentRespone = useEmployeeVariablePayment()
    let employeeVariablePayment: EmployeeVariablePayment = await employeeVariablePaymentRespone.updateEmployeeVariablePaymentStore(employeeVariablePaymentId, employeeVariablePaymentData) ?? defaultEmployeeVariablePayment
    let success: boolean = employeeVariablePaymentRespone.success ?? false
    let error_code: string = employeeVariablePaymentRespone.error_code ?? ''
    let message: string = employeeVariablePaymentRespone.message ?? ''
    return { success, error_code, message, employeeVariablePayment }

}

export async function getEmployeeVariablePayment(employeeVariablePaymentId: number) {
    const employeeVariablePaymentRespone = useEmployeeVariablePayment()
    let employeeVariablePayment: EmployeeVariablePayment = await employeeVariablePaymentRespone.getEmployeeVariablePaymentStore(employeeVariablePaymentId) ?? defaultEmployeeVariablePayment
    let success: boolean = employeeVariablePaymentRespone.success ?? false
    let error_code: string = employeeVariablePaymentRespone.error_code ?? ''
    let message: string = employeeVariablePaymentRespone.message ?? ''
    return { success, error_code, message, employeeVariablePayment }

}
export async function getEmployeeVariablePaymentsList(searchFilter: EmployeeVariablePaymentSearchFilter) {
    const employeeVariablePaymentRespone = useEmployeeVariablePayment()
    let employeeVariablePayments: EmployeeVariablePayment[] = await employeeVariablePaymentRespone.getEmployeeVariablePaymentsStore(searchFilter) ?? []
    let pagination: Pagination = employeeVariablePaymentRespone.pagination
    let success: boolean = employeeVariablePaymentRespone.success ?? false
    let error_code: string = employeeVariablePaymentRespone.error_code ?? ''
    let message: string = employeeVariablePaymentRespone.message ?? ''

    return { employeeVariablePayments, pagination, success, error_code, message }

}
