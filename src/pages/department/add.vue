<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue'
import { addDepartment } from '/@src/composable/Others/Department/addDepartment'
import { Department } from '/@src/utils/api/Others/Department'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import { DepartmentConsts } from '/@src/utils/consts/department';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')

const head = useHead({
    title: 'Add Department',
})


</script>

<template>
    <DepartmentForm :formType="'Add'" />
</template>
