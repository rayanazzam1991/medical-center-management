<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode';

export type TableCellCardRadius = 'regular' | 'smooth' | 'rounded'
export type TableCellTitleSize = 'small' | 'medium' | 'large'
export type TableCellCardColor =
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dark'
    | 'white'
    | 'disabled'

export interface TableCellCardProps {
    radius?: TableCellCardRadius
    color?: TableCellCardColor
    elevated?: boolean
    title: string
    subtitle?: string
    subtitle2?: string
    clickable?: boolean
    titleSize?: TableCellTitleSize


}


const emits = defineEmits<{
    (e: 'click'): void
}>()

const dark = useDarkmode();

const props = withDefaults(defineProps<TableCellCardProps>(), {
    radius: undefined,
    color: undefined,
    elevated: false,
    title: '',
    subtitle: '',
    clickable: true,
    titleSize: 'small'
})

const cardRadius = computed(() => {
    if (props.radius === 'smooth') {
        return 's-card'
    } else if (props.radius === 'rounded') {
        return 'l-card'
    }

    return 'r-card'
})

const titleSizeStyle = computed(() => {
    if (props.titleSize === 'large') {
        return 'is-size-3'
    } else if (props.titleSize === 'medium') {
        return 'is-size-5'
    }

    return 'is-size-7'
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
    <div v-if="clickable" @click="() => emits('click')" :class="[cardRadius, cardColor]" class="card-size cursor sub-card-size ">
        <div class="title-size center">
            <h3 class=" mb-1 has-text-weight-normal" :class="[titleSizeStyle, textColor]">{{ props.title }}</h3>
            <p class="" v-if="props.subtitle != ''" :class="subtitleColor">{{ props.subtitle }} </p>
            <p class="" v-if="props.subtitle2 != ''" :class="subtitleColor">{{ props.subtitle2 }} </p>
        </div>
    </div>
    <div v-else :class="[cardRadius, cardColor]" class="card-size">
        <div class="title-size center">
            <h3 @click="() => emits('click')" class=" mb-1 has-text-weight-normal cursor"
                :class="[titleSizeStyle, textColor]">
                {{ props.title }} </h3>
            <p class="" v-if="props.subtitle != ''" :class="subtitleColor">{{ props.subtitle }} </p>
            <p class="" v-if="props.subtitle2 != ''" :class="subtitleColor">{{ props.subtitle2 }} </p>
        </div>
    </div>

</template>

<style scoped lang="scss">
.card-size {
    min-height: 100%;
    width: 100px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
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

</style>