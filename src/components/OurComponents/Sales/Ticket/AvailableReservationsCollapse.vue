<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BalanceSheetLvl2Chart } from '/@src/models/Accounting/Account/account';
import { Reservation, ReservationTicketHelper } from '/@src/models/Sales/Reservation/reservation';

export interface AvailableReservationsCollapseProps {
    items: ReservationTicketHelper[]
    withChevron?: boolean,
    is_expanded: boolean
}

const props = withDefaults(defineProps<AvailableReservationsCollapseProps>(), {
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
    (e: 'addReservationService', reservation: ReservationTicketHelper): void
    (e: 'closeOpen', is_closed: boolean): void
}>()

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
    if (isClose) {
        emits('closeOpen', true)
        return
    }
    if (!internalItemsOpen.value)
        internalItemsOpen.value = []
    internalItemsOpen.value.push(key + 1)
    emits('closeOpen', false)

}
const addReservationService = (reservation: ReservationTicketHelper) => {
    emits('addReservationService', reservation)
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
                        <h3 class="mr-2 is-size-6" :class="[items.length != 0 && 'has-text-success']">
                            {{ items.length != 0 ? t('ticket.form.reservation_exists') :
                                t('ticket.form.no_reservation_exists') }}
                        </h3>
                    </slot>
                </div>
                <div class="collapse-head-info">
                    <slot name="collapse-item-head" :item="items" :index="1"></slot>
                    <div class="collapse-icon">
                        <VIcon v-if="withChevron" icon="feather:chevron-down" />
                        <VIcon v-else-if="!withChevron" icon="feather:plus" />
                    </div>
                </div>

            </summary>
            <div class="collapse-content">
                <slot name="trail-balance-lvl1-collapse-item-content1" :item="items" :index="0" :toggle="toggle">
                    <div class="account-details columns is-flex is-justify-content-space-between pt-5 pb-3"
                        v-for="reservation in items">
                        <div
                            class="meta is-flex column is-12 columns my-0 is-align-items-center is-justify-content-space-between">
                            <div class="columns m-0">
                                <div class="account-code mr-2">
                                    <div class="accounts-cell">
                                        {{ reservation.service_provider.service?.name }} &nbsp; - &nbsp;
                                    </div>
                                </div>
                                <div class="account-name mr-2">
                                    <div class="accounts-cell">

                                        {{ reservation.service_provider.provider.user.first_name }}
                                        {{ reservation.service_provider.provider.user.last_name }} &nbsp; - &nbsp;
                                    </div>
                                </div>
                                <div class="account-name mr-2">
                                    <div class="accounts-cell">

                                        {{ reservation.time_from }}
                                        {{ t('ticket.form.to') }}
                                        {{ reservation.time_to }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <VButton @click="addReservationService(reservation)" class="add-button" color="primary"
                                    :disabled="reservation.is_added"> {{
                                        reservation.is_added ? t('ticket.form.added_reservation') :
                                        t('ticket.form.add_reservation') }}
                                </VButton>
                            </div>

                        </div>
                    </div>
                    <div v-if="items.length == 0" class="account-details accounts-footer my-2">
                        <div class="meta is-flex">
                            <div class="account-code mr-2">
                                {{ t('ticket.form.no_reservations_placeholder') }}
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
@import '/@src/scss/Styles/Sales/Reservation/AvailableReservationCollapse.scss';

.add-button {
    height: 20px;
}
</style>
