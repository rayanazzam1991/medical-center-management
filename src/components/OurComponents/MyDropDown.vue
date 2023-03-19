<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface MyDropDownProps {
    viewPermission: string,
    editPermission: string,
    removePermission: string,
}
const props = withDefaults(defineProps<MyDropDownProps>(), {
    viewPermission: undefined,
    editPermission: undefined,
    removePermission: undefined,
})
const viewPermission = props.viewPermission
const editPermission = props.editPermission
const removePermission = props.removePermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'view'): void
    (e: 'edit'): void
    (e: 'remove'): void
}>()
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

            <hr class="dropdown-divider" />

            <a v-permission="removePermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('remove')
                    close()
                }">
                <div class="icon">
                    <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.remove') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(removePermission) && !checkPermission(editPermission) && !checkPermission(viewPermission)"
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
