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

<style scoped lang="scss">
.header{
    padding-left: 10px;
    padding-right: 5px;

    width: 160px !important;

}
.header-size {
    width: 18px !important;
        padding-left: 5px;
    padding-right: 5px;

}
.header-size:first-child {
    padding-left: 0;

}
.header-size:last-child {
    padding-right: 0;

}
.main-size {
    padding-left: px;
    padding-right: 5px;

    width: 120px !important;
}
.card-size {
    min-height: 100%;
    max-width: 1px !important;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border: 0;
    background: none;
    padding: 0;
}
.main-card {
    padding-right: 5px ;
    padding-left: 5px ;
    padding-top: 0;
    padding-bottom: 0;
    width: 120px !important;
    background: none;
    // height: 30px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border: 0;
}

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.flex-table-cell.cell-center {
    text-align-last: center
}

.cursor {
    cursor: pointer;
}



.cursor {
    &:hover {
        color: var(--primary) !important;

    }

}
.blue{
    color: rgb(0, 0, 255) !important;
}
.red{
    color: rgb(255, 0, 0) !important;
}
.grey{
    color: grey !important;
}
.yellow{
    color: rgb(255, 208, 0) !important; 
}
.green{
    color: rgb(0, 255, 0) !important;
}
</style>