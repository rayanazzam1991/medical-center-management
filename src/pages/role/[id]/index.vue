<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "role_show"
        ]
    }
}
</route>
      
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Role')
useHead({
    title: 'Role',
})
</script>
    
<template>
    <RoleDetails />
</template>
    