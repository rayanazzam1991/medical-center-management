<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "employees_availability_history_list"
        ]
    }
}
</route>
<script setup lang="ts">

</script>
        
<template>
    <NavbarLayout>
        <RouterView :key="$route.fullPath" />
    </NavbarLayout>
</template>
        