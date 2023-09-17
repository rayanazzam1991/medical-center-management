<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BalanceSheetLvl2Chart } from '/@src/models/Accounting/Account/account';

export interface BalanceSheetAssetsLiabilitesCollapseProps {
  items: BalanceSheetLvl2Chart[]
  withChevron?: boolean,
  is_expanded: boolean
}

const props = withDefaults(defineProps<BalanceSheetAssetsLiabilitesCollapseProps>(), {
  items: () => [],
  itemsOpen: undefined,
  is_expanded: false
})
onMounted(() => {
  if (isExpanded.value) {
    let index = 1
    internalItemsOpen.value = []
    props.items.forEach((element) => {
      if (internalItemsOpen.value) {
        internalItemsOpen.value.push(index)
        index++
      }
    });
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
  <details v-for="(item, key) in items" :key="key" :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
    :open="((internalItemsOpen?.find((item) => item == key + 1) ? true : false))" class="collapse-lvl1">
    <slot name="collapse-item1" :item="item" :index="key" :toggle="toggle">
      <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(key)"
        @click.prevent="() => toggle(key)">
        <div class="is-flex">
          <slot clas name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
            <h3 class="mr-2 is-size-6">
              {{ item.code }}
            </h3>
          </slot>
          <slot name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
            <h3 class="is-size-6">
              {{ item.name }}
            </h3>
          </slot>
        </div>
        <div class="collapse-head-info">
          <div class="is-flex">
            <div class="chart-row">
              <div class="accounts-cell open-has-bold">
                {{ item.total_balances }}
              </div>
            </div>
          </div>
          <slot name="collapse-item-head" :item="item" :index="key + 1"></slot>
          <div class="collapse-icon">
            <VIcon v-if="withChevron" icon="feather:chevron-down" />
            <VIcon v-else-if="!withChevron" icon="feather:plus" />
          </div>
        </div>
      </summary>
      <div class="collapse-content">
        <slot name="trail-balance-lvl1-collapse-item-content1" :item="item" :index="key" :toggle="toggle">
          <div class="account-details columns is-flex is-justify-content-space-between" v-for="account in item.accounts">
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
          <div v-if="item.accounts.length == 0" class="account-details accounts-footer my-2">
            <div class="meta is-flex">
              <div class="account-code mr-2">
                {{ t('balance_sheet_report.no_accounts_place_holder') }}
              </div>
            </div>
          </div>
        </slot>
      </div>
    </slot>
  </details>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/styles/BalanceSheetReport/balanceSheetAssetsLiabilitesCollapse.scss';
</style>
