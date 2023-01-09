<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode';

export type AttendanceTableCellCardRadius = 'regular' | 'smooth' | 'rounded' | 'none'
export type AttendanceTableCellTitleSize = 'xs' | 'small' | 'medium' | 'large'
export type AttendanceTableCellCardColor =
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dark'
    | 'white'
    | 'disabled'

    export type AttendanceStatusColor =
    | 'blue'
    | 'grey'
    | 'green'
    | 'red'
    | 'yellow'


export interface AttendanceTableCellCardProps {
    radius?: AttendanceTableCellCardRadius
    color?: AttendanceTableCellCardColor
    statusColor?: AttendanceStatusColor
    elevated?: boolean
    title: string
    subtitle?: string
    subtitle2?: string
    clickable?: boolean
    titleSize?: AttendanceTableCellTitleSize
    isHeader?:boolean
    isMainHeader?:boolean
    headerTitle? : string


}


const emits = defineEmits<{
    (e: 'click'): void
}>()

const dark = useDarkmode();

const props = withDefaults(defineProps<AttendanceTableCellCardProps>(), {
    radius: undefined,
    color: undefined,
    statusColor: 'grey',
    elevated: false,
    title: '',
    subtitle: '',
    clickable: true,
    titleSize: 'small',
    isHeader : false,
    isMainHeader : false ,
    headerTitle : '',
})

const cardRadius = computed(() => {
    if (props.radius === 'smooth') {
        return 's-card'
    } else if (props.radius === 'rounded') {
        return 'l-card'
    } else if (props.radius === 'none') {
        return ''
    }

    return 'r-card'
})

const titleSizeStyle = computed(() => {
    if (props.titleSize === 'large') {
        return 'is-size-3'
    } else if (props.titleSize === 'medium') {
        return 'is-size-4'
    }

    return 'is-size-6'
})
const subtitleColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-text-grey-light	'
        else
            return 'has-text-grey-light		'
    } else if (props.color === 'white') {
        if (dark.isDark == false)

            return 'has-text-primary'
        else
            return 'has-text-primary-light'

    } else if (props.color === 'disabled') {
        if (dark.isDark == false)

            return 'has-text-grey'
        else
            return 'has-text-grey'

    }
    if (dark.isDark == false)
        return 'has-text-primary'
    else
        return 'has-text-grey'

})
const textColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-text-grey-dark'
        else
            return 'has-text-light	'
    } else if (props.color === 'white') {
        if (dark.isDark == false)

            return 'has-text-primary'
        else
            return 'has-text-primary-light'

    } else if (props.color === 'disabled') {
        if (dark.isDark == false)

            return 'has-text-grey'
        else
            return 'has-text-grey'

    }
    if (dark.isDark == false)
        return 'has-text-primary'
    else
        return 'has-text-grey'

})
const cardColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return ''
        else
            return ''
    } else if (props.color === 'white') {
        if (dark.isDark == false)

            return 'has-background-grey-lighter'
        else
            return 'has-background-grey-dark'

    } else if (props.color === 'disabled') {
        if (dark.isDark == false)

            return ''
        else
            return ''

    }
    if (dark.isDark == false)

        return 'has-background-light'
    else
        return 'has-background-light'

})

</script>

<template>
    <div v-if="clickable && !isHeader" @click="() => emits('click')" :class="[cardRadius, cardColor]" class="card-size cursor ">
        <div class="title-size center">
            <h3 class=" mb-2 has-text-weight-normal" :class="[titleSizeStyle, textColor , props.statusColor]" >{{ props.title }}</h3>
            <p class="" v-if="props.subtitle != ''" :class="subtitleColor">{{ props.subtitle }} </p>
            <p class="" v-if="props.subtitle2 != ''" :class="subtitleColor">{{ props.subtitle2 }} </p>
        </div>
    </div>
    <div v-if="!clickable && !isHeader" :class="[cardRadius, cardColor]" class="main-card">
        <div class="title-size center">
            <h3 @click="() => emits('click')" class=" mb-1 has-text-weight-normal is-size-7 cursor"
                :class="[titleSizeStyle, textColor]">
                {{ props.title }} </h3>
            <p class="is-size-7 mb-0 pb-0" v-if="props.subtitle != ''" :class="subtitleColor">{{ props.subtitle }} </p>
            <p class="is-size-7 mt-0 pt-0" v-if="props.subtitle2 != ''" :class="subtitleColor">{{ props.subtitle2 }} </p>
        </div>
    </div>
    <div v-if="isHeader && isMainHeader" class="header"  >
            <h1 class="mb-0 is-capitalized has-text-weight-light is-size-7 has-text-centered main-size" >{{ props.headerTitle }}</h1>
    </div>
    <div v-if="isHeader && !isMainHeader" class="header"  >
            <h1 class="mb-0 is-capitalized has-text-weight-light is-size-7 has-text-centered header-size " >{{ props.headerTitle }}</h1>
    </div>


</template>

<style scoped lang="scss">
.header{
    padding-left: 10px;
    padding-right: 10px;

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
    padding-left: 10px;
    padding-right: 10px;

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
    padding-right: 10px ;
    padding-left: 10px ;
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