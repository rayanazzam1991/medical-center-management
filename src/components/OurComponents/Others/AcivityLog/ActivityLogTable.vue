<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "activity_log_list"
    ]
  }
}
</route>

<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useI18n } from 'vue-i18n'
import { ActivityLog, ActivityLogSearchFilter, defaultActivityLogSearchFilter } from '/@src/models/Others/ActivityLog/activityLog'
import { useActivityLog } from '/@src/stores/Others/ActivityLog/activityLogStore'
import { getActivityLogList } from '/@src/services/Others/ActivityLog/activityLogService'
import usePrint from '/@src/composable/usePrint'
export interface ActivityLogTableProps {
  withTitle: boolean
}
const props = withDefaults(defineProps<ActivityLogTableProps>(), {
  withTitle: false
})
const viewWrapper = useViewWrapper()
const { t } = useI18n()

const searchFilter = ref(defaultActivityLogSearchFilter)
const actitivityLogList = ref<Array<ActivityLog>>([])

const { printDiv } = usePrint('');


const paginationVar = ref(defaultPagination)
const activityLogStore = useActivityLog()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
  const { activitiesLog, pagination } = await getActivityLogList(searchFilter.value)
  actitivityLogList.value = activitiesLog
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});


const search = async (newSearchFilter: ActivityLogSearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
  const { activitiesLog, pagination } = await getActivityLogList(newSearchFilter)
  actitivityLogList.value = activitiesLog
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ActivityLogSearchFilter) => {
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
}
const getActivityLogsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const activityLogSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

    searchFilter.value.order_by = sortField
    searchFilter.value.order = sortOrder
  }
  else {
    searchFilter.value.order = undefined
    searchFilter.value.order_by = undefined
  }
  await search(searchFilter.value)
}



const columns = {
  created_at: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('activityLog.table.columns.created_at'),
    renderRow: (row: any) =>
      h('span', row.created_at)
  },
  subject_type: {
    align: 'center',
    label: t('activityLog.table.columns.entity'),
    renderRow: (row: any) =>
      h('span', row.subject_type)
  },

  event: {
    align: 'center',
    label: t('activityLog.table.columns.action'),
    renderRow: (row: any) =>
      h('span', row.description)
  },


  created_by: {
    searchable: true,
    align: 'center',
    label: t('activityLog.table.columns.created_by'),
    renderRow: (row: any) =>
      h('span', row?.createdBy ?? '-')
  },

} as const
</script>

<template>
  <ActivityLogTableHeader :with_title="$props.withTitle" :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="t('activityLog.header_button')" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="actitivityLogList" @update:sort="activityLogSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="activityLogStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="actitivityLogList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(actitivityLogList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getActivityLogsPerPage" />
    <h6 v-if="actitivityLogList.length != 0 && !activityLogStore?.loading">
      {{
        t('tables.pagination_footer', {
          from_number: paginationVar.page !=
            paginationVar.max_page
            ?
            (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
              ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
          , to_number: paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
        }) }}</h6>

    <VPlaceloadText v-if="activityLogStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
</template>
<style scoped lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 150px;
  background-color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  word-break: keep-all;
  white-space: normal;


  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;


}

.is-dark {
  .tooltip .tooltiptext {
    background-color: rgb(43, 41, 41);
  }
}
</style>
