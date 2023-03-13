<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const emits = defineEmits<{
  (e: 'view'): void
  (e: 'viewCurrentServiceCard'): void
  (e: 'edit'): void
  (e: 'closeTicket'): void
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
          emits('viewCurrentServiceCard')
          close()
        }
      ">
        <div class="icon">
          <i class="fas fa-ticket-alt" aria-hidden="true"></i>

        </div>
        <div class="meta">
          <span>{{ t('drop_down.view_current_service_card') }}</span>
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
      <a role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
        () => {
          emits('closeTicket')
          close()
        }
      ">
        <div class="icon">
          <i class="lnir lnir-close" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>{{ t('drop_down.close_ticket') }}</span>
        </div>
      </a>

    </template>
  </VDropdown>
</template>
