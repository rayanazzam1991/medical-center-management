<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TrialBalanceLvl1Chart } from '/@src/models/Accounting/Account/account';

export interface TrailBalanceCollapseProps {
  items: TrialBalanceLvl1Chart[]
  withChevron?: boolean,
  is_expanded: boolean
}


const props = withDefaults(defineProps<TrailBalanceCollapseProps>(), {
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
    <details v-for="(item, key) in items" :key="key + 1"
        :class="[withChevron && 'has-chevron', !withChevron && 'has-plus', (internalItemsOpen?.find((item) => item == key + 1)) && 'opened-tree']"
        :open="(internalItemsOpen?.find((item) => item == key + 1) ? true : false)" class="collapse">
        <slot name="collapse-item" :item="item" :index="key + 1" :toggle="toggle">
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
                                {{ item.total_credits }}
                            </div>
                        </div>
                        <div class="chart-row mr-5">
                            <div class="accounts-cell open-has-bold">
                                {{ item.total_debits }}
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
                <slot name="trail-balance-collapse-item-content" :item="item" :index="key + 1" :toggle="toggle">
                    <TrailBalanceLvl1Collapse :items="item.children" with-chevron :is_expanded="isExpanded"
                        :close="(internalItemsOpen?.find((item) => item == key + 1) ? false : true)" />
                </slot>

            </div>
        </slot>
</details>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/styles/TrialBalanceReport/trialBalanceCollapse.scss';
</style>
