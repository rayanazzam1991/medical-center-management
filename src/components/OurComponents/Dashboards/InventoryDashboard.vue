<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {defaultInventoryDashboard, InventoryDashboard} from '/@src/models/Others/User/dashboard';
import {getInventoryDashboardData} from '../../../services/Others/User/dashboardService';
import {Permissions} from '/@src/utils/consts/rolesPermissions';
import {useDashboard} from '/@src/stores/Others/User/dashboardStore';

const inventoryDashboardData = ref<InventoryDashboard>(defaultInventoryDashboard)
const keyIncrement = ref(0)
const {t} = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

  const {dashboard_data} = await getInventoryDashboardData()
  inventoryDashboardData.value = dashboard_data
  keyIncrement.value = keyIncrement.value + 1
});
const toAddQuantity = () => {
  router.push({name: '/add-quantity/'})
}
const toWithdrawQuantity = () => {
  router.push({name: '/withdraw-quantity/'})
}
const toWithdrawFromMainInventory = () => {
  router.push({name: '/from-main-inventory/'})
}
const toReturnToMainInventory = () => {
  router.push({name: '/to-main-inventory/'})
}
</script>

<template>
  <div class="finance-dashboard dashboard">
    <div class="columns">
      <div class="column is-12">
        <div class="columns is-multiline">
          <div class="column is-4">
            <StatCard :key="keyIncrement" :loading="dashboardStore.loading"
                      :stat="inventoryDashboardData?.active_items_count"
                      :title="t('dashboards.inventory.active_items_count')" color="primary" icon="lnir lnir-diamond-alt"
                      rounded/>
          </div>
          <div class="column is-4">
            <StatCard :key="keyIncrement"
                      :increase="inventoryDashboardData?.add_stats?.increment_percentage == 0 ? 'same' : inventoryDashboardData?.add_stats?.is_increase ? 'more' : 'less'"
                      :loading="dashboardStore.loading"
                      :percentage="inventoryDashboardData?.add_stats?.increment_percentage"
                      :percentage_subtitle="inventoryDashboardData?.add_stats?.is_increase ? t('dashboards.inventory.more_since_last_month') : t('dashboards.inventory.less_since_last_month')"
                      :stat="inventoryDashboardData?.add_stats?.quantity"
                      :title="t('dashboards.inventory.added_items')"
                      color="blue"
                      icon="lnir lnir-arrow-down"
                      rounded/>

          </div>
          <div class="column is-4">
            <StatCard :key="keyIncrement"
                      :increase="inventoryDashboardData?.withdraw_stats?.increment_percentage == 0 ? 'same' : inventoryDashboardData?.withdraw_stats?.is_increase ? 'more' : 'less'"
                      :loading="dashboardStore.loading"
                      :percentage="inventoryDashboardData?.withdraw_stats?.increment_percentage"
                      :percentage_subtitle="inventoryDashboardData?.withdraw_stats?.is_increase ? t('dashboards.inventory.more_since_last_day') : t('dashboards.inventory.less_since_last_day')"
                      :stat="inventoryDashboardData?.withdraw_stats?.quantity"
                      :title="t('dashboards.inventory.withdrawn_items')"
                      color="orange"
                      icon="lnir lnir-arrow-up"
                      rounded/>

          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="asset-category">
              <div v-permission="Permissions.INVENTORY_ITEM_CREATE" class="category" @click="toAddQuantity">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-arrow-down-circle"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.inventory.add_quantity') }}</div>
              </div>
              <div v-permission="Permissions.INVENTORY_ITEM_CREATE" class="category"
                   @click="toWithdrawQuantity">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-arrow-up-circle"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.inventory.withdraw_quantity') }}</div>
              </div>
              <div v-permission="Permissions.INVENTORY_ITEM_CREATE" class="category"
                   @click="toWithdrawFromMainInventory">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-down-left-arrow-box"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.inventory.withdraw_from_main_inventory') }}</div>
              </div>
              <div v-permission="Permissions.INVENTORY_ITEM_CREATE" class="category"
                   @click="toReturnToMainInventory">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-top-right-arrow-box"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.inventory.return_to_main_inventory') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <InventoryMovementsTable :from-main-inventory="false" :to-main-inventory="false" with-title/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/@src/scss/styles/Dashboards/inventoryDashboard.scss';
</style>
