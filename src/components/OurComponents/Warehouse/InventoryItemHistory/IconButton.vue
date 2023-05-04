<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode';

const emits = defineEmits<{
    (e: 'click'): void
}>()
const props = defineProps<{
    icon: string
    image_path?: string
}>()
const dark = useDarkmode();

</script>

<template>
    <a v-if="props.image_path" target="_blank" class="file-link" :href="props.image_path">
        <VIconButton :icon="props.icon" />

    </a>
    <VIconButton v-else-if="props.image_path == undefined" @click="() => { emits('click') }" :icon="props.icon" />
</template>
