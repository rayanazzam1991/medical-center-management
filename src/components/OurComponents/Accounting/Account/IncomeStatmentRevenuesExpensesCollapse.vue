<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { IncomeStatmentLvl2Chart } from '/@src/models/Accounting/Account/account';

export interface IncomeStatmentRevenuesExpensesCollapseProps {
  items: IncomeStatmentLvl2Chart
  withChevron?: boolean,
  is_expanded: boolean
}

const props = withDefaults(defineProps<IncomeStatmentRevenuesExpensesCollapseProps>(), {
  itemsOpen: undefined,
  is_expanded: false
})
onMounted(() => {
  if (isExpanded.value) {
    let index = 1
    internalItemsOpen.value = [1]
  }
})

const internalItemsOpen = ref<number[] | undefined>(props.itemsOpen)
const isExpanded = ref<boolean>(props.is_expanded)
const { t } = useI18n()
const toggle = (key: number) => {
  let isClose = false
  if (internalItemsOpen.value != undefined) {
    if (internalItemsOpen.value.find((item) => item === key + 1) != undefined) {
      let newInternalItemsOpen = internalItemsOpen.value.filter(item => item !== key + 1);
      internalItemsOpen.value = newInternalItemsOpen
      isClose = true
    }
  }
  if (isClose)
    return
  if (!internalItemsOpen.value)
    internalItemsOpen.value = []
  internalItemsOpen.value.push(key + 1)

}
</script>

<template>
  <details :key="0" :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
    :open="((internalItemsOpen?.find((item) => item == 1) ? true : false))" class="collapse-lvl1">
    <slot name="collapse-item1" :item="items" :index="0" :toggle="toggle">
      <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(0)"
        @click.prevent="() => toggle(0)">
        <div class="is-flex">
          <slot clas name="collapse-item-summary1" :item="items" :index="0" :toggle="toggle">
            <h3 class="mr-2 is-size-6">
              {{ items.code }}
            </h3>
          </slot>
          <slot name="collapse-item-summary1" :item="items" :index="0" :toggle="toggle">
            <h3 class="is-size-6">
              {{ items.name }}
            </h3>
          </slot>
        </div>
        <div class="collapse-head-info">
          <div class="is-flex">
            <div class="chart-row">
              <div class="accounts-cell open-has-bold">
                {{ items.total_balances }}
              </div>
            </div>
          </div>
          <slot name="collapse-item-head" :item="items" :index="1"></slot>
          <div class="collapse-icon">
            <VIcon v-if="withChevron" icon="feather:chevron-down" />
            <VIcon v-else-if="!withChevron" icon="feather:plus" />
          </div>
      </div>
      </summary>
      <div class="collapse-content">
        <slot name="trail-balance-lvl1-collapse-item-content1" :item="items" :index="0" :toggle="toggle">
          <div class="account-details columns is-flex is-justify-content-space-between" v-for="account in items.accounts">
            <div class="meta is-flex column is-3 columns my-0 is-align-items-center">
              <div class="account-code mr-2">
                <div class="accounts-cell">
                  {{ account.code }}
                </div>
              </div>
              <div class="account-name mr-2">
                <div class="accounts-cell">

                  {{ account.name }}
                </div>
              </div>
            </div>
            <div class="is-flex is-align-items-center ">
              <div class="chart-row">
                <div class=" accounts-cell">
                  {{ account.balance }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="items.accounts.length == 0" class="account-details accounts-footer my-2">
            <div class="meta is-flex">
              <div class="account-code mr-2">
                {{ t('income_statment_report.no_accounts_place_holder') }}
              </div>
            </div>
          </div>
        </slot>
      </div>
    </slot>
  </details>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/Styles/BalanceSheetReport/balanceSheetAssetsLiabilitesCollapse.scss';
</style>
