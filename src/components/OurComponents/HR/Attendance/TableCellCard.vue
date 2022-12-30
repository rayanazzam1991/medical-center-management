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
    clickable: false,
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
        return 'is-size-4'
    }

    return 'is-size-6'
})
const TextColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-text-light'
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
            return 'has-background-primary'
        else
            return 'has-background-success-dark'
    } else if (props.color === 'white') {
        if (dark.isDark == false)

            return 'has-background-light'
        else
            return 'has-background-grey-dark'

    } else if (props.color === 'disabled') {
        if (dark.isDark == false)

            return 'has-background-grey-lighter'
        else
            return 'has-background-dark'

    }
    if (dark.isDark == false)

        return 'has-background-light'
    else
        return 'has-background-light'

})
</script>

<template>
    <div @click="() => emits('click')" :class="[cardRadius, elevated && 'is-raised', cardColor]" class="card-size card">
        <div class="title-size center">
            <h3 class=" mb-2 has-text-weight-normal" :class="[titleSizeStyle, TextColor]">{{ props.title }}</h3>
            <p class="" v-if="props.subtitle != ''" :class="TextColor">{{ props.subtitle }} </p>
        </div>
    </div>

</template>

<style scoped lang="scss">
.card-size {
    min-height: 100%;
    width: 124px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.flex-table-cell.cell-center {
    text-align-last: center
}

.card {
    cursor: pointer;
}

.card:hover {
    &:hover {
        transform: scale(1.05);
    }

}
</style>