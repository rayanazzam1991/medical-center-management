<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode';

export type ReservationTableCellCardRadius = 'regular' | 'smooth' | 'rounded'
export type ReservationTableCellTitleSize = 'small' | 'medium' | 'large' | 'normal'
export type ReservationTableCellCardColor =
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'dark'
    | 'white'
    | 'disabled'

export interface ReservationTableCellCardProps {
    radius?: ReservationTableCellCardRadius
    color?: ReservationTableCellCardColor
    elevated?: boolean
    customer_name?: string
    service_name?: string
    is_reserved?: boolean
    time_title?: string
    icon?: string
    clickable?: boolean
    titleSize?: ReservationTableCellTitleSize
    is_main_card?: boolean


}


const emits = defineEmits<{
    (e: 'click'): void
}>()

const dark = useDarkmode();

const props = withDefaults(defineProps<ReservationTableCellCardProps>(), {
    radius: undefined,
    color: undefined,
    elevated: false,
    customer_name: undefined,
    service_name: undefined,
    icon: undefined,
    is_reserved: false,
    time_title: undefined,
    clickable: true,
    titleSize: 'small',
    is_main_card: false
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
    else if (props.titleSize === 'normal') {
        return 'is-size-6'
    }
    return 'is-size-7'
})
const subtitleSizeStyle = computed(() => {
    if (props.titleSize === 'large') {
        return 'is-size-3'
    } else if (props.titleSize === 'medium') {
        return 'is-size-5'
    }
    else if (props.titleSize === 'normal') {
        return 'is-size-6'
    }

    return 'is-size-7'
})
const subtitleColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-light'
    } else if (props.color === 'warning') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-light'
    } else if (props.color === 'disabled') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-dark'
    } else if (props.color === 'white') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-dark'
    }

})
const textColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-light'
    } else if (props.color === 'warning') {
        if (dark.isDark == false)
            return 'has-text-light'
        else
            return 'has-text-light'
    } else if (props.color === 'disabled') {
        if (dark.isDark == false)
            return 'has-text-white-ter'
        else
            return 'has-text-grey-light'
    } else if (props.color === 'white') {
        if (dark.isDark == false)
            return 'has-text-grey-dark'
        else
            return 'has-text-grey-light'
    }

})
const cardColor = computed(() => {
    if (props.color === 'primary') {
        if (dark.isDark == false)
            return 'has-background-primary'
        else
            return 'has-background-primary'
    } else if (props.color === 'warning') {
        if (dark.isDark == false)
            return 'has-background-warning'
        else
            return 'has-background-warning'
    } else if (props.color === 'white') {
        if (dark.isDark == false)
            return ''
        else
            return ''
    } else if (props.color === 'disabled') {
        if (dark.isDark == false)
            return 'has-background-grey-lighter'
        else
            return 'has-background-grey-dark'
    }
})
</script>

<template>
    <div v-if="is_main_card" :class="[cardRadius, cardColor]" class="card-size sub-card-size ">
        <div class="title-size center">
            <h3 class=" mb-1 has-text-weight-normal" :class="[titleSizeStyle, textColor]">{{ props.time_title }}</h3>
        </div>
    </div>
    <div v-else-if="is_reserved" :class="[cardRadius, cardColor, clickable && 'cursor']" @click="() => emits('click')"
        class="card-size">
        <div class="title-size center">
            <h3 @click="() => emits('click')" class=" mb-1 has-text-weight-normal" :class="[titleSizeStyle, textColor]">
                {{ props.customer_name }} </h3>
            <p class="" :class="[subtitleSizeStyle, subtitleColor]">{{ props.service_name }} </p>
        </div>
    </div>
    <div v-else-if="icon" :class="[cardRadius, cardColor, clickable && 'cursor']" @click="() => emits('click')"
        class="card-size">
        <div class="title-size center">
            <div class=" mb-1 has-text-weight-normal" :class="[titleSizeStyle, textColor]">
                <i v-if="props.icon.includes(':')" :data-icon="props.icon" aria-hidden="true" class="iconify"></i>
                <i v-else :class="props.icon" aria-hidden="true"></i>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card-size {
    min-height: 100px;
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