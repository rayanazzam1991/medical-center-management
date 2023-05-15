<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultTicket } from "/@src/models/Sales/Ticket/ticket"
import JsBarcode from 'jsbarcode';



export default defineComponent({
    props: {
        ticket: {
            default: defaultTicket,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const ticket = props.ticket
        const barcode = ref(null);
        onMounted(() => {
            JsBarcode(barcode.value, ticket.barcode.toString(), {
                width: 1.5,
                height: 30,
            });
        });

        return { t, ticket, AccountConsts, barcode }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">

        <div style="display: flex; justify-content: space-between;">

            <h1 style="font-weight: normal; font-size: 10px;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="123" height="33">

        </div>

        <div style=" font-size: 12px; width: 100%; display: flex;">
            <h2 style="font-weight: 600;text-align: center; font-size: 12px; width: 50%;">{{
                t('print.ticket.ticket') }}{{ ticket.id }}</h2>
            <h2 style="font-weight: 600;text-align: center; font-size: 12px; width: 50%;">{{
                t('print.ticket.customer_name') }}{{ ticket.customer.user.first_name }} {{ ticket.customer.user.last_name
    }}</h2>

        </div>
        <h1 style="font-weight: normal;text-align: center; font-size: 12px;">{{
            t('print.ticket.services') }}
        </h1>

        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        t('print.ticket.price') }}</th>
                    <th style="text-align: center; padding: 3px; border: 1px solid #ddd;">
                        {{ t('print.ticket.service_provider') }}</th>
                    <th style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        t('print.ticket.service') }}</th>




                </tr>
            </thead>
            <tbody>
                <tr v-for="service in ticket.requested_services">
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ service.sell_price }}</td>

                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{
                        service.provider.user.first_name
                    }}
                        {{
                            service.provider.user.last_name }}</td>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ service.service.name }}</td>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td style="text-align: center; padding: 3px; border: 1px solid #ddd;">{{ ticket.total_amount }}</td>
                    <td colspan="2" style="text-align: center; padding: 3px; border: 1px solid #ddd;">
                        <strong>{{ t('print.ticket.total_price') }}</strong>
                    </td>

                </tr>
            </tfoot>
        </table>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div>
                <p style="font-weight: normal;text-align: right; font-size: 12px;">{{
                    t('print.signature') }}
                </p>
                <p style="font-weight: normal;text-align: right; font-size: 12px;">
                    ____________________</p>
            </div>
            <div style="margin-top: 3px;">
                <svg ref="barcode" style="width: 50px; height: 50px;" viewBox="0 0 100 25"></svg>
            </div>
        </div>


    </div>
</template>

