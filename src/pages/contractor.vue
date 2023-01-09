<route lang="json">
{
    "meta": {
        "requiresAuth": true
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
<style  lang="scss">
.page-content-wrapper {
    max-width: 1500px !important;
}

.page-content-wrapper .page-content {
    padding: 0 40px !important;
}

.view-wrapper.has-top-nav .is-navbar-lg {
    margin-top: 110px !important;
}
</style>