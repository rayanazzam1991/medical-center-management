<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TrialBalanceLvl1Chart } from '/@src/models/Accounting/Account/account';
import { EmployeesWithAvailabilityDepartment } from '/@src/models/Employee/employee';

export interface EmployeeAvailabilityDepartmentCollapseProps {
    items: EmployeesWithAvailabilityDepartment[]
    withChevron?: boolean,
    is_expanded: boolean
}


const props = withDefaults(defineProps<EmployeeAvailabilityDepartmentCollapseProps>(), {
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
const emits = defineEmits<{
    (e: 'toggleAvailability', employeeId: number): void
}>()

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
const toggleAvailability = (employeeId: number) => {
    emits('toggleAvailability', employeeId)
}

</script>

<template>
    <details v-for="(item, key) in items" :key="key + 1"
        :class="[withChevron && 'has-chevron', !withChevron && 'has-plus', (internalItemsOpen?.find((item) => item == key + 1)) && 'opened-tree']"
        :open="(internalItemsOpen?.find((item) => item == key + 1) ? true : false)" class="collapse mb-0">
        <slot name="collapse-item" :item="item" :index="key + 1" :toggle="toggle">
            <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(key)"
                @click.prevent="() => toggle(key)">
                <div class="is-flex">

                    <slot clas name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
                        <h3 class="mr-2 is-size-6">
                            {{ item.name }}
                        </h3>
                    </slot>
                </div>
                <div class="collapse-head-info">
                    <slot name="collapse-item-head" :item="item" :index="key + 1"></slot>
                    <div class="collapse-icon">
                        <VIcon v-if="withChevron" icon="feather:chevron-down" />
                        <VIcon v-else-if="!withChevron" icon="feather:plus" />
                    </div>
                </div>
            </summary>
            <div class="collapse-content">
                <slot name="trail-balance-collapse-item-content" :item="item" :index="key + 1" :toggle="toggle">
                    <EmployeeAvailabilityRoomCollapse :items="item.rooms" with-chevron :is_expanded="isExpanded"
                        @toggle-availability="toggleAvailability"
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
