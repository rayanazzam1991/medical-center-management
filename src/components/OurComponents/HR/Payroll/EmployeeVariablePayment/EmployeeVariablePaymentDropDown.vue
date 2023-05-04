<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface EmployeeVariablePaymentDropDownProps {
    editPermission: string,
    changeStatusPermission: string,
    deactivatePermission: string,
    editable: boolean,
    is_repeatable: boolean
}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'edit'): void
    (e: 'changeStatus'): void
    (e: 'deactivate'): void
}>()
const props = withDefaults(defineProps<EmployeeVariablePaymentDropDownProps>(), {
    editPermission: undefined,
    changeStatusPermission: undefined,
    deactivatePermission: undefined,
    editable: true,
    is_repeatable: false
})
const editPermission = props.editPermission
const changeStatusPermission = props.changeStatusPermission
const deactivatePermission = props.deactivatePermission
const editable = props.editable
const is_repeatable = props.is_repeatable

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-if="editable" v-permission="editPermission" role="menuitem" href="#" class="dropdown-item is-media"
                @click.prevent="() => {
                        emits('edit')
                        close()
                    }
                    ">
                <div class="icon">

                    <i class="fas fa-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.edit') }}</span>
                </div>
            </a>
            <a v-if="editable && !is_repeatable" v-permission="changeStatusPermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="() => {
                        emits('changeStatus')
                        close()
                    }
                    ">
                <div class="icon">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.change_status') }}</span>
                </div>
            </a>
            <a v-if="editable && is_repeatable" v-permission="deactivatePermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="() => {
                        emits('deactivate')
                        close()
                    }
                    ">
                <div class="icon">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.deactivate_employee_variable_payment') }}</span>
                </div>
            </a>
            <a v-if="(!checkPermission(editPermission) && !checkPermission(changeStatusPermission) && !checkPermission(deactivatePermission) || !editable)"
                role="menuitem" class="dropdown-item is-media">
                <div class=" icon">
                    <i class="fas fa-window-close" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.no_actions') }}</span>
                </div>
            </a>

        </template>
    </VDropdown>
</template>
