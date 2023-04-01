import { defaultUser, User } from "/@src/models/Others/User/user"

export interface Role {
    id: number,
    name: string,
    description?: string,
    display_name: string,
    users_count?: number,
    created_by?: User,
    created_at?: string,
    permissions: Permission[]
}

export interface Permission {
    id: number,
    name: string,
    display_name: string

}
export const defaultRole: Role = {
    id: 0,
    display_name: '',
    name: '',
    permissions: [],
    created_at: '',
    created_by: defaultUser,
    description: undefined,
    users_count: undefined,

}


export enum Permissions {
    ACCOUNT_ACCESS = 'account_access',
    ACCOUNT_SHOW = 'account_show',
    ACCOUNT_CREATE = 'account_create',
    ACCOUNT_DELETE = 'account_delete',
    ACCOUNT_EDIT = 'account_edit',
    ACCOUNT_LIST = 'account_list',
    ACCOUNT_CONTACT_ACCESS = 'account_contact_access',
    ACCOUNT_CONTACT_SHOW = 'account_contact_show',
    ACCOUNT_CONTACT_CREATE = 'account_contact_create',
    ACCOUNT_CONTACT_DELETE = 'account_contact_delete',
    ACCOUNT_CONTACT_EDIT = 'account_contact_edit',
    ACCOUNT_CONTACT_LIST = 'account_contact_list',
    ATTENDANCE_ACCESS = 'attendance_access',
    ATTENDANCE_SHOW = 'attendance_show',
    ATTENDANCE_CREATE = 'attendance_create',
    ATTENDANCE_DELETE = 'attendance_delete',
    ATTENDANCE_EDIT = 'attendance_edit',
    ATTENDANCE_LIST = 'attendance_list',
    ATTENDANCE_JUSTIFICATION_ACCESS = 'attendance_justification_access',
    ATTENDANCE_JUSTIFICATION_SHOW = 'attendance_justification_show',
    ATTENDANCE_JUSTIFICATION_CREATE = 'attendance_justification_create',
    ATTENDANCE_JUSTIFICATION_DELETE = 'attendance_justification_delete',
    ATTENDANCE_JUSTIFICATION_EDIT = 'attendance_justification_edit',
    ATTENDANCE_JUSTIFICATION_LIST = 'attendance_justification_list',
    BALANCE_ACCESS_ACCESS = 'balance_access_access',
    BALANCE_ACCESS_SHOW = 'balance_access_show',
    BALANCE_ACCESS_CREATE = 'balance_access_create',
    BALANCE_ACCESS_DELETE = 'balance_access_delete',
    BALANCE_ACCESS_EDIT = 'balance_access_edit',
    BALANCE_ACCESS_LIST = 'balance_access_list',
    CATEGORY_ACCESS = 'category_access',
    CATEGORY_SHOW = 'category_show',
    CATEGORY_CREATE = 'category_create',
    CATEGORY_DELETE = 'category_delete',
    CATEGORY_EDIT = 'category_edit',
    CATEGORY_LIST = 'category_list',
    CATEGORY_TYPE_ACCESS = 'category_type_access',
    CATEGORY_TYPE_SHOW = 'category_type_show',
    CATEGORY_TYPE_CREATE = 'category_type_create',
    CATEGORY_TYPE_DELETE = 'category_type_delete',
    CATEGORY_TYPE_EDIT = 'category_type_edit',
    CATEGORY_TYPE_LIST = 'category_type_list',
    CHANGE_RATE_HISTORY_ACCESS = 'change_rate_history_access',
    CHANGE_RATE_HISTORY_SHOW = 'change_rate_history_show',
    CHANGE_RATE_HISTORY_CREATE = 'change_rate_history_create',
    CHANGE_RATE_HISTORY_DELETE = 'change_rate_history_delete',
    CHANGE_RATE_HISTORY_EDIT = 'change_rate_history_edit',
    CHANGE_RATE_HISTORY_LIST = 'change_rate_history_list',
    CHART_OF_ACCOUNT_ACCESS = 'chart_of_account_access',
    CHART_OF_ACCOUNT_SHOW = 'chart_of_account_show',
    CHART_OF_ACCOUNT_CREATE = 'chart_of_account_create',
    CHART_OF_ACCOUNT_DELETE = 'chart_of_account_delete',
    CHART_OF_ACCOUNT_EDIT = 'chart_of_account_edit',
    CHART_OF_ACCOUNT_LIST = 'chart_of_account_list',
    CITY_ACCESS = 'city_access',
    CITY_SHOW = 'city_show',
    CITY_CREATE = 'city_create',
    CITY_DELETE = 'city_delete',
    CITY_EDIT = 'city_edit',
    CITY_LIST = 'city_list',
    CONTRACTOR_ACCESS = 'contractor_access',
    CONTRACTOR_SHOW = 'contractor_show',
    CONTRACTOR_CREATE = 'contractor_create',
    CONTRACTOR_DELETE = 'contractor_delete',
    CONTRACTOR_EDIT = 'contractor_edit',
    CONTRACTOR_LIST = 'contractor_list',
    CONTRACTOR_SERVICE_ACCESS = 'contractor_service_access',
    CONTRACTOR_SERVICE_SHOW = 'contractor_service_show',
    CONTRACTOR_SERVICE_CREATE = 'contractor_service_create',
    CONTRACTOR_SERVICE_DELETE = 'contractor_service_delete',
    CONTRACTOR_SERVICE_EDIT = 'contractor_service_edit',
    CONTRACTOR_SERVICE_LIST = 'contractor_service_list',
    CURRENCY_ACCESS = 'currency_access',
    CURRENCY_SHOW = 'currency_show',
    CURRENCY_CREATE = 'currency_create',
    CURRENCY_DELETE = 'currency_delete',
    CURRENCY_EDIT = 'currency_edit',
    CURRENCY_LIST = 'currency_list',
    CUSTOMER_ACCESS = 'customer_access',
    CUSTOMER_SHOW = 'customer_show',
    CUSTOMER_CREATE = 'customer_create',
    CUSTOMER_DELETE = 'customer_delete',
    CUSTOMER_EDIT = 'customer_edit',
    CUSTOMER_LIST = 'customer_list',
    CUSTOMER_GROUP_ACCESS = 'customer_group_access',
    CUSTOMER_GROUP_SHOW = 'customer_group_show',
    CUSTOMER_GROUP_CREATE = 'customer_group_create',
    CUSTOMER_GROUP_DELETE = 'customer_group_delete',
    CUSTOMER_GROUP_EDIT = 'customer_group_edit',
    CUSTOMER_GROUP_LIST = 'customer_group_list',
    CUSTOMER_SOCIAL_MEDIA_ACCESS = 'customer_social_media_access',
    CUSTOMER_SOCIAL_MEDIA_SHOW = 'customer_social_media_show',
    CUSTOMER_SOCIAL_MEDIA_CREATE = 'customer_social_media_create',
    CUSTOMER_SOCIAL_MEDIA_DELETE = 'customer_social_media_delete',
    CUSTOMER_SOCIAL_MEDIA_EDIT = 'customer_social_media_edit',
    CUSTOMER_SOCIAL_MEDIA_LIST = 'customer_social_media_list',
    DATE_ACCESS = 'date_access',
    DATE_SHOW = 'date_show',
    DATE_CREATE = 'date_create',
    DATE_DELETE = 'date_delete',
    DATE_EDIT = 'date_edit',
    DATE_LIST = 'date_list',
    DEPARTMENT_ACCESS = 'department_access',
    DEPARTMENT_SHOW = 'department_show',
    DEPARTMENT_CREATE = 'department_create',
    DEPARTMENT_DELETE = 'department_delete',
    DEPARTMENT_EDIT = 'department_edit',
    DEPARTMENT_LIST = 'department_list',
    EMPLOYEE_ACCESS = 'employee_access',
    EMPLOYEE_SHOW = 'employee_show',
    EMPLOYEE_CREATE = 'employee_create',
    EMPLOYEE_DELETE = 'employee_delete',
    EMPLOYEE_EDIT = 'employee_edit',
    EMPLOYEE_LIST = 'employee_list',
    EMPLOYEE_RECORD_LIST = 'employee_record_list',
    DISMISS_EMPLOYEE='dismiss_employee',
    EMPLOYEE_SCHEDULE_ACCESS = 'employee_schedule_access',
    EMPLOYEE_SCHEDULE_SHOW = 'employee_schedule_show',
    EMPLOYEE_SCHEDULE_CREATE = 'employee_schedule_create',
    EMPLOYEE_SCHEDULE_DELETE = 'employee_schedule_delete',
    EMPLOYEE_SCHEDULE_EDIT = 'employee_schedule_edit',
    EMPLOYEE_SCHEDULE_LIST = 'employee_schedule_list',
    EMPLOYEE_VARIABLE_PAYMENT_ACCESS = 'employee_variable_payment_access',
    EMPLOYEE_VARIABLE_PAYMENT_SHOW = 'employee_variable_payment_show',
    EMPLOYEE_VARIABLE_PAYMENT_CREATE = 'employee_variable_payment_create',
    EMPLOYEE_VARIABLE_PAYMENT_DELETE = 'employee_variable_payment_delete',
    EMPLOYEE_VARIABLE_PAYMENT_EDIT = 'employee_variable_payment_edit',
    EMPLOYEE_VARIABLE_PAYMENT_LIST = 'employee_variable_payment_list',
    GENERATED_SALARIES_MONTH_ACCESS = 'generated_salaries_month_access',
    GENERATED_SALARIES_MONTH_SHOW = 'generated_salaries_month_show',
    GENERATED_SALARIES_MONTH_CREATE = 'generated_salaries_month_create',
    GENERATED_SALARIES_MONTH_DELETE = 'generated_salaries_month_delete',
    GENERATED_SALARIES_MONTH_EDIT = 'generated_salaries_month_edit',
    GENERATED_SALARIES_MONTH_LIST = 'generated_salaries_month_list',
    INVENTORY_ACCESS = 'inventory_access',
    INVENTORY_SHOW = 'inventory_show',
    INVENTORY_CREATE = 'inventory_create',
    INVENTORY_DELETE = 'inventory_delete',
    INVENTORY_EDIT = 'inventory_edit',
    INVENTORY_LIST = 'inventory_list',
    INVENTORY_ITEM_ACCESS = 'inventory_item_access',
    INVENTORY_ITEM_SHOW = 'inventory_item_show',
    INVENTORY_ITEM_CREATE = 'inventory_item_create',
    INVENTORY_ITEM_DELETE = 'inventory_item_delete',
    INVENTORY_ITEM_EDIT = 'inventory_item_edit',
    INVENTORY_ITEM_LIST = 'inventory_item_list',
    INVENTORY_ITEM_HISTORY_ACCESS = 'inventory_item_history_access',
    INVENTORY_ITEM_HISTORY_SHOW = 'inventory_item_history_show',
    INVENTORY_ITEM_HISTORY_CREATE = 'inventory_item_history_create',
    INVENTORY_ITEM_HISTORY_DELETE = 'inventory_item_history_delete',
    INVENTORY_ITEM_HISTORY_EDIT = 'inventory_item_history_edit',
    INVENTORY_ITEM_HISTORY_LIST = 'inventory_item_history_list',
    ITEM_ACCESS = 'item_access',
    ITEM_SHOW = 'item_show',
    ITEM_CREATE = 'item_create',
    ITEM_DELETE = 'item_delete',
    ITEM_EDIT = 'item_edit',
    ITEM_LIST = 'item_list',
    JOURNAL_ENTRY_ACCESS = 'journal_entry_access',
    JOURNAL_ENTRY_SHOW = 'journal_entry_show',
    JOURNAL_ENTRY_CREATE = 'journal_entry_create',
    JOURNAL_ENTRY_DELETE = 'journal_entry_delete',
    JOURNAL_ENTRY_EDIT = 'journal_entry_edit',
    JOURNAL_ENTRY_LIST = 'journal_entry_list',
    MEDIA_ACCESS = 'media_access',
    MEDIA_SHOW = 'media_show',
    MEDIA_CREATE = 'media_create',
    MEDIA_DELETE = 'media_delete',
    MEDIA_EDIT = 'media_edit',
    MEDIA_LIST = 'media_list',
    MEDICAL_INFO_ACCESS = 'medical_info_access',
    MEDICAL_INFO_SHOW = 'medical_info_show',
    MEDICAL_INFO_CREATE = 'medical_info_create',
    MEDICAL_INFO_DELETE = 'medical_info_delete',
    MEDICAL_INFO_EDIT = 'medical_info_edit',
    MEDICAL_INFO_LIST = 'medical_info_list',
    NATIONALITY_ACCESS = 'nationality_access',
    NATIONALITY_SHOW = 'nationality_show',
    NATIONALITY_CREATE = 'nationality_create',
    NATIONALITY_DELETE = 'nationality_delete',
    NATIONALITY_EDIT = 'nationality_edit',
    NATIONALITY_LIST = 'nationality_list',
    PERMISSION_ACCESS = 'permission_access',
    PERMISSION_SHOW = 'permission_show',
    PERMISSION_CREATE = 'permission_create',
    PERMISSION_DELETE = 'permission_delete',
    PERMISSION_EDIT = 'permission_edit',
    PERMISSION_LIST = 'permission_list',
    PERSONAL_ACCESS_TOKEN_ACCESS = 'personal_access_token_access',
    PERSONAL_ACCESS_TOKEN_SHOW = 'personal_access_token_show',
    PERSONAL_ACCESS_TOKEN_CREATE = 'personal_access_token_create',
    PERSONAL_ACCESS_TOKEN_DELETE = 'personal_access_token_delete',
    PERSONAL_ACCESS_TOKEN_EDIT = 'personal_access_token_edit',
    PERSONAL_ACCESS_TOKEN_LIST = 'personal_access_token_list',
    POSITION_ACCESS = 'position_access',
    POSITION_SHOW = 'position_show',
    POSITION_CREATE = 'position_create',
    POSITION_DELETE = 'position_delete',
    POSITION_EDIT = 'position_edit',
    POSITION_LIST = 'position_list',
    PROVIDER_TURN_NUMBER_ACCESS = 'provider_turn_number_access',
    PROVIDER_TURN_NUMBER_SHOW = 'provider_turn_number_show',
    PROVIDER_TURN_NUMBER_CREATE = 'provider_turn_number_create',
    PROVIDER_TURN_NUMBER_DELETE = 'provider_turn_number_delete',
    PROVIDER_TURN_NUMBER_EDIT = 'provider_turn_number_edit',
    PROVIDER_TURN_NUMBER_LIST = 'provider_turn_number_list',
    REMINDER_ACCESS = 'reminder_access',
    REMINDER_SHOW = 'reminder_show',
    REMINDER_CREATE = 'reminder_create',
    REMINDER_DELETE = 'reminder_delete',
    REMINDER_EDIT = 'reminder_edit',
    REMINDER_LIST = 'reminder_list',
    ROLE_ACCESS = 'role_access',
    ROLE_SHOW = 'role_show',
    ROLE_CREATE = 'role_create',
    ROLE_DELETE = 'role_delete',
    ROLE_EDIT = 'role_edit',
    ROLE_LIST = 'role_list',
    ROLE_HAS_PERMISSION_ACCESS = 'role_has_permission_access',
    ROLE_HAS_PERMISSION_SHOW = 'role_has_permission_show',
    ROLE_HAS_PERMISSION_CREATE = 'role_has_permission_create',
    ROLE_HAS_PERMISSION_DELETE = 'role_has_permission_delete',
    ROLE_HAS_PERMISSION_EDIT = 'role_has_permission_edit',
    ROLE_HAS_PERMISSION_LIST = 'role_has_permission_list',
    ROOM_ACCESS = 'room_access',
    ROOM_SHOW = 'room_show',
    ROOM_CREATE = 'room_create',
    ROOM_DELETE = 'room_delete',
    ROOM_EDIT = 'room_edit',
    ROOM_LIST = 'room_list',
    SALARY_ACCESS = 'salary_access',
    SALARY_SHOW = 'salary_show',
    SALARY_CREATE = 'salary_create',
    SALARY_DELETE = 'salary_delete',
    SALARY_EDIT = 'salary_edit',
    SALARY_LIST = 'salary_list',
    SERVICE_ACCESS = 'service_access',
    SERVICE_SHOW = 'service_show',
    SERVICE_CREATE = 'service_create',
    SERVICE_DELETE = 'service_delete',
    SERVICE_EDIT = 'service_edit',
    SERVICE_LIST = 'service_list',
    SERVICE_HISTORY_SCREEN_ACCESS = 'service_history_screen_access',
    SERVICE_HISTORY_SCREEN_SHOW = 'service_history_screen_show',
    SERVICE_HISTORY_SCREEN_CREATE = 'service_history_screen_create',
    SERVICE_HISTORY_SCREEN_DELETE = 'service_history_screen_delete',
    SERVICE_HISTORY_SCREEN_EDIT = 'service_history_screen_edit',
    SERVICE_HISTORY_SCREEN_LIST = 'service_history_screen_list',
    SERVICE_ITEM_ACCESS = 'service_item_access',
    SERVICE_ITEM_SHOW = 'service_item_show',
    SERVICE_ITEM_CREATE = 'service_item_create',
    SERVICE_ITEM_DELETE = 'service_item_delete',
    SERVICE_ITEM_EDIT = 'service_item_edit',
    SERVICE_ITEM_LIST = 'service_item_list',
    SERVICE_PROVIDER_ACCESS = 'service_provider_access',
    SERVICE_PROVIDER_SHOW = 'service_provider_show',
    SERVICE_PROVIDER_CREATE = 'service_provider_create',
    SERVICE_PROVIDER_DELETE = 'service_provider_delete',
    SERVICE_PROVIDER_EDIT = 'service_provider_edit',
    SERVICE_PROVIDER_LIST = 'service_provider_list',
    SETTING_ACCESS = 'setting_access',
    SETTING_SHOW = 'setting_show',
    SETTING_CREATE = 'setting_create',
    SETTING_DELETE = 'setting_delete',
    SETTING_EDIT = 'setting_edit',
    SETTING_LIST = 'setting_list',
    SOCIAL_MEDIA_ACCESS = 'social_media_access',
    SOCIAL_MEDIA_SHOW = 'social_media_show',
    SOCIAL_MEDIA_CREATE = 'social_media_create',
    SOCIAL_MEDIA_DELETE = 'social_media_delete',
    SOCIAL_MEDIA_EDIT = 'social_media_edit',
    SOCIAL_MEDIA_LIST = 'social_media_list',
    SPECIALITY_ACCESS = 'speciality_access',
    SPECIALITY_SHOW = 'speciality_show',
    SPECIALITY_CREATE = 'speciality_create',
    SPECIALITY_DELETE = 'speciality_delete',
    SPECIALITY_EDIT = 'speciality_edit',
    SPECIALITY_LIST = 'speciality_list',
    SUPPLIER_ACCESS = 'supplier_access',
    SUPPLIER_SHOW = 'supplier_show',
    SUPPLIER_CREATE = 'supplier_create',
    SUPPLIER_DELETE = 'supplier_delete',
    SUPPLIER_EDIT = 'supplier_edit',
    SUPPLIER_LIST = 'supplier_list',
    TICKET_ACCESS = 'ticket_access',
    TICKET_SHOW = 'ticket_show',
    TICKET_CREATE = 'ticket_create',
    TICKET_DELETE = 'ticket_delete',
    TICKET_EDIT = 'ticket_edit',

