<script setup lang="ts">
import { AnalystDashboardRoleStats } from '/@src/models/Others/User/dashboard'

export interface RoleStatCard {
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
    roles: Array<AnalystDashboardRoleStats>,
    rounded: boolean
    bordered: boolean
    loading: boolean


}
const props = withDefaults(defineProps<RoleStatCard>(), {
    color: 'primary',
    icon: undefined,
    size: 'small',
    title: '',
    bordered: false,
    rounded: false,
    loading: true,
    roles: undefined
})
console.log(props.roles)
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
            <div class="company-header is-dark-card-bordered is-dark-bg-6 has-slimscroll">
                <div class="header-item is-dark-bordered-12 px-2" v-for="role in roles">
                    <div class="item-inner">
                        <span class="dark-inverted">{{ role.users_count }}</span>
                        <p>{{ role.display_name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </VLoader>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/statCard.scss';

.dashboard-tile {
    min-height: 165px;
}

.company-header {
    display: flex;
    padding: 5px 10px;
    background: var(--white);

    .header-item {
        width: 25%;
        border-left: 1px solid var(--fade-grey-dark-3);

        &:last-child {
            border-left: none;
        }

        .item-inner {
            text-align: center;

            .lnil,
            .lnir {
                font-size: 1.2rem;
                margin-bottom: 6px;
                color: var(--primary);
            }

            span {
                display: block;
                font-family: var(--font);
                font-weight: 600;
                font-size: 1.5rem;
                color: var(--dark-text);
            }

            p {
                font-family: var(--font-alt);
                font-size: 0.95rem;
            }
        }
    }
}
</style>
