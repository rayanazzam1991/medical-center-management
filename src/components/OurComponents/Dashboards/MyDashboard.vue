<script setup lang="ts">
export interface MyDashboardProps {
    role: 'Admin' | 'Accountant' | 'Human_Resources' | 'Inventory' | 'Service_Provider' | 'Receptionist'
}
const props = withDefaults(defineProps<MyDashboardProps>(), {
    role: undefined
})

</script>

<template>
    <div class="">
        <div v-if="role == 'Service_Provider'">
            <ServiceProviderDashboard />
        </div>
        <div v-if="role == 'Inventory'">
            <InventoryDashboard />
        </div>
    </div>
</template>

