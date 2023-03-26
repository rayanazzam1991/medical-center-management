<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface TicketDropDownProps {
  viewPermission: string,
  viewCurrentServiceCardPermission: string,
  editPermission: string,
  closeTicketPermission: string,
  confirmPayement: string
}
const props = withDefaults(defineProps<TicketDropDownProps>(), {
  viewPermission: undefined,
})
const viewPermission = props.viewPermission

const { t } = useI18n()
const emits = defineEmits<{
  (e: 'view'): void
  (e: 'viewCurrentServiceCard'): void
  (e: 'edit'): void
  (e: 'confirmPayement'): void
  (e: 'closeTicket'): void
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
      <a v-permission="viewCurrentServiceCardPermission" role="menuitem" href="#" class="dropdown-item is-media"
        @click.prevent="
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
      <a v-permission="confirmPayement" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
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
      <a v-permission="closeTicketPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
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
      <a v-if="!checkPermission(viewPermission) && !checkPermission(viewCurrentServiceCardPermission) &&
        !checkPermission(editPermission) && !checkPermission(closeTicketPermission)" role="menuitem"
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
