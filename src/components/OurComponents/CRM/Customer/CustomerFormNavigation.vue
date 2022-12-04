<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps'
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)

const customerForm = useCustomerForm()
</script>

<template>
  <nav class="wizard-navigation">
    <!-- 
    <RouterLink to="/" class="wizard-brand">
      <AnimatedLogo width="38px" height="38px" />
    </RouterLink> -->

    <div class="">
      <span class="title-wrap">
        <VButton class="navbar-item is-wizard-title" icon="lnir lnir-arrow-left rem-100" to="#" darkOutlined
          color="white">
          Back to previous page
        </VButton>
      </span>
    </div>
    <div class="navbar-item is-wizard-title wizard-brand">
      <span class="title-wrap">
        Step {{ customerForm.step }}: <span>{{ customerForm.stepTitle }}</span>
      </span>
    </div>

    <VDropdown class="wizard-dropdown">
      <template #button="{ toggle }">
        <div tabindex="0" class="is-trigger" @click="toggle" @keydown.space.prevent="toggle">
          <i aria-hidden="true" class="iconify" data-icon="feather:chevron-down"></i>
        </div>
      </template>
      <template #content="{ close }">
        <RouterLink :class="[customerForm.step < 1 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add" @click.passive="close">
          Step 1: Main Info
        </RouterLink>
        <RouterLink :class="[customerForm.step < 2 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add/additional-info" @click.passive="close">
          Step 2: Additional Info
        </RouterLink>
        <RouterLink :class="[customerForm.step < 3 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add/profile-picture" @click.passive="close">
          Step 3: Profile Picture
        </RouterLink>
        <RouterLink :class="[customerForm.step < 4 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add/medical-info" @click.passive="close">
          Step 4: Medical Info
        </RouterLink>
        <RouterLink :class="[customerForm.step < 5 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add/social-media" @click.passive="close">
          Step 5: Social Media
        </RouterLink>
        <RouterLink :class="[customerForm.step < 5 && 'is-disabled']" class="dropdown-item kill-drop" tabindex="0"
          to="/customer-add/preview" @click.passive="close">
          Step 6: Preview
        </RouterLink>
      </template>
    </VDropdown>
    <div class="navbar-item is-dark-mode">
      <div class="navbar-icon">
        <label class="dark-mode">
          <input data-cy="dark-mode-toggle" type="checkbox" :checked="!darkmode.isDark" @change="darkmode.onChange" />
          <span></span>
        </label>
      </div>
    </div>

  </nav>
</template>

<style lang="scss" scoped>
.wizard-navigation {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  background: var(--white);
  padding: 0 20px;
  transition: all 0.3s; // transition-all test
  z-index: 99;

  .wizard-brand {
    img {
      display: block;
      height: 34px;
      margin: 0 auto;
    }
  }

  .navbar-item {
    &.is-wizard-title {
      margin-left: 15px;
      border-left: 1px solid var(--muted-grey-light-15);
      padding-bottom: 6px;
      padding-top: 6px;
      font-family: var(--font);

      .title-wrap {
        position: relative;
        display: block;
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;

        span {
          font-weight: 400;
        }
      }
    }
  }

  .wizard-dropdown {
    cursor: pointer;

    .is-trigger {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;

      svg {
        height: 18px;
        width: 18px;
        color: var(--light-text);
      }
    }

    .dropdown-menu,
    :deep(.dropdown-menu) {
      border: 1px solid var(--fade-grey-dark-3);
      box-shadow: var(--light-box-shadow);
      border-radius: 8px;
      padding-top: 0;
      overflow: hidden;

      .dropdown-content {
        .dropdown-item {
          font-family: var(--font);
        }
      }
    }
  }

  .is-dark-mode {
    margin-left: auto;
    background: transparent !important;

    .navbar-icon {
      height: 38px;
      width: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-rounded);
      border: 1px solid var(--fade-grey-dark-3);
      box-shadow: var(--light-box-shadow);
      background: var(--white);
      transition: all 0.3s; // transition-all test

      .dark-mode {
        transform: scale(0.6);
      }
    }
  }

  .user-dropdown {
    .is-trigger {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;

      .profile-avatar {
        position: relative;

        .avatar {
          display: block;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-rounded);
        }

        .badge {
          position: absolute;
          right: -8px;
          bottom: 0;
          width: 20px;
          height: 20px;
          border: 2px solid var(--white);
          border-radius: var(--radius-rounded);
        }
      }

      svg {
        margin-left: 3px;
        width: 18px;
        height: 18px;
        color: var(--light-text);
        transition: all 0.3s; // transition-all test
      }
    }

    .dropdown-menu {
      top: 52px;
      border: 1px solid var(--fade-grey-dark-3);
      box-shadow: var(--light-box-shadow);
      border-radius: 8px;
      padding-top: 0;
      width: 180px;
      overflow: hidden;

      .dropdown-item {
        display: flex;
        align-items: center;
        font-family: var(--font);
        font-size: 0.9rem;
        padding: 8px 12px;
        color: var(--light-text);

        p {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--dark-text);
        }

        svg {
          margin-right: 8px;
          height: 16px;
          width: 16px;
          color: var(--light-text);
        }
      }
    }
  }
}
</style>
