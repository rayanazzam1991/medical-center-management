<script setup lang="ts">
export interface MyDashboardProps {
    role: 'Admin' | 'Accountant' | 'Human_Resources' | 'Inventory' | 'Service_Provider' | 'Receptionist' | 'Analyst'
}
const props = withDefaults(defineProps<MyDashboardProps>(), {
    role: undefined
})
</script>

<template>
    <div class="">
        <div v-if="$props.role == 'Service_Provider'">
            <ServiceProviderDashboard />
        </div>
        <div v-if="$props.role == 'Inventory'">
            <InventoryDashboard />
        </div>
        <div v-if="$props.role == 'Human_Resources'">
            <HumanResourcesDashboard />
        </div>
        <div v-if="$props.role == 'Analyst'">
            <AnalystDashboard />
        </div>
    </div>
</template>