    TICKET_LIST = 'ticket_list',
    CONFIRM_PAYMENT_TICKET='confirm_payment_ticket',
    PNDING_TICKET_LIST = 'pending_ticket_list',
    TICKET_SERVICE_ACCESS = 'ticket_service_access',
    TICKET_SERVICE_SHOW = 'ticket_service_show',
    TICKET_SERVICE_CREATE = 'ticket_service_create',
    TICKET_SERVICE_DELETE = 'ticket_service_delete',
    TICKET_SERVICE_EDIT = 'ticket_service_edit',
    TICKET_SERVICE_LIST = 'ticket_service_list',
    TRANSACTION_ACCESS = 'transaction_access',
    TRANSACTION_SHOW = 'transaction_show',
    TRANSACTION_CREATE = 'transaction_create',
    TRANSACTION_DELETE = 'transaction_delete',
    TRANSACTION_EDIT = 'transaction_edit',
    TRANSACTION_LIST = 'transaction_list',
    TRANSACTION_TYPE_ACCESS = 'transaction_type_access',
    TRANSACTION_TYPE_SHOW = 'transaction_type_show',
    TRANSACTION_TYPE_CREATE = 'transaction_type_create',
    TRANSACTION_TYPE_DELETE = 'transaction_type_delete',
    TRANSACTION_TYPE_EDIT = 'transaction_type_edit',
    TRANSACTION_TYPE_LIST = 'transaction_type_list',
    USER_ACCESS = 'user_access',
    USER_SHOW = 'user_show',
    USER_CREATE = 'user_create',
    USER_DELETE = 'user_delete',
    USER_EDIT = 'user_edit',
    USER_LIST = 'user_list',
    USER_STATUS_ACCESS = 'user_status_access',
    USER_STATUS_SHOW = 'user_status_show',
    USER_STATUS_CREATE = 'user_status_create',
    USER_STATUS_DELETE = 'user_status_delete',
    USER_STATUS_EDIT = 'user_status_edit',
    USER_STATUS_LIST = 'user_status_list',
    VARIABLE_PAYMENT_ACCESS = 'variable_payment_access',
    VARIABLE_PAYMENT_SHOW = 'variable_payment_show',
    VARIABLE_PAYMENT_CREATE = 'variable_payment_create',
    VARIABLE_PAYMENT_DELETE = 'variable_payment_delete',
    VARIABLE_PAYMENT_EDIT = 'variable_payment_edit',
    VARIABLE_PAYMENT_LIST = 'variable_payment_list',
    WAITING_LIST_ACCESS = 'waiting_list_access',
    WAITING_LIST_SHOW = 'waiting_list_show',
    WAITING_LIST_CREATE = 'waiting_list_create',
    WAITING_LIST_DELETE = 'waiting_list_delete',
    WAITING_LIST_EDIT = 'waiting_list_edit',
    WAITING_LIST_LIST = 'waiting_list_list',
    WALLET_ACCESS = 'wallet_access',
    WALLET_SHOW = 'wallet_show',
    WALLET_CREATE = 'wallet_create',
    WALLET_DELETE = 'wallet_delete',
    WALLET_EDIT = 'wallet_edit',
    WALLET_LIST = 'wallet_list',
    WALLET_MOVEMENT_ACCESS = 'wallet_movement_access',
    WALLET_MOVEMENT_SHOW = 'wallet_movement_show',
    WALLET_MOVEMENT_CREATE = 'wallet_movement_create',
    WALLET_MOVEMENT_DELETE = 'wallet_movement_delete',
    WALLET_MOVEMENT_EDIT = 'wallet_movement_edit',
    WALLET_MOVEMENT_LIST = 'wallet_movement_list',

