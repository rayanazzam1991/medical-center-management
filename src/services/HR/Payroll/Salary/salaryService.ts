import { defaultReviewSalaries, defaultSalary, DeliveringSalariesSearchFilter, DeliveringSalary, OnholdSalariesSearchFilter, OnholdSalary, ReviewGenerateSalariesRequestBody, ReviewSalaries, Salary, SalarySearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { useSalary } from "/@src/stores/HR/Payoll/Salary/salaryStore"
import { Pagination } from "/@src/utils/response"


export async function getReviewSalary(reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody) {
    const salaryResponse = useSalary()
    let reviewSalaries: ReviewSalaries = await salaryResponse.reviewSalariesStore(reviewGenerateSalariesRequestBody) ?? defaultReviewSalaries
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''
    return { success, error_code, message, reviewSalaries }

}
export async function getGenerateSalary(reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody) {
    const salaryResponse = useSalary()
    await salaryResponse.generateSalariesStore(reviewGenerateSalariesRequestBody)
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''
    return { success, error_code, message }
}

export async function getDeliveringSalariesList(searchFilter: DeliveringSalariesSearchFilter) {
    const salaryResponse = useSalary()
    let deliveringSalaries: DeliveringSalary[] = await salaryResponse.getDeliveringSalariesStore(searchFilter) ?? []
    let pagination: Pagination = salaryResponse.pagination
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''

    return { deliveringSalaries, pagination, success, error_code, message }

}
export async function getOnholdSalariesList(searchFilter: OnholdSalariesSearchFilter) {
    const salaryResponse = useSalary()
    let onholdSalaries: OnholdSalary[] = await salaryResponse.getOnholdSalariesStore(searchFilter) ?? []
    let pagination: Pagination = salaryResponse.pagination
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''

    return { onholdSalaries, pagination, success, error_code, message }

}
export async function getSalariesList(selectedMonth: ReviewGenerateSalariesRequestBody, searchFilter: SalarySearchFilter) {
    const salaryResponse = useSalary()
    let salaries: Salary[] = await salaryResponse.getSalariesStore(selectedMonth, searchFilter) ?? []
    let pagination: Pagination = salaryResponse.pagination
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''

    return { salaries, pagination, success, error_code, message }

}
export async function paySalaryService(salaryId: number) {
    const salaryResponse = useSalary()
    await salaryResponse.paySalaryStore(salaryId)
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''

    return { success, error_code, message }

}
export async function returnSalaryService(salaryId: number) {
    const salaryResponse = useSalary()
    await salaryResponse.returnSalaryStore(salaryId)
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''
    return { success, error_code, message }
}
export async function moveSalariesToOnholdList() {
    const salaryResponse = useSalary()
    await salaryResponse.moveSalariesToOnholdStore()
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''
    return { success, error_code, message }
}
export async function getSalaryPayslip(salaryId: number) {
    const salaryResponse = useSalary()
    let salary: Salary = await salaryResponse.getSalaryPayslipStore(salaryId) ?? defaultSalary
    let success: boolean = salaryResponse.success ?? false
    let error_code: string = salaryResponse.error_code ?? ''
    let message: string = salaryResponse.message ?? ''

    return { salary, success, error_code, message }

}

