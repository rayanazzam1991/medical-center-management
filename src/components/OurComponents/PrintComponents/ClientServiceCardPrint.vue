<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultWaitingListByTicket } from "/@src/models/Sales/WaitingList/waitingList"


export default defineComponent({
    props: {
        serviceCard: {
            default: defaultWaitingListByTicket,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const serviceCard = props.serviceCard
        return { t, serviceCard, AccountConsts }
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

        <div style=" font-size: 24px; width: 100%; display: flex; flex-direction: row-reverse;">
            <h2 style="font-weight: 600;text-align: center; font-size: 24px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ serviceCard.ticket.customer.user.first_name }} {{
        serviceCard.ticket.customer.user.last_name
    }}</h2>

        </div>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tbody>
                <tr>

                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ serviceCard.turn_number }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ t('ticket.details.turn_number')
                    }}</td>

                </tr>
                <tr>

                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        serviceCard.current_provider.user.first_name
                    }} {{ serviceCard.current_provider.user.last_name }}</td>
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
