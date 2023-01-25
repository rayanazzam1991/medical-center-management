<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const emits = defineEmits<{
    (e: 'clickPay'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('clickPay')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-money-check-alt" aria-hidden="true"></i>
                                </div>
                <div class="meta">
                    <span>{{t('deliver_salaries.drop_down.pay')}}</span>
                </div>
            </a>
        </template>
    </VDropdown>
</template>
