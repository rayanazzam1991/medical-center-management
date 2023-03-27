<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultTicket } from "/@src/models/Sales/Ticket/ticket"


export default defineComponent({
    props: {
        ticket: {
            default: defaultTicket,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const ticket = props.ticket
        return { t, ticket, AccountConsts }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">

        <div style="display: flex; justify-content: space-around;">

            <h1 style="font-weight: normal; font-size: 1rem;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="100">

        </div>

        <div style=" font-size: 24px; width: 100%; display: flex;">
            <h2 style="font-weight: 600;text-align: center; font-size: 24px; width: 50%;">{{
                t('print.ticket.ticket') }}{{ ticket.id }}</h2>
            <h2 style="font-weight: 600;text-align: center; font-size: 24px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ ticket.customer.user.first_name }} {{ ticket.customer.user.last_name
    }}</h2>

        </div>
        <h1 style="font-weight: normal;text-align: right; font-size: 16px;">{{
            t('print.ticket.services') }}
        </h1>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.ticket.price') }}</th>
                    <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">
                        {{ t('print.ticket.service_provider') }}</th>
                    <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.ticket.service') }}</th>




                </tr>
            </thead>
            <tbody>
                <tr v-for="service in ticket.requested_services">
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ service.sell_price }}</td>

                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ service.provider.user.first_name
                    }}
                        {{
                            service.provider.user.last_name }}</td>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ service.service.name }}</td>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">{{ ticket.total_amount }}</td>
                    <td colspan="2" style="text-align: left; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.ticket.total_price') }}</strong>
                    </td>

                </tr>
            </tfoot>
        </table>
        <p style="font-weight: normal;text-align: right; font-size: 16px;">{{
            t('print.signature') }}
        </p>
        <p style="font-weight: normal;text-align: right; font-size: 16px; border-buttoms: 1px solid #ddd;">
            ____________________</p>


    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
