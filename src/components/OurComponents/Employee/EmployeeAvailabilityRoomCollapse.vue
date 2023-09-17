<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AccountConsts, TrialBalanceLvl2Chart } from '/@src/models/Accounting/Account/account';
import { EmployeesWithAvailabilityRoom } from '/@src/models/Employee/employee';
import { emit } from 'process';

export interface EmployeeAvailabilityRoomCollapseProps {
    items: EmployeesWithAvailabilityRoom[]
    withChevron?: boolean,
    is_expanded: boolean
}

const props = withDefaults(defineProps<EmployeeAvailabilityRoomCollapseProps>(), {
    items: () => [],
    itemsOpen: undefined,
    is_expanded: false
})
const emits = defineEmits<{
    (e: 'toggleAvailability', employeeId: number): void
}>()

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
const toggleAvailability = (employeeId: number) => {
    emits('toggleAvailability', employeeId)
}
</script>

<template>
    <details v-for="(item, key) in items" :key="key" :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
        :open="((internalItemsOpen?.find((item) => item == key + 1) ? true : false))" class="collapse-lvl1 mb-0">
        <slot name="collapse-item1" :item="item" :index="key" :toggle="toggle">
            <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(key)"
                @click.prevent="() => toggle(key)">
                <div class="is-flex">
                    <slot clas name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
                        <h3 class="mr-2 is-size-6">
                            {{ t('employee_availability.room') }} #{{ item.number }}
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
                <slot name="trail-balance-lvl1-collapse-item-content1" :item="item" :index="key" :toggle="toggle">
                    <div class="account-details columns is-flex is-justify-content-space-between is-align-items-center"
                        v-for="employee in item.employees">
                        <div class="meta is-flex column is-3 columns is-align-items-center">
                            <div @dblclick="toggleAvailability(employee.id)" class="clickable-cursor">
                                <i class="fas fa-circle ml-2"
                                    :class="employee.is_available ? 'has-text-success' : 'has-text-danger'"
                                    aria-hidden="true"></i>
                            </div>
                            <div class="account-code">
                                <div class="accounts-cell">
                                    {{ employee.user.first_name }} {{ employee.user.last_name }}
                                </div>
                            </div>
                        </div>
                        <div class="is-flex is-align-items-center ">
                        </div>
                    </div>
                    <div v-if="item.employees.length == 0" class="account-details accounts-footer">
                        <div class="meta is-flex">
                            <div class="account-code">
                                {{ t('employee_availability.no_employees_in_this_room_placeholder') }}
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
@import '/@src/scss/styles/TrialBalanceReport/trialBalanceLvl1Collapse.scss';

.account-details {
    padding-top: 36px !important;
    padding-bottom: 8px !important;

    &.accounts-footer {
        padding-top: 16px !important;
        padding-bottom: 16px !important;

    }

}

.clickable-cursor {
    cursor: pointer;
}
</style>
