import type { AxiosInstance } from 'axios'
import { CustomResponse } from '../../../response'

export interface Department {
    id: number
    name: string
    status: number
}


export async function getDepartments(
    api: AxiosInstance,
    start = 0,
    limit = 20
): Promise<{ response: CustomResponse; }> {

    const { data: response, headers } = await api.get(
        'department'
    )

    return { response }
}

export async function deleteDepartmentApi(
    api: AxiosInstance,
    departmentId: number
): Promise<{ response: CustomResponse; }> {

    const { data: response, headers } = await api.delete(
        `department/${departmentId}`
    )

    return { response }
}
