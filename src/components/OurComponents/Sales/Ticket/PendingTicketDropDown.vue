<script setup lang="ts">
import { useI18n } from 'vue-i18n';
export interface ConfirmPaymentTicketProps {
  viewPermission: string,
  confirmPayementPermission: string
}
const props = withDefaults(defineProps<ConfirmPaymentTicketProps>(), {
  viewPermission: undefined,
})
const viewPermission = props.viewPermission

const { t } = useI18n()
const emits = defineEmits<{
  (e: 'view'): void
  (e: 'confirmPayement'): void
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
      <a v-permission="confirmPayementPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
        () => {
          emits('confirmPayement')
          close()
        }
      ">
        <div class="icon">
          <i class="fas fa-edit" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>{{ t('drop_down.confirm_payement') }}</span>
        </div>
      </a>

    </template>
  </VDropdown>
</template>
