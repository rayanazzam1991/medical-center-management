<script lang="ts" setup>
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
  stat: string | number,
  percentage: number,
  increase: 'more' | 'less' | 'same',
  percentage_subtitle: string,
  rounded: boolean
  bordered: boolean
  loading: boolean
  stat_ext: string
  percentage_color_inverted: boolean


}

const props = withDefaults(defineProps<StatCardProps>(), {
  color: 'primary',
  icon: undefined,
  percentage: undefined,
  increase: undefined,
  percentage_subtitle: '',
  size: 'small',
  stat: 0,
  title: '',
  bordered: false,
  rounded: false,
  loading: true,
  stat_ext: '',
  percentage_color_inverted: false
})
const percentageIcon = computed(() => {
  if (props.increase === 'less') {
    return 'feather:trending-down'
  } else if (props.increase === 'more') {
    return 'feather:trending-up'
  } else if (props.increase === 'same') {
    return 'feather:minus'
  }
})
const percentageColor = computed(() => {
  if (props.percentage_color_inverted) {
    if (props.increase === 'less') {
      return 'text-h-green'
    } else if (props.increase === 'more') {
      return 'text-h-red'
    } else if (props.increase === 'same') {
      return 'text-h-blue'
    }
  } else {
    if (props.increase === 'less') {
      return 'text-h-red'
    } else if (props.increase === 'more') {
      return 'text-h-green'
    } else if (props.increase === 'same') {
      return 'text-h-blue'
    }
  }

})

</script>

<template>
  <VLoader :active="props.loading" size="small">
    <div class="dashboard-tile">
      <div class="tile-head">
        <h3 class="dark-inverted">{{ props.title }}</h3>
        <VIconBox :bordered="props.bordered" :color="props.color" :rounded="props.rounded" :size="props.size">
          <i v-if="props.icon.includes(':')" :data-icon="props.icon" aria-hidden="true" class="iconify"></i>
          <i v-else :class="props.icon" aria-hidden="true"></i>
        </VIconBox>
      </div>
      <div class="tile-body">
        <span class="dark-inverted">{{ props.stat }} <span class="is-size-6">{{ props.stat_ext }}</span></span>
      </div>
      <div class="tile-foot">
                <span v-if="props.percentage != undefined" :class="percentageColor">
                    {{ props.percentage.toString() + ' ' + '%' }}
                    <i :data-icon="percentageIcon" aria-hidden="true" class="iconify"></i>
                </span>
        <span class="mx-2">{{ props.percentage_subtitle }}</span>
      </div>
    </div>
  </VLoader>
</template>

<style lang="scss" scoped>
@import '/@src/scss/Styles/Dashboards/statCard.scss';
</style>
