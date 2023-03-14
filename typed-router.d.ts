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
    '/account': RouteRecordInfo<'/account', '/account', Record<never, never>, Record<never, never>>,
    '/account/': RouteRecordInfo<'/account/', '/account/', Record<never, never>, Record<never, never>>,
    '/account/add': RouteRecordInfo<'/account/add', '/account/add', Record<never, never>, Record<never, never>>,
    '/account/add-cash-account': RouteRecordInfo<'/account/add-cash-account', '/account/add-cash-account', Record<never, never>, Record<never, never>>,
    '/add-custom-expense': RouteRecordInfo<'/add-custom-expense', '/add-custom-expense', Record<never, never>, Record<never, never>>,
    '/add-custom-expense/': RouteRecordInfo<'/add-custom-expense/', '/add-custom-expense/', Record<never, never>, Record<never, never>>,
    '/add-custom-revenue': RouteRecordInfo<'/add-custom-revenue', '/add-custom-revenue', Record<never, never>, Record<never, never>>,
    '/add-custom-revenue/': RouteRecordInfo<'/add-custom-revenue/', '/add-custom-revenue/', Record<never, never>, Record<never, never>>,
    '/add-quantity': RouteRecordInfo<'/add-quantity', '/add-quantity', Record<never, never>, Record<never, never>>,
    '/add-quantity/': RouteRecordInfo<'/add-quantity/', '/add-quantity/', Record<never, never>, Record<never, never>>,
    '/add-record': RouteRecordInfo<'/add-record', '/add-record', Record<never, never>, Record<never, never>>,
    '/add-record/': RouteRecordInfo<'/add-record/', '/add-record/', Record<never, never>, Record<never, never>>,
    '/attendance-justification': RouteRecordInfo<'/attendance-justification', '/attendance-justification', Record<never, never>, Record<never, never>>,
    '/attendance-justification/': RouteRecordInfo<'/attendance-justification/', '/attendance-justification/', Record<never, never>, Record<never, never>>,
    '/auth': RouteRecordInfo<'/auth', '/auth', Record<never, never>, Record<never, never>>,
    '/auth/login': RouteRecordInfo<'/auth/login', '/auth/login', Record<never, never>, Record<never, never>>,
    '/auth/signup': RouteRecordInfo<'/auth/signup', '/auth/signup', Record<never, never>, Record<never, never>>,
    '/balance-sheet-report': RouteRecordInfo<'/balance-sheet-report', '/balance-sheet-report', Record<never, never>, Record<never, never>>,
    '/balance-sheet-report/': RouteRecordInfo<'/balance-sheet-report/', '/balance-sheet-report/', Record<never, never>, Record<never, never>>,
    '/bulk-cash-out': RouteRecordInfo<'/bulk-cash-out', '/bulk-cash-out', Record<never, never>, Record<never, never>>,
    '/bulk-cash-out/': RouteRecordInfo<'/bulk-cash-out/', '/bulk-cash-out/', Record<never, never>, Record<never, never>>,
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
    '/contractor/cash-out/': RouteRecordInfo<'/contractor/cash-out/', '/contractor/cash-out/', Record<never, never>, Record<never, never>>,
    '/contractor/cash-out/add': RouteRecordInfo<'/contractor/cash-out/add', '/contractor/cash-out/add', Record<never, never>, Record<never, never>>,
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
    '/deliver-salaries': RouteRecordInfo<'/deliver-salaries', '/deliver-salaries', Record<never, never>, Record<never, never>>,
    '/deliver-salaries/': RouteRecordInfo<'/deliver-salaries/', '/deliver-salaries/', Record<never, never>, Record<never, never>>,
    '/department': RouteRecordInfo<'/department', '/department', Record<never, never>, Record<never, never>>,
    '/department/': RouteRecordInfo<'/department/', '/department/', Record<never, never>, Record<never, never>>,
    '/department/[id]/': RouteRecordInfo<'/department/[id]/', '/department/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/department/[id]/edit': RouteRecordInfo<'/department/[id]/edit', '/department/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/department/add': RouteRecordInfo<'/department/add', '/department/add', Record<never, never>, Record<never, never>>,
    '/employee': RouteRecordInfo<'/employee', '/employee', Record<never, never>, Record<never, never>>,
    '/employee/': RouteRecordInfo<'/employee/', '/employee/', Record<never, never>, Record<never, never>>,
    '/employee/[id]/': RouteRecordInfo<'/employee/[id]/', '/employee/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee/[id]/waiting-list': RouteRecordInfo<'/employee/[id]/waiting-list', '/employee/:id/waiting-list', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-add': RouteRecordInfo<'/employee-add', '/employee-add', Record<never, never>, Record<never, never>>,
    '/employee-add/': RouteRecordInfo<'/employee-add/', '/employee-add/', Record<never, never>, Record<never, never>>,
    '/employee-add/[id]/services': RouteRecordInfo<'/employee-add/[id]/services', '/employee-add/:id/services', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-attendance': RouteRecordInfo<'/employee-attendance', '/employee-attendance', Record<never, never>, Record<never, never>>,
    '/employee-attendance/': RouteRecordInfo<'/employee-attendance/', '/employee-attendance/', Record<never, never>, Record<never, never>>,
    '/employee-edit': RouteRecordInfo<'/employee-edit', '/employee-edit', Record<never, never>, Record<never, never>>,
    '/employee-edit/[id]/': RouteRecordInfo<'/employee-edit/[id]/', '/employee-edit/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-edit/[id]/services': RouteRecordInfo<'/employee-edit/[id]/services', '/employee-edit/:id/services', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-schedule': RouteRecordInfo<'/employee-schedule', '/employee-schedule', Record<never, never>, Record<never, never>>,
    '/employee-schedule/': RouteRecordInfo<'/employee-schedule/', '/employee-schedule/', Record<never, never>, Record<never, never>>,
    '/employee-variable-payment': RouteRecordInfo<'/employee-variable-payment', '/employee-variable-payment', Record<never, never>, Record<never, never>>,
    '/employee-variable-payment/': RouteRecordInfo<'/employee-variable-payment/', '/employee-variable-payment/', Record<never, never>, Record<never, never>>,
    '/employee-variable-payment/[id]/edit': RouteRecordInfo<'/employee-variable-payment/[id]/edit', '/employee-variable-payment/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/employee-variable-payment/add': RouteRecordInfo<'/employee-variable-payment/add', '/employee-variable-payment/add', Record<never, never>, Record<never, never>>,
    '/from-main-inventory': RouteRecordInfo<'/from-main-inventory', '/from-main-inventory', Record<never, never>, Record<never, never>>,
    '/from-main-inventory/': RouteRecordInfo<'/from-main-inventory/', '/from-main-inventory/', Record<never, never>, Record<never, never>>,
    '/generate-salaries': RouteRecordInfo<'/generate-salaries', '/generate-salaries', Record<never, never>, Record<never, never>>,
    '/generate-salaries/': RouteRecordInfo<'/generate-salaries/', '/generate-salaries/', Record<never, never>, Record<never, never>>,
    '/income-statment-report': RouteRecordInfo<'/income-statment-report', '/income-statment-report', Record<never, never>, Record<never, never>>,
    '/income-statment-report/': RouteRecordInfo<'/income-statment-report/', '/income-statment-report/', Record<never, never>, Record<never, never>>,
    '/inventory': RouteRecordInfo<'/inventory', '/inventory', Record<never, never>, Record<never, never>>,
    '/inventory/': RouteRecordInfo<'/inventory/', '/inventory/', Record<never, never>, Record<never, never>>,
    '/inventory/[id]/': RouteRecordInfo<'/inventory/[id]/', '/inventory/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/item': RouteRecordInfo<'/item', '/item', Record<never, never>, Record<never, never>>,
    '/item/': RouteRecordInfo<'/item/', '/item/', Record<never, never>, Record<never, never>>,
    '/item/[id]/': RouteRecordInfo<'/item/[id]/', '/item/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/item/[id]/edit': RouteRecordInfo<'/item/[id]/edit', '/item/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/item/add': RouteRecordInfo<'/item/add', '/item/add', Record<never, never>, Record<never, never>>,
    '/list-inventory-movement': RouteRecordInfo<'/list-inventory-movement', '/list-inventory-movement', Record<never, never>, Record<never, never>>,
    '/list-inventory-movement/': RouteRecordInfo<'/list-inventory-movement/', '/list-inventory-movement/', Record<never, never>, Record<never, never>>,
    '/nationality': RouteRecordInfo<'/nationality', '/nationality', Record<never, never>, Record<never, never>>,
    '/nationality/': RouteRecordInfo<'/nationality/', '/nationality/', Record<never, never>, Record<never, never>>,
    '/nationality/[id]/': RouteRecordInfo<'/nationality/[id]/', '/nationality/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/nationality/[id]/edit': RouteRecordInfo<'/nationality/[id]/edit', '/nationality/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/nationality/add': RouteRecordInfo<'/nationality/add', '/nationality/add', Record<never, never>, Record<never, never>>,
    '/onhold-salaries': RouteRecordInfo<'/onhold-salaries', '/onhold-salaries', Record<never, never>, Record<never, never>>,
    '/onhold-salaries/': RouteRecordInfo<'/onhold-salaries/', '/onhold-salaries/', Record<never, never>, Record<never, never>>,
    '/position': RouteRecordInfo<'/position', '/position', Record<never, never>, Record<never, never>>,
    '/position/': RouteRecordInfo<'/position/', '/position/', Record<never, never>, Record<never, never>>,
    '/position/[id]/': RouteRecordInfo<'/position/[id]/', '/position/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/position/[id]/edit': RouteRecordInfo<'/position/[id]/edit', '/position/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/position/add': RouteRecordInfo<'/position/add', '/position/add', Record<never, never>, Record<never, never>>,
    '/reminder': RouteRecordInfo<'/reminder', '/reminder', Record<never, never>, Record<never, never>>,
    '/reminder/': RouteRecordInfo<'/reminder/', '/reminder/', Record<never, never>, Record<never, never>>,
    '/reminder/add': RouteRecordInfo<'/reminder/add', '/reminder/add', Record<never, never>, Record<never, never>>,
    '/requested-services': RouteRecordInfo<'/requested-services', '/requested-services', Record<never, never>, Record<never, never>>,
    '/requested-services/': RouteRecordInfo<'/requested-services/', '/requested-services/', Record<never, never>, Record<never, never>>,
    '/room': RouteRecordInfo<'/room', '/room', Record<never, never>, Record<never, never>>,
    '/room/': RouteRecordInfo<'/room/', '/room/', Record<never, never>, Record<never, never>>,
    '/room/[id]/': RouteRecordInfo<'/room/[id]/', '/room/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/room/[id]/edit': RouteRecordInfo<'/room/[id]/edit', '/room/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/room/add': RouteRecordInfo<'/room/add', '/room/add', Record<never, never>, Record<never, never>>,
    '/salary': RouteRecordInfo<'/salary', '/salary', Record<never, never>, Record<never, never>>,
    '/salary/': RouteRecordInfo<'/salary/', '/salary/', Record<never, never>, Record<never, never>>,
    '/salary/[id]/': RouteRecordInfo<'/salary/[id]/', '/salary/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service': RouteRecordInfo<'/service', '/service', Record<never, never>, Record<never, never>>,
    '/service/': RouteRecordInfo<'/service/', '/service/', Record<never, never>, Record<never, never>>,
    '/service/[id]/': RouteRecordInfo<'/service/[id]/', '/service/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service/[id]/edit': RouteRecordInfo<'/service/[id]/edit', '/service/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service/add': RouteRecordInfo<'/service/add', '/service/add', Record<never, never>, Record<never, never>>,
    '/service-history-screen': RouteRecordInfo<'/service-history-screen', '/service-history-screen', Record<never, never>, Record<never, never>>,
    '/service-history-screen/': RouteRecordInfo<'/service-history-screen/', '/service-history-screen/', Record<never, never>, Record<never, never>>,
    '/service-history-screen/[id]/': RouteRecordInfo<'/service-history-screen/[id]/', '/service-history-screen/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service-history-screen/[id]/edit': RouteRecordInfo<'/service-history-screen/[id]/edit', '/service-history-screen/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/service-history-screen/add': RouteRecordInfo<'/service-history-screen/add', '/service-history-screen/add', Record<never, never>, Record<never, never>>,
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
    '/supplier': RouteRecordInfo<'/supplier', '/supplier', Record<never, never>, Record<never, never>>,
    '/supplier/': RouteRecordInfo<'/supplier/', '/supplier/', Record<never, never>, Record<never, never>>,
    '/supplier/[id]/': RouteRecordInfo<'/supplier/[id]/', '/supplier/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/supplier/[id]/edit': RouteRecordInfo<'/supplier/[id]/edit', '/supplier/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/supplier/add': RouteRecordInfo<'/supplier/add', '/supplier/add', Record<never, never>, Record<never, never>>,
    '/supplier-cash-receipt': RouteRecordInfo<'/supplier-cash-receipt', '/supplier-cash-receipt', Record<never, never>, Record<never, never>>,
    '/ticket': RouteRecordInfo<'/ticket', '/ticket', Record<never, never>, Record<never, never>>,
    '/ticket/': RouteRecordInfo<'/ticket/', '/ticket/', Record<never, never>, Record<never, never>>,
    '/ticket/[id]/': RouteRecordInfo<'/ticket/[id]/', '/ticket/:id/', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/ticket/[id]/edit': RouteRecordInfo<'/ticket/[id]/edit', '/ticket/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/ticket/add': RouteRecordInfo<'/ticket/add', '/ticket/add', Record<never, never>, Record<never, never>>,
    '/to-main-inventory': RouteRecordInfo<'/to-main-inventory', '/to-main-inventory', Record<never, never>, Record<never, never>>,
    '/to-main-inventory/': RouteRecordInfo<'/to-main-inventory/', '/to-main-inventory/', Record<never, never>, Record<never, never>>,
    '/transaction': RouteRecordInfo<'/transaction', '/transaction', Record<never, never>, Record<never, never>>,
    '/transaction/': RouteRecordInfo<'/transaction/', '/transaction/', Record<never, never>, Record<never, never>>,
    '/transaction/customer-cash-receipt/': RouteRecordInfo<'/transaction/customer-cash-receipt/', '/transaction/customer-cash-receipt/', Record<never, never>, Record<never, never>>,
    '/transaction/customer-cash-receipt/add': RouteRecordInfo<'/transaction/customer-cash-receipt/add', '/transaction/customer-cash-receipt/add', Record<never, never>, Record<never, never>>,
    '/transaction/supplier-employee-cash-receipt/': RouteRecordInfo<'/transaction/supplier-employee-cash-receipt/', '/transaction/supplier-employee-cash-receipt/', Record<never, never>, Record<never, never>>,
    '/transaction/supplier-employee-cash-receipt/add': RouteRecordInfo<'/transaction/supplier-employee-cash-receipt/add', '/transaction/supplier-employee-cash-receipt/add', Record<never, never>, Record<never, never>>,
    '/transfer-cash-money': RouteRecordInfo<'/transfer-cash-money', '/transfer-cash-money', Record<never, never>, Record<never, never>>,
    '/transfer-cash-money/': RouteRecordInfo<'/transfer-cash-money/', '/transfer-cash-money/', Record<never, never>, Record<never, never>>,
    '/trial-balance-report': RouteRecordInfo<'/trial-balance-report', '/trial-balance-report', Record<never, never>, Record<never, never>>,
    '/trial-balance-report/': RouteRecordInfo<'/trial-balance-report/', '/trial-balance-report/', Record<never, never>, Record<never, never>>,
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
    '/variable-payment': RouteRecordInfo<'/variable-payment', '/variable-payment', Record<never, never>, Record<never, never>>,
    '/variable-payment/': RouteRecordInfo<'/variable-payment/', '/variable-payment/', Record<never, never>, Record<never, never>>,
    '/variable-payment/[id]/edit': RouteRecordInfo<'/variable-payment/[id]/edit', '/variable-payment/:id/edit', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/variable-payment/add': RouteRecordInfo<'/variable-payment/add', '/variable-payment/add', Record<never, never>, Record<never, never>>,
    '/waiting-list': RouteRecordInfo<'/waiting-list', '/waiting-list', Record<never, never>, Record<never, never>>,
    '/waiting-list/': RouteRecordInfo<'/waiting-list/', '/waiting-list/', Record<never, never>, Record<never, never>>,
    '/waiting-lists': RouteRecordInfo<'/waiting-lists', '/waiting-lists', Record<never, never>, Record<never, never>>,
    '/waiting-lists/': RouteRecordInfo<'/waiting-lists/', '/waiting-lists/', Record<never, never>, Record<never, never>>,
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
