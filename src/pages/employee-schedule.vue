<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "employee_schedule_access"
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
        