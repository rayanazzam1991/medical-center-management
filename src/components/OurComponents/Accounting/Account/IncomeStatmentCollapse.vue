<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { IncomeStatmentLvl1Chart } from '/@src/models/Accounting/Account/account';

export interface IncomeStatmentCollapseProps {
  items: IncomeStatmentLvl1Chart
  withChevron?: boolean,
  is_expanded: boolean
}


const props = withDefaults(defineProps<IncomeStatmentCollapseProps>(), {
  itemsOpen: undefined,
  is_expanded: false
})
onMounted(() => {
  if (isExpanded.value) {
    let index = 1
    internalItemsOpen.value = [1]

  }
})
const { t } = useI18n()
const internalItemsOpen = ref<number[] | undefined>(props.itemsOpen)
const isExpanded = ref<boolean>(props.is_expanded)
const toggle = (key: number) => {
  let isClose = false
  if (internalItemsOpen.value != undefined) {
    if (internalItemsOpen.value.find((item) => item === key + 1) != undefined) {
      let newInternalItemsOpen = internalItemsOpen.value.filter(item => item !== key + 1);
      internalItemsOpen.value = newInternalItemsOpen
      isClose = true
    }
  }
  if (isClose) {
    return
  }
  if (!internalItemsOpen.value)
    internalItemsOpen.value = []
  internalItemsOpen.value.push(key + 1)

}
</script>

<template>
  <details :key="0"
    :class="[withChevron && 'has-chevron', !withChevron && 'has-plus', (internalItemsOpen?.find((item) => item == 1)) && 'opened-tree']"
    :open="(internalItemsOpen?.find((item) => item == 1) ? true : false)" class="collapse">
    <slot name="collapse-item" :item="items" :index="1" :toggle="toggle">
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
        <slot name="trail-balance-collapse-item-content" :item="items" :index="1" :toggle="toggle">
          <IncomeStatmentLvl1Collapse :items="items.children" with-chevron :is_expanded="isExpanded"
            :close="(internalItemsOpen?.find((item) => item == 1) ? false : true)" />
        </slot>

      </div>
    </slot>
  </details>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/Styles/TrialBalanceReport/trialBalanceCollapse.scss';
</style>
