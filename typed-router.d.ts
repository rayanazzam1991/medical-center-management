// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

/// <reference types="unplugin-vue-router/client" />

import type {
  // type safe route locations
  RouteLocationTypedList,
  RouteLocationResolvedTypedList,
  RouteLocationNormalizedTypedList,
  RouteLocationNormalizedLoadedTypedList,

  // helper types
  // route definitions
  RouteRecordInfo,
  ParamValue,
  ParamValueOneOrMore,
  ParamValueZeroOrMore,
  ParamValueZeroOrOne,

  // vue-router extensions
  _RouterTyped,
  RouterLinkTyped,
  NavigationGuard,
  UseLinkFnTyped,

  // data fetching
  _DataLoader,
  _DefineLoaderOptions,
} from 'unplugin-vue-router'

declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...all]': RouteRecordInfo<'/[...all]', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/add-quantity': RouteRecordInfo<'/add-quantity', '/add-quantity', Record<never, never>, Record<never, never>>,
    '/add-quantity/': RouteRecordInfo<'/add-quantity/', '/add-quantity/', Record<never, never>, Record<never, never>>,
    '/attendance-justification': RouteRecordInfo<'/attendance-justification', '/attendance-justification', Record<never, never>, Record<never, never>>,
    '/attendance-justification/': RouteRecordInfo<'/attendance-justification/', '/attendance-justification/', Record<never, never>, Record<never, never>>,
    '/auth': RouteRecordInfo<'/auth', '/auth', Record<never, never>, Record<never, never>>,
    '/auth/login': RouteRecordInfo<'/auth/login', '/auth/login', Record<never, never>, Record<never, never>>,
    '/auth/signup': RouteRecordInfo<'/auth/signup', '/auth/signup', Record<never, never>, Record<never, never>>,
    '/category': RouteRecordInfo<'/category', '/category', Record<never, never>, Record<never, never>>,
    '/category/': RouteRecordInfo<'/category/', '/category/', Record<never, never>, Record<never, never>>,
    '/category/[id]/edit': RouteRecordInfo<'/category/[id]/edit', '/category/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/category/add': RouteRecordInfo<'/category/add', '/category/add', Record<never, never>, Record<never, never>>,
    '/city': RouteRecordInfo<'/city', '/city', Record<never, never>, Record<never, never>>,
    '/city/': RouteRecordInfo<'/city/', '/city/', Record<never, never>, Record<never, never>>,
    '/city/[id]/': RouteRecordInfo<'/city/[id]/', '/city/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/city/[id]/edit': RouteRecordInfo<'/city/[id]/edit', '/city/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/city/add': RouteRecordInfo<'/city/add', '/city/add', Record<never, never>, Record<never, never>>,
    '/contractor': RouteRecordInfo<'/contractor', '/contractor', Record<never, never>, Record<never, never>>,
    '/contractor/': RouteRecordInfo<'/contractor/', '/contractor/', Record<never, never>, Record<never, never>>,
    '/contractor/[id]/': RouteRecordInfo<'/contractor/[id]/', '/contractor/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/contractor-add': RouteRecordInfo<'/contractor-add', '/contractor-add', Record<never, never>, Record<never, never>>,
    '/contractor-add/': RouteRecordInfo<'/contractor-add/', '/contractor-add/', Record<never, never>, Record<never, never>>,
    '/contractor-add/[id]/services': RouteRecordInfo<'/contractor-add/[id]/services', '/contractor-add/:id/services', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/contractor-edit': RouteRecordInfo<'/contractor-edit', '/contractor-edit', Record<never, never>, Record<never, never>>,
    '/contractor-edit/[id]/': RouteRecordInfo<'/contractor-edit/[id]/', '/contractor-edit/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/contractor-edit/[id]/services': RouteRecordInfo<'/contractor-edit/[id]/services', '/contractor-edit/:id/services', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer': RouteRecordInfo<'/customer', '/customer', Record<never, never>, Record<never, never>>,
    '/customer/': RouteRecordInfo<'/customer/', '/customer/', Record<never, never>, Record<never, never>>,
    '/customer/[id]/': RouteRecordInfo<'/customer/[id]/', '/customer/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-add': RouteRecordInfo<'/customer-add', '/customer-add', Record<never, never>, Record<never, never>>,
    '/customer-add/': RouteRecordInfo<'/customer-add/', '/customer-add/', Record<never, never>, Record<never, never>>,
    '/customer-add/[id]/medical-info': RouteRecordInfo<'/customer-add/[id]/medical-info', '/customer-add/:id/medical-info', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-add/[id]/social-media': RouteRecordInfo<'/customer-add/[id]/social-media', '/customer-add/:id/social-media', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-edit': RouteRecordInfo<'/customer-edit', '/customer-edit', Record<never, never>, Record<never, never>>,
    '/customer-edit/[id]/': RouteRecordInfo<'/customer-edit/[id]/', '/customer-edit/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-edit/[id]/medical-info': RouteRecordInfo<'/customer-edit/[id]/medical-info', '/customer-edit/:id/medical-info', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-edit/[id]/social-media': RouteRecordInfo<'/customer-edit/[id]/social-media', '/customer-edit/:id/social-media', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-group': RouteRecordInfo<'/customer-group', '/customer-group', Record<never, never>, Record<never, never>>,
    '/customer-group/': RouteRecordInfo<'/customer-group/', '/customer-group/', Record<never, never>, Record<never, never>>,
    '/customer-group/[id]/': RouteRecordInfo<'/customer-group/[id]/', '/customer-group/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-group/[id]/edit': RouteRecordInfo<'/customer-group/[id]/edit', '/customer-group/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/customer-group/add': RouteRecordInfo<'/customer-group/add', '/customer-group/add', Record<never, never>, Record<never, never>>,
    '/dashboard': RouteRecordInfo<'/dashboard', '/dashboard', Record<never, never>, Record<never, never>>,
    '/dashboard/': RouteRecordInfo<'/dashboard/', '/dashboard/', Record<never, never>, Record<never, never>>,
    '/department': RouteRecordInfo<'/department', '/department', Record<never, never>, Record<never, never>>,
    '/department/': RouteRecordInfo<'/department/', '/department/', Record<never, never>, Record<never, never>>,
    '/department/[id]/': RouteRecordInfo<'/department/[id]/', '/department/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/department/[id]/edit': RouteRecordInfo<'/department/[id]/edit', '/department/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/department/add': RouteRecordInfo<'/department/add', '/department/add', Record<never, never>, Record<never, never>>,
    '/employee': RouteRecordInfo<'/employee', '/employee', Record<never, never>, Record<never, never>>,
    '/employee/': RouteRecordInfo<'/employee/', '/employee/', Record<never, never>, Record<never, never>>,
    '/employee/[id]/': RouteRecordInfo<'/employee/[id]/', '/employee/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-add': RouteRecordInfo<'/employee-add', '/employee-add', Record<never, never>, Record<never, never>>,
    '/employee-add/': RouteRecordInfo<'/employee-add/', '/employee-add/', Record<never, never>, Record<never, never>>,
    '/employee-attendance': RouteRecordInfo<'/employee-attendance', '/employee-attendance', Record<never, never>, Record<never, never>>,
    '/employee-attendance/': RouteRecordInfo<'/employee-attendance/', '/employee-attendance/', Record<never, never>, Record<never, never>>,
    '/employee-edit': RouteRecordInfo<'/employee-edit', '/employee-edit', Record<never, never>, Record<never, never>>,
    '/employee-edit/[id]/': RouteRecordInfo<'/employee-edit/[id]/', '/employee-edit/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-schedule': RouteRecordInfo<'/employee-schedule', '/employee-schedule', Record<never, never>, Record<never, never>>,
    '/employee-schedule/': RouteRecordInfo<'/employee-schedule/', '/employee-schedule/', Record<never, never>, Record<never, never>>,
    '/item': RouteRecordInfo<'/item', '/item', Record<never, never>, Record<never, never>>,
    '/item/': RouteRecordInfo<'/item/', '/item/', Record<never, never>, Record<never, never>>,
    '/item/[id]/': RouteRecordInfo<'/item/[id]/', '/item/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/item/[id]/edit': RouteRecordInfo<'/item/[id]/edit', '/item/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/item/add': RouteRecordInfo<'/item/add', '/item/add', Record<never, never>, Record<never, never>>,
    '/list-stock-movement': RouteRecordInfo<'/list-stock-movement', '/list-stock-movement', Record<never, never>, Record<never, never>>,
    '/list-stock-movement/': RouteRecordInfo<'/list-stock-movement/', '/list-stock-movement/', Record<never, never>, Record<never, never>>,
    '/nationality': RouteRecordInfo<'/nationality', '/nationality', Record<never, never>, Record<never, never>>,
    '/nationality/': RouteRecordInfo<'/nationality/', '/nationality/', Record<never, never>, Record<never, never>>,
    '/nationality/[id]/': RouteRecordInfo<'/nationality/[id]/', '/nationality/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/nationality/[id]/edit': RouteRecordInfo<'/nationality/[id]/edit', '/nationality/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/nationality/add': RouteRecordInfo<'/nationality/add', '/nationality/add', Record<never, never>, Record<never, never>>,
    '/position': RouteRecordInfo<'/position', '/position', Record<never, never>, Record<never, never>>,
    '/position/': RouteRecordInfo<'/position/', '/position/', Record<never, never>, Record<never, never>>,
    '/position/[id]/': RouteRecordInfo<'/position/[id]/', '/position/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/position/[id]/edit': RouteRecordInfo<'/position/[id]/edit', '/position/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/position/add': RouteRecordInfo<'/position/add', '/position/add', Record<never, never>, Record<never, never>>,
    '/room': RouteRecordInfo<'/room', '/room', Record<never, never>, Record<never, never>>,
    '/room/': RouteRecordInfo<'/room/', '/room/', Record<never, never>, Record<never, never>>,
    '/room/[id]/': RouteRecordInfo<'/room/[id]/', '/room/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/room/[id]/edit': RouteRecordInfo<'/room/[id]/edit', '/room/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/room/add': RouteRecordInfo<'/room/add', '/room/add', Record<never, never>, Record<never, never>>,
    '/service': RouteRecordInfo<'/service', '/service', Record<never, never>, Record<never, never>>,
    '/service/': RouteRecordInfo<'/service/', '/service/', Record<never, never>, Record<never, never>>,
    '/service/[id]/': RouteRecordInfo<'/service/[id]/', '/service/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service/[id]/edit': RouteRecordInfo<'/service/[id]/edit', '/service/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service/add': RouteRecordInfo<'/service/add', '/service/add', Record<never, never>, Record<never, never>>,
    '/settings': RouteRecordInfo<'/settings', '/settings', Record<never, never>, Record<never, never>>,
    '/settings/': RouteRecordInfo<'/settings/', '/settings/', Record<never, never>, Record<never, never>>,
    '/social-media': RouteRecordInfo<'/social-media', '/social-media', Record<never, never>, Record<never, never>>,
    '/social-media/': RouteRecordInfo<'/social-media/', '/social-media/', Record<never, never>, Record<never, never>>,
    '/social-media/[id]/': RouteRecordInfo<'/social-media/[id]/', '/social-media/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/social-media/[id]/edit': RouteRecordInfo<'/social-media/[id]/edit', '/social-media/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/social-media/add': RouteRecordInfo<'/social-media/add', '/social-media/add', Record<never, never>, Record<never, never>>,
    '/speciality': RouteRecordInfo<'/speciality', '/speciality', Record<never, never>, Record<never, never>>,
    '/speciality/': RouteRecordInfo<'/speciality/', '/speciality/', Record<never, never>, Record<never, never>>,
    '/speciality/[id]/': RouteRecordInfo<'/speciality/[id]/', '/speciality/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/speciality/[id]/edit': RouteRecordInfo<'/speciality/[id]/edit', '/speciality/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/speciality/add': RouteRecordInfo<'/speciality/add', '/speciality/add', Record<never, never>, Record<never, never>>,
    '/user': RouteRecordInfo<'/user', '/user', Record<never, never>, Record<never, never>>,
    '/user/': RouteRecordInfo<'/user/', '/user/', Record<never, never>, Record<never, never>>,
    '/user/[id]/': RouteRecordInfo<'/user/[id]/', '/user/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/user/[id]/edit': RouteRecordInfo<'/user/[id]/edit', '/user/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/user/add': RouteRecordInfo<'/user/add', '/user/add', Record<never, never>, Record<never, never>>,
    '/userStatus': RouteRecordInfo<'/userStatus', '/userStatus', Record<never, never>, Record<never, never>>,
    '/userStatus/': RouteRecordInfo<'/userStatus/', '/userStatus/', Record<never, never>, Record<never, never>>,
    '/userStatus/[id]/': RouteRecordInfo<'/userStatus/[id]/', '/userStatus/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/userStatus/[id]/edit': RouteRecordInfo<'/userStatus/[id]/edit', '/userStatus/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/userStatus/add': RouteRecordInfo<'/userStatus/add', '/userStatus/add', Record<never, never>, Record<never, never>>,
    '/withdraw-quantity': RouteRecordInfo<'/withdraw-quantity', '/withdraw-quantity', Record<never, never>, Record<never, never>>,
    '/withdraw-quantity/': RouteRecordInfo<'/withdraw-quantity/', '/withdraw-quantity/', Record<never, never>, Record<never, never>>,
  }
}

