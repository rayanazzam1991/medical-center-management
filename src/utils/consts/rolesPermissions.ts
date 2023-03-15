interface Role {
    id: number,
    name: string,
    permissions: Permission[]
}

interface Permission {
    name: string
}

export enum Roles {
    ADMIN = 'Admin',
    HR = 'HR',
}

export enum Permissions {
    CITY_ACCESS = 'city_access',
    CITY_SHOW = 'city_show',
    CITY_CREATE = 'city_create',
    CITY_EDIT = 'city_edit',
    CITY_DELETE = 'city_delete',
    CITY_GETCITYLIST = 'city_getCityList',
    ROOM_ACCESS = 'room_access',
    ROOM_SHOW = 'room_show',
    ROOM_CREATE = 'room_create',
    ROOM_EDIT = 'room_edit',
    ROOM_DELETE = 'room_delete',
    ROOM_GETROOMLIST = 'room_getRoomList',
    DEPARTMENT_ACCESS = 'department_access',
    DEPARTMENT_SHOW = 'department_show',
    DEPARTMENT_CREATE = 'department_create',
    DEPARTMENT_EDIT = 'department_edit',
    DEPARTMENT_DELETE = 'department_delete',
    DEPARTMENT_GETDEPARTMENTLIST = 'department_getDepartmentList',
    CUSTOMER_GROUP_ACCESS = 'customer_group_access',
    CUSTOMER_GROUP_SHOW = 'customer_group_show',
    CUSTOMER_GROUP_CREATE = 'customer_group_create',
    CUSTOMER_GROUP_EDIT = 'customer_group_edit',
    CUSTOMER_GROUP_DELETE = 'customer_group_delete',
    CUSTOMER_GROUP_GETCUSTOMERGROUPLIST = 'customer_group_getCustomerGroupList',
    NATIONALITY_ACCESS = 'nationality_access',
    NATIONALITY_SHOW = 'nationality_show',
    NATIONALITY_CREATE = 'nationality_create',
    NATIONALITY_EDIT = 'nationality_edit',
    NATIONALITY_DELETE = 'nationality_delete',
    NATIONALITY_GETNATIONALITYLIST = 'nationality_getNationalityList',
}