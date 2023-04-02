import { defaultUser, User } from "../Others/User/user"
import { Employee,defaultEmployee } from "./employee"
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})
export interface EmployeeHistory {
  employee_id: number
  notes?: string
  status?: number
  created_at?: string
  created_by?: User
}
export interface DismissedEmployee {
  employee_id: number
  notes?: string
}

export const defaultDismissedEmployee: DismissedEmployee ={
  employee_id: 0,
  notes: undefined
}

export const defaultEmployeeHistory: EmployeeHistory = {
  employee_id:0,
  notes: undefined,
  status: undefined,
  created_at: undefined,
  created_by:undefined
}
export interface EmployeeHistorySearchFilter {
  employee_name?: string
  notes?: string
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}
export const defaultEmployeeHistorySearchFilter = <EmployeeHistorySearchFilter>{}


class EmployeeStatusConsts {
  static readonly ACTIVE = 1;
  static readonly INACTIVE = 2;
  static readonly DISMISSED = 3;


  public static getStatusName(status: number) {
      if (status == this.ACTIVE)
          return i18n.global.t('employee.employee_statuses.active')
      if (status == this.INACTIVE)
          return i18n.global.t('employee.employee_statuses.inactive')
      if (status == this.DISMISSED)
          return i18n.global.t('employee.employee_statuses.dismissed')
      else return '';
  }
  public static getStatusColor(status: number) {
      if (status == this.ACTIVE)
          return 'success'
      if (status == this.INACTIVE)
          return 'info'
      if (status == this.DISMISSED)
          return 'danger'
      else return undefined;
  }


}

export { EmployeeStatusConsts }




