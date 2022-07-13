import {Store} from 'vuex'
import {State} from "@/store/State";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}
