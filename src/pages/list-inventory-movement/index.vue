<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "inventory_item_history_list"
    ]
  }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('list_inventory_movement.table.title'))
const route = useRoute()

const head = useHead({
  title: t('list_inventory_movement.table.title'),
})


</script>
  
<template>
  <InventoryMovementsTable />
</template>
    
