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
    <div v-if="role == 'Admin'">
      <AdminDashboard />
    </div>
    <div v-if="role == 'Service_Provider'">
      <ServiceProviderDashboard />
    </div>
    <div v-if="role == 'Inventory'">
      <InventoryDashboard />
    </div>
    <div v-if="role == 'Human_Resources'">
      <HumanResourcesDashboard />
    </div>
    <div v-if="$props.role == 'Analyst'">
      <AnalystDashboard />
    </div>

  </div>
</template>

