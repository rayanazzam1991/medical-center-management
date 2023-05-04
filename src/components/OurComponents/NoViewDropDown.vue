<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface NoViewDropDown {
    editPermission: string,
    changeStatusPermission: string
}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'edit'): void
    (e: 'changeStatus'): void
}>()
const props = withDefaults(defineProps<NoViewDropDown>(), {
    editPermission: undefined,
    changeStatusPermission: undefined
})
const editPermission = props.editPermission
const changeStatusPermission = props.changeStatusPermission

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="editPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
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
            <a v-permission="changeStatusPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
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
            <a v-if="!checkPermission(editPermission) && !checkPermission(changeStatusPermission)" role="menuitem"
                class="dropdown-item is-media">
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
