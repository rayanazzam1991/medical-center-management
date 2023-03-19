<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface EmployeeDropDownProps {
    viewPermission: string,
    changeStatusPermission: string,
    viewMyWaitingListPermission: string,
}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'view'): void
    (e: 'changeStatus'): void
    (e: 'viewMyWaitingList'): void
}>()
const props = withDefaults(defineProps<EmployeeDropDownProps>(), {
    viewPermission: undefined,
    changeStatusPermission: undefined,
    viewMyWaitingListPermission: undefined
})
const viewPermission = props.viewPermission
const changeStatusPermission = props.changeStatusPermission
const viewMyWaitingListPermission = props.viewMyWaitingListPermission

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="viewPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('view')
                    close()
                }
            ">
                <div class="icon">
                    <i aria-hidden="true" class="fas fa-eye"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.view') }}</span>
                </div>
            </a>
            <a v-permission="viewMyWaitingListPermission" role="menuitem" href="#" class="dropdown-item is-media"
                @click.prevent="
                    () => {
                        emits('viewMyWaitingList')
                        close()
                    }
                ">
                <div class="icon">
                    <i class="fas fa-list-alt" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.view_my_waiting_list') }}</span>
                </div>
            </a>

            <a v-permission="changeStatusPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('changeStatus')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-user-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.change_status') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(viewMyWaitingListPermission) && !checkPermission(changeStatusPermission) && !checkPermission(viewPermission)"
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