declare module 'vue-router/auto' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export type RouterTyped = _RouterTyped<RouteNamedMap>

  /**
   * Type safe version of `RouteLocationNormalized` (the type of `to` and `from` in navigation guards).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalized<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationNormalizedLoaded` (the return type of `useRoute()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalizedLoaded<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationResolved` (the returned route of `router.resolve()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationResolved<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationResolvedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocation` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocation<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationTypedList<RouteNamedMap>[Name]

  /**
   * Generate a type safe params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParams<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['params']
  /**
   * Generate a type safe raw params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParamsRaw<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['paramsRaw']

  export function useRouter(): RouterTyped
  export function useRoute<Name extends keyof RouteNamedMap = keyof RouteNamedMap>(name?: Name): RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  export const useLink: UseLinkFnTyped<RouteNamedMap>

  export function onBeforeRouteLeave(guard: NavigationGuard<RouteNamedMap>): void
  export function onBeforeRouteUpdate(guard: NavigationGuard<RouteNamedMap>): void

  // Experimental Data Fetching

  export function defineLoader<
    P extends Promise<any>,
    Name extends keyof RouteNamedMap = keyof RouteNamedMap,
    isLazy extends boolean = false,
  >(
    name: Name,
    loader: (route: RouteLocationNormalizedLoaded<Name>) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>
  export function defineLoader<
    P extends Promise<any>,
    isLazy extends boolean = false,
  >(
    loader: (route: RouteLocationNormalizedLoaded) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>

  export {
    _definePage as definePage,
    _HasDataLoaderMeta as HasDataLoaderMeta,
    _setupDataFetchingGuard as setupDataFetchingGuard,
    _stopDataFetchingScope as stopDataFetchingScope,
  } from 'unplugin-vue-router/runtime'
}

declare module 'vue-router' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export interface TypesConfig {
    beforeRouteUpdate: NavigationGuard<RouteNamedMap>
    beforeRouteLeave: NavigationGuard<RouteNamedMap>

    $route: RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[keyof RouteNamedMap]
    $router: _RouterTyped<RouteNamedMap>

    RouterLink: RouterLinkTyped<RouteNamedMap>
  }
}
