import { Employee, defaultEmployee } from "../../Employee/employee";
import { Service } from "../../Others/Service/service";

export interface ServiceProvider {
    id: number
    provider: Employee
    service?: Service
    price: number
}
export const defaultServiceProvider = <ServiceProvider>{
    id: 0,
    price: 0,
    provider: defaultEmployee,
    service: undefined
}
