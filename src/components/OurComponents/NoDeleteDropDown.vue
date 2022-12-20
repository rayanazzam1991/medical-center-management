<script setup lang="ts">
const emits = defineEmits<{
    (e: 'view'): void
    (e: 'edit'): void
    (e: 'changeStatus'): void
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
                    <span>View</span>
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
                    <span>Edit</span>
                </div>
            </a>
            <a role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
    () => {
        emits('changeStatus')
        close()
    }
            ">
                <div class="icon">
                    <i class="fas fa-user-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>Change Status</span>
                </div>
            </a>

        </template>
    </VDropdown>
</template>
