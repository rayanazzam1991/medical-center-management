<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode';

export interface WalletMovementTableProps {
    title: string
    isHeader?:boolean
    isMainHeader?:boolean
    clickable?: boolean

}


const emits = defineEmits<{
    (e: 'click'): void
}>()

const dark = useDarkmode();

const props = withDefaults(defineProps<WalletMovementTableProps>(), {
    title: '',
    isHeader : false,
    isMainHeader : false ,
    clickable: true,

})

</script>

<template>
    <div v-if="clickable && !isHeader" @click="() => emits('click')" class="card-size cursor ">
        <div class="title-size center">
            <h3 class=" mb-2 has-text-weight-semibold" >{{ props.title }}</h3>
        </div>
    </div>

</template>