    PHONE_CHECK = 'phone_check',
    TRIAL_BALANCE_GENERATE = 'trial_balance_generate',
    BALANCE_SHEET_GENERATE = 'balance_sheet_generate',
    INCOME_STATEMENT_GENERATE = 'income_statement_generate',
    DELIVER_SALARY_LIST = 'deliver_salary_list',
    ONHOLD_SALARY_LIST = 'onhold_salary_list',
    SALARIES_REVIEW = 'salaries_review',
    SALARIES_GENERATE = 'salaries_generate',
    SALARY_PAY = 'salary_pay',
    SALARY_RETURN = 'salary_return',
    SALARY_MOVE_TO_ONHOLD = 'salary_move_to_onhold',
  TICKET_CLOSE = 'ticket_close',
    ACTIVITY_LOG_LIST = 'activity_log_list',
    RESET_PASSWORD = 'reset_password',
    CHANGE_PASSWORD = 'change_password',
    SHOW_WAITING_LIST_SERVE_CLIENT = 'show_waiting_list_serve_client',
    SHOW_ALL_WAITING_LISTS = 'show_all_waiting_lists',


    ACCOUNTING_ACCESS = 'accounting_access',
    HR_ACCESS = 'hr_access',
    OTHERS_ACCESS = 'others_access',
    CRM_ACCESS = 'crm_access',
    TICKETING_ACCESS = 'ticketing_access',
    INVENTORY_SECTION_ACCESS = 'inventory_section_access',




}
