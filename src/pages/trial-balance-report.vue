<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "trial_balance_generate"
        ]
    }
}
</route>
<script setup lang="ts">
const route = useRoute()


</script>

<template>
    <NavbarLayout>
        <RouterView :key="$route.fullPath" />
    </NavbarLayout>
</template>
