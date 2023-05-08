import { Employee, defaultEmployee } from "../../Employee/employee";

export interface ServiceProvider {
    id: number
    provider: Employee
    price: number
}
export const defaultServiceProvider: ServiceProvider = {
    id: 0,
    provider: defaultEmployee,
    price: 0
}

