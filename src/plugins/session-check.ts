import { checkRequiredPermissions } from '../composable/checkPermission';
import { checkRoles } from '../composable/checkRoles';
import { User } from '../models/Others/User/user';
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

  // try {
  //   loggedUser = userAuth.getUser();
  // }
  // catch (error: any) {
  //   console.log('logged1', loggedUser);
  // }

  router.beforeEach((to, from, next) => {
    // console.log('logged2', loggedUser);
    if (!to.meta.requiresAuth) next()
    else {
      if (!userAuth.isLoggedIn && to.name !== "/auth/login") {
        // 2. If the page requires auth, check if user is logged in
        // if not, redirect to login page.
        next({ name: '/auth/login' })
      } else {
        let loggedUser = {} as User
        loggedUser = userAuth.getUser();
        const userRoles = loggedUser?.roles ?? []; // get the user's role from the store
        const userPermissions: string[] = []
        let havePermission = false
        userRoles.forEach((userRole) => {
          userRole.permissions.forEach((permission) => {
            userPermissions.push(permission.name)
          });
        });
        const requiredPermissions: string[] = to.meta.permissions as string[]; // get the required permissions from the route meta data

        if (userPermissions.length > 0) {
          userPermissions.forEach((userPermission) => {
            if (!requiredPermissions) {
              havePermission = true
            } else {
              if (checkRequiredPermissions(userPermission, requiredPermissions)) {
                havePermission = true
              }
            }

          });
          if (!havePermission) {
            next({ name: '/auth/no-permission' }); // redirect to the unauthorized page if the user doesn't have the required permissions
          } else {
            next();
          }
        } else {
          next({ name: '/auth/login' })
        }
      }
    }

  })
})
