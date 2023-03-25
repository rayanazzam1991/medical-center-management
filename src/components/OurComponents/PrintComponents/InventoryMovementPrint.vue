<script lang="ts">
import { useI18n } from "vue-i18n"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"
import { AccountConsts, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"
import { defaultInventoryItemHistory } from "/@src/models/Warehouse/ItemHistory/inventoryItemHistory"


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
        console.log(inventoryItemMovement.value)

        return { t, inventoryItemMovement }
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
        <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px; font-size: 24px;">{{
            inventoryItemMovement.action_type ?
            t(`list_inventory_movement.table.action_types.${inventoryItemMovement?.action_type.replaceAll(' ',
                '_').toLowerCase()}`)
            : '-' }}
        </h1>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tbody>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.from_inventory ? inventoryItemMovement?.from_inventory : '-' }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.from') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement?.to_inventory ? inventoryItemMovement?.to_inventory :
                        !inventoryItemMovement?.to_inventory && inventoryItemMovement?.from_inventory ?
                            inventoryItemMovement?.requester_name : '-' }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.to') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.item }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.item') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.item_quantity }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.quantity') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.note ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.note') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        inventoryItemMovement.created_at ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('list_inventory_movement.table.columns.created_at') }}</strong>
                    </td>
                </tr>

            </tbody>

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
