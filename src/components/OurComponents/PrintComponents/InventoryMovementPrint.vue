<script lang="ts">
import { useI18n } from "vue-i18n"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"
import { AccountConsts, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"
import { defaultInventoryItemHistory, InventoryItemHistoryConsts } from "/@src/models/Warehouse/ItemHistory/inventoryItemHistory"
import { getFromName, getToName } from "/@src/services/Warehouse/ItemHistory/inventoryItemHistoryService"


export default defineComponent({
    props: {
        inventoryItemMovement: {
            default: defaultInventoryItemHistory,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const inventoryItemMovement = ref(defaultInventoryItemHistory)
        inventoryItemMovement.value = props.inventoryItemMovement

        return { t, inventoryItemMovement, getFromName, getToName, InventoryItemHistoryConsts }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">
        <div style="display: flex; justify-content: space-between;">

            <h1 style="font-weight: normal; font-size: 1rem;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="123" height="35">

        </div>
        <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px; font-size: 24px;">{{
            InventoryItemHistoryConsts.getActionName(inventoryItemMovement.action) }}
        </h1>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="width: 87%; padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        getFromName(inventoryItemMovement) }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.from') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        getToName(inventoryItemMovement)
                    }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.to') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.item }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.item') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.item_quantity }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.quantity') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.note ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.note') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.created_at ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.list_inventory_movement.date') }}</strong>
                    </td>
                </tr>

            </tbody>

        </table>
        <p style="font-weight: normal;text-align: right; font-size: 16px;">{{
            t('print.signature') }}
        </p>
        <p style="font-weight: normal;text-align: right; font-size: 16px;">
            ____________________</p>

    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
