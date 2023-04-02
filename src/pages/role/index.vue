<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "role_list"
    ]
  }
}
</route>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { deleteRoom, getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { getRolesList } from '/@src/services/Others/Role/roleService'
import { Role } from '/@src/utils/consts/rolesPermissions'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultRoomSearchFilter, RoomSearchFilter, RoomConsts, Room } from '/@src/models/Others/Room/room'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useRoom } from '/@src/stores/Others/Room/roomStore'
import sleep from '/@src/utils/sleep'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import ViewEditDropDown from '/@src/components/OurComponents/ViewEditDropDown.vue'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
import { useRole } from '/@src/stores/Others/Role/roleStore'
import RoleTableHeader from '/@src/components/OurComponents/Others/Role/RoleTableHeader.vue'
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('role.table.title'))
useHead({
  title: t('role.table.title'),
})
const notif = useNotyf() as Notyf
const rolesList = ref<Array<Role>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const roleStore = useRole()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
  const { roles, pagination } = await getRolesList()
  rolesList.value = roles
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});



const columns = {
  display_name: {
    align: 'center',
    label: t('role.table.columns.name')

  },
  users_count: {
    align: 'center',
    label: t('role.table.columns.users_count')


  },
  created_at: {
    align: 'center',
    label: t('role.table.columns.created_at')

  },
  created_by: {
    align: 'center',
    label: t('role.table.columns.created_by'),
    renderRow: (row: Role) =>
      h('span', row?.created_by?.first_name + ' ' + row.created_by?.last_name ?? '-')
  },
  actions: {
    align: 'center',
    label: t('role.table.columns.actions'),

    renderRow: (row: any) =>
      h(ViewEditDropDown, {
        editPermission: Permissions.ROLE_EDIT,
        viewPermission: Permissions.ROLE_SHOW,
        onEdit: () => {
          router.push({ path: `/role/${row.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/role/${row.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <RoleTableHeader />
  <VFlexTableWrapper :columns="columns" :data="rolesList">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="roleStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="rolesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>

    <VPlaceloadText v-if="roleStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
</template>
