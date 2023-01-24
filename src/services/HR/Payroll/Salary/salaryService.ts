import { defaultReviewSalaries, ReviewGenerateSalariesRequestBody, ReviewSalaries } from "/@src/models/HR/Payroll/Salary/salary"
import { useSalary } from "/@src/stores/HR/Payoll/Salary/salaryStore"


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

