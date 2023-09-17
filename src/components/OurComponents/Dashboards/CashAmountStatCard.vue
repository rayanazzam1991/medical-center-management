<script setup lang="ts">
export interface StatCardProps {
    title: string,
    color: | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'yellow'
    | 'orange'
    | 'green'
    | 'red'
    | 'blue',
    size: 'small' | 'medium' | 'large' | 'big' | 'xl',
    icon: string,
    stats: Array<string>,
    percentages: Array<number>,
    increases: Array<'more' | 'less' | 'same'>,
    percentage_subtitles: Array<string>,
    rounded: boolean
    bordered: boolean
    loading: boolean
    stats_ext: Array<string>


}
const props = withDefaults(defineProps<StatCardProps>(), {
    color: undefined,
    icon: undefined,
    percentages: undefined,
    increases: undefined,
    percentage_subtitles: undefined,
    size: 'small',
    stats: undefined,
    title: '',
    bordered: false,
    rounded: false,
    loading: true,
    stats_ext: undefined,
})
const percentageIcon = computed((index: number) => {
    if (props.increases[index] === 'less') {
        return 'feather:trending-down'
    } else if (props.increases[index] === 'more') {
        return 'feather:trending-up'
    } else if (props.increases[index] === 'same') {
        return 'feather:minus'
    }
})
const percentagesIcons = computed(() => {
    let icons: Array<string> = []
    props.increases.forEach((increase) => {
        if (increase === 'less') {
            icons.push('feather:trending-down')
        } else if (increase === 'more') {
            icons.push('feather:trending-up')
        } else if (increase === 'same') {
            icons.push('feather:minus')
        }
    });
    return icons
})

const percentagesColors = computed(() => {
    let colors: Array<string> = []
    props.increases.forEach((increase) => {
        if (increase === 'less') {
            colors.push('text-h-red')
        } else if (increase === 'more') {
            colors.push('text-h-green')
        } else if (increase === 'same') {
            colors.push('text-h-blue')
        }
    });
    return colors
})
</script>

<template>
    <VLoader size="small" :active="props.loading">
        <div class="dashboard-tile">
            <div class="tile-head">
                <h3 class="dark-inverted">{{ props.title }}</h3>
                <VIconBox :color="props.color" :size="props.size" :bordered="props.bordered" :rounded="props.rounded">
                    <i v-if="props.icon.includes(':')" class="iconify" :data-icon="props.icon" aria-hidden="true"></i>
                    <i v-else aria-hidden="true" :class="props.icon"></i>
                </VIconBox>
            </div>
            
            <div class="tile-section" v-for="(stat, index) in props.stats">
                <div class="tile-body">
                    <span class="dark-inverted">{{ stat }} <span class="is-size-6">{{ props.stats_ext[index]
                    }}</span></span>
                </div>
                <div class="tile-foot">
                    <span v-if="props.percentages[index] != undefined" :class="percentagesColors[index]">
                        {{ props.percentages[index].toString() + ' ' + '%' }}
                        <i class="iconify" :data-icon="percentagesIcons[index]" aria-hidden="true"></i>
                    </span>
                    <span class="mx-2">{{ props.percentage_subtitles[index] }}</span>
                </div>
            </div>
        </div>
    </VLoader>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/Dashboards/statCard.scss';
</style>
