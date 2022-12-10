import { definePlugin } from '/@src/app'
import {useAuth} from "/@src/stores/Others/User/authStore";


/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */
export default definePlugin(async ({ router, api, pinia }) => {
  const userAuth = useAuth(pinia)

  // 1. Check token validity at app startup
  // if (userAuth.isLoggedIn) {
  //   try {
  //     // Do api request call to retreive user profile.
  //     // Note that the api is provided with json-server
  //     const { data: user } = await api.get('/api/users/me')
  //     userAuth.setUser(user)
  //   } catch (err) {
  //     // delete stored token if it fails
  //     userAuth.logoutUser()
  //   }
  // }

  // router.beforeResolve(async to => {
  //   if (to.path =='/auth/login' && userAuth.isLoggedIn) {
  //     return {
  //       name: '/dashboard/',
  //       // save the location we were at to come back later
  //       query: { redirect: '/dashboard/' },
  //     }
  //   }
  // })
  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !userAuth.isLoggedIn) {
      // 2. If the page requires auth, check if user is logged in
      // if not, redirect to login page.
      return {
        name: '/auth/login',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }
  })
})
