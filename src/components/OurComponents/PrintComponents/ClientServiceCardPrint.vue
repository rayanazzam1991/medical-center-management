<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultWaitingListByTicket, defaultServiceCard } from "/@src/models/Sales/WaitingList/waitingList"
import { WaitingListByTicket } from "/@src/models/Sales/WaitingList/waitingList"
import { ServiceCard } from "/@src/models/Sales/WaitingList/waitingList"


export default defineComponent({
    props: {
        serviceCardByTicketProps: {
            default: defaultWaitingListByTicket,
        },
        serviceCardProps: {
            default: defaultServiceCard,
        },
        isServiceCard: {
            type: Boolean,
            default: false
        }

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
        return { t, serviceCardByTicket, serviceCard, AccountConsts }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable_service_card">

        <div style="display: flex; justify-content: space-between;">

            <h1 style="font-weight: normal; font-size: 10px;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="123" height="33">

        </div>

        <div v-if="!$props.isServiceCard"
            style=" font-size: 12px; width: 100%; display: flex; flex-direction: row-reverse;">
            <h2 style="font-weight: 600;text-align: center; font-size: 12px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ serviceCardByTicket.ticket.customer.user.first_name }} {{
        serviceCardByTicket.ticket.customer.user.last_name
    }}</h2>
        </div>
        <div v-else style=" font-size: 12px; width: 100%; display: flex; flex-direction: row-reverse;">
            <h2 style="font-weight: 600;text-align: center; font-size: 12px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ serviceCard.customer.user.first_name }} {{
        serviceCard.customer.user.last_name
    }}</h2>
        </div>
        <table v-if="!$props.isServiceCard" style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tbody>
                <tr>

                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ serviceCardByTicket.turn_number
                    }}</td>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        t('print.ticket.turn_number')
                    }}</td>

                </tr>
                <tr>

                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        serviceCardByTicket.current_provider.user.first_name
                    }} {{ serviceCardByTicket.current_provider.user.last_name }}</td>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        t('print.ticket.current_service_provider')
                    }}</td>

                </tr>
            </tbody>
        </table>
        <table v-else style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ serviceCard.turn_number
                    }}</td>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ t('ticket.details.turn_number')
                    }}</td>

                </tr>
                <tr>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        serviceCard.provider.user.first_name
                    }} {{ serviceCard.provider.user.last_name }}</td>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        t('print.ticket.current_service_provider')
                    }}</td>

                </tr>
            </tbody>
        </table>

    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
