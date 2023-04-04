<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface DismissEmployeeDropDownProps {
  viewPermission: string,

}

const { t } = useI18n()
const emits = defineEmits<{
  (e: 'view'): void
}>()
const props = withDefaults(defineProps<DismissEmployeeDropDownProps>(), {
  viewPermission: undefined,
})
const viewPermission = props.viewPermission


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





    </template>
  </VDropdown>
</template>
