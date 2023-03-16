import { checkRoles } from '../composable/checkRoles';
import { Roles } from '../utils/consts/rolesPermissions';
import { definePlugin } from '/@src/app'
import { useAuth } from "/@src/stores/Others/User/authStore";


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
  const loggedUser = JSON.parse(userAuth.loggedUser);
  // console.log('logged', loggedUser.roles[0].name);


  router.beforeEach((to, from, next) => {
    const hasEmployeePath = to.path.includes('/employee');
    const userRole = loggedUser?.roles[0].name; // get the user's role from the store

    if (hasEmployeePath && userRole !== Roles.ADMIN) {
      const employeeId = to.params.id;
      const loggedEmployeeId = loggedUser?.id
      if (employeeId !== loggedEmployeeId) {
        next({ name: '/auth/login' }); // redirect to the unauthorized page if the user doesn't have the required permissions
      } else {
        next(); // allow the user to access the route
      }
    }
    


    const requiredRoles: string[] = to.meta.roles as string[]; // get the required permissions from the route meta data

    if (requiredRoles && !checkRoles(userRole, requiredRoles)) {
      next({ name: '/auth/login' }); // redirect to the unauthorized page if the user doesn't have the required permissions
    } else {
      next(); // allow the user to access the route
    }

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
