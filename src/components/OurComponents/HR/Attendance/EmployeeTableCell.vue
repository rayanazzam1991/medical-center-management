<script setup lang="ts">
import { VButtonColor } from '/@src/components/base/button/VButton.vue'

export type EmployeeNameCardRadius = 'regular' | 'smooth' | 'rounded'
export type EmployeeNameCardColor =
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'

export interface EmployeeNameCardButton {
    hasButton: boolean
    buttonTitle?: string
    buttonColor: VButtonColor
}

export interface EmployeeNameCardProps {
    radius?: EmployeeNameCardRadius
    color?: EmployeeNameCardColor
    elevated?: boolean
    title: string
    button?: EmployeeNameCardButton


}

const defaultEmployeeNameCardButton: EmployeeNameCardButton = {
    hasButton: false,
    buttonTitle: undefined,
    buttonColor: 'primary'
}

const emits = defineEmits<{
    (e: 'clickButton'): void
}>()


const props = withDefaults(defineProps<EmployeeNameCardProps>(), {
    radius: undefined,
    color: undefined,
    elevated: false,
    title: '',
    button: undefined,
})

const cardRadius = computed(() => {
    if (props.radius === 'smooth') {
        return 's-card'
    } else if (props.radius === 'rounded') {
        return 'l-card'
    }

    return 'r-card'
})
</script>

<template>
    <div class="is-flex is-justify-content-space-between is-align-items-center "
        :class="[cardRadius, elevated && 'is-raised', props.color && `is-${props.color}`]">
        <div class="column is-four-fifths">
            <h3 class="has-text-primary is-10 mb-2">{{ props.title }}</h3>
        </div>
        <VButton class="column" v-if="props.button.hasButton" :color="props.button.buttonColor"
            @click="() => { emits('clickButton') }">
            {{ props.button.buttonTitle }}
        </VButton>

    </div>
</template>
