<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "salaries_generate"
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
        