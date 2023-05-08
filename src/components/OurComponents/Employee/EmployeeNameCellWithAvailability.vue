<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
export interface EmployeeNameCellWithAvailabilityProps {
    employeeName: string,
    employeeAvailability: boolean,
    showAvailability: boolean

}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'changeAvailability'): void
}>()
const props = withDefaults(defineProps<EmployeeNameCellWithAvailabilityProps>(), {
    employeeName: '',
    employeeAvailability: undefined,
    showAvailability: undefined

})
const toggleAvailability = () => {
    emits('changeAvailability')
}


</script>

<template>
    <div>
        <span v-permission="Permissions.EMPLOYEE_AVAILABILITY_TOGGLE" v-if="showAvailability" @dblclick="toggleAvailability"
            class="clickable-cursor mr-3 availability-pointer">
            <i class="fas fa-circle ml-2" :class="employeeAvailability ? 'has-text-success' : 'has-text-danger'"
                aria-hidden="true"></i>
        </span>
        <span>
            {{ employeeName }}
        </span>

    </div>
</template>
<style scoped lang="scss">
.availability-pointer {
    position: absolute;
    top: 10px;
    right: 0;
}
</style>
