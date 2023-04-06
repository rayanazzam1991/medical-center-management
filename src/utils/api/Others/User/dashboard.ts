import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response";
import { AxiosInstance } from "axios";



export async function getAdminDashboardApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`dashboard/getAdminDashboard`)

  return { response }
}


export async function getInventoryDashboardApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`dashboard/getInventoryDashboard`)

    return { response }
}
export async function getHumanResourcesDashboadApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`dashboard/getHumanResourcesDashboard`)

    return { response }
}
export async function getAnalystDashboadApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`dashboard/getAnalystDashboard`)

    return { response }
}
