import type { Directive, DirectiveHook } from 'vue'
import { checkPermission } from '../composable/checkPermission'

const onUpdate: DirectiveHook = (el: HTMLElement, bindings) => {
    const value = bindings.value
    if (value) {
        if (!checkPermission(value)) {
            el.style.display = 'none'
        }
    }
}
const onMounted: DirectiveHook = (el: HTMLElement, bindings) => {
    const value = bindings.value
    if (value) {
        if (!checkPermission(value)) {
            el.style.display = 'none'
        }
    }
}

export const vPermission: Directive = {
    getSSRProps() {
        return {}
    },
    mounted: onMounted,
    updated: onUpdate
}