export interface ChartOfAccount{
    id:number
    code:string
  name: string
  has_dynamic_account:boolean
}

export const defaultChartOfAccount: ChartOfAccount = {
  id: 0,
  code:'',
  name: '',
  has_dynamic_account:false
}


export interface ChartOfAccountSearchFilter {
  name?:string
}

export const defaultChartOfAccountSearchFilter: ChartOfAccountSearchFilter= {
  name:''
}

