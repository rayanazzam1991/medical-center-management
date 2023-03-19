<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "setting_edit"
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
    