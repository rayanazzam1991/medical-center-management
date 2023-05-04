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
const route = useRoute()


</script>

<template>
    <NavbarLayout>
        <RouterView />
    </NavbarLayout>
</template>
