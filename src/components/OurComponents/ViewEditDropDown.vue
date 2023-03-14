<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'view'): void
    (e: 'edit'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
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

            <a role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
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
        </template>
    </VDropdown>
</template>
