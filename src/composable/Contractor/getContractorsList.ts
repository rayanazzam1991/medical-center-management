import { useContractor } from "/@src/stores/Contractor/contractorStore"
import { ContractorSearchFilter, Contractor } from "/@src/utils/api/Contractor"
import { Pagination } from "/@src/utils/response"

export async function getContractorsList(searchFilter: ContractorSearchFilter) {
  const contractor = useContractor()
  await contractor.getContractorsStore(searchFilter)

  var contractors: Contractor[] = contractor.contractors
  var pagination: Pagination = contractor.pagination
  return { contractors, pagination }
}
