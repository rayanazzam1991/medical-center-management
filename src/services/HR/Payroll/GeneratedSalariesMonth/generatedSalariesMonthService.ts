import { defaultGeneratableMonth, GeneratableMonth, GeneratedSalariesMonth } from "/@src/models/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonth"
import { useGeneratedSalariesMonth } from "/@src/stores/HR/Payoll/GeneratedSalariesMonth/generatedSalariesMonthStore"

export async function getGeneratableMonths() {
    const generatedSalariesMonth = useGeneratedSalariesMonth()
    let generatableMonths: GeneratableMonth[] = await generatedSalariesMonth.getGeneratableMonthsStore() ?? []
    let success: boolean = generatedSalariesMonth.success ?? false
    let error_code: string = generatedSalariesMonth.error_code ?? ''
    let message: string = generatedSalariesMonth.message ?? ''
    return { success, error_code, message, generatableMonths }

}
export async function getGeneratedMonths() {
    const generatedSalariesMonth = useGeneratedSalariesMonth()
    let generatedSalariesMonths: GeneratedSalariesMonth[] = await generatedSalariesMonth.getAllGeneratedMonthsStore() ?? []
    let success: boolean = generatedSalariesMonth.success ?? false
    let error_code: string = generatedSalariesMonth.error_code ?? ''
    let message: string = generatedSalariesMonth.message ?? ''
    return { success, error_code, message, generatedSalariesMonths }

}


