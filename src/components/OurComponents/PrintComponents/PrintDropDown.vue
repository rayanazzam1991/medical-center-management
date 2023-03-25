<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface PrintDropDownProps {
    printPermission: string,
}
const props = withDefaults(defineProps<PrintDropDownProps>(), {
    printPermission: undefined,
})
const printPermission = props.printPermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'print'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="printPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('print')
                    close()
                }
            ">
                <div class="icon ml-1">

                    <i class="lnir lnir-printer" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.print') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(printPermission)" role="menuitem" class="dropdown-item is-media">
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
