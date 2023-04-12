<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultWaitingListByTicket, defaultServiceCard } from "/@src/models/Sales/WaitingList/waitingList"
import { WaitingListByTicket } from "/@src/models/Sales/WaitingList/waitingList"
import { ServiceCard } from "/@src/models/Sales/WaitingList/waitingList"


export default defineComponent({
    props: {
        serviceCardByTicketProps: {
            default: undefined,
        },
        serviceCardProps: {
            default: undefined,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const serviceCardByTicket = ref<WaitingListByTicket>(defaultWaitingListByTicket)
        const serviceCard = ref<ServiceCard>(defaultServiceCard)
        if (props.serviceCardByTicketProps) {
            serviceCardByTicket.value = props.serviceCardByTicketProps
        }
        if (props.serviceCardProps) {
            serviceCard.value = props.serviceCardProps
        }
        console.log(serviceCardByTicket.value)
        console.log(serviceCard.value)
        return { t, serviceCardByTicket, serviceCard, AccountConsts }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable_service_card">

        <div style="display: flex; justify-content: space-around;">

            <h1 style="font-weight: normal; font-size: 1rem;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="100">

        </div>

        <div v-if="serviceCardByTicket" style=" font-size: 24px; width: 100%; display: flex; flex-direction: row-reverse;">
            <h2 style="font-weight: 600;text-align: center; font-size: 24px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ serviceCardByTicket.ticket.customer.user.first_name }} {{
        serviceCardByTicket.ticket.customer.user.last_name
    }}</h2>
        </div>
        <div v-else-if="serviceCard" style=" font-size: 24px; width: 100%; display: flex; flex-direction: row-reverse;">
            <h2 style="font-weight: 600;text-align: center; font-size: 24px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ serviceCard.customer.user.first_name }} {{
        serviceCard.customer.user.last_name
    }}</h2>
        </div>
        <table v-if="serviceCardByTicket" style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tbody>
                <tr>

                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ serviceCardByTicket.turn_number
                    }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ t('ticket.details.turn_number')
                    }}</td>

                </tr>
                <tr>

                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        serviceCardByTicket.current_provider.user.first_name
                    }} {{ serviceCardByTicket.current_provider.user.last_name }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        t('ticket.details.service_provider_name')
                    }}</td>

                </tr>
            </tbody>
        </table>
        <table v-else-if="serviceCard" style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ serviceCard.turn_number
                    }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ t('ticket.details.turn_number')
                    }}</td>

                </tr>
                <tr>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        serviceCard.provider.user.first_name
                    }} {{ serviceCard.provider.user.last_name }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        t('ticket.details.service_provider_name')
                    }}</td>

                </tr>
            </tbody>
        </table>

    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
