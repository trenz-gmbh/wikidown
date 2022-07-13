// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import {createVuetify} from 'vuetify'

import {de, en} from 'vuetify/locale'

export default createVuetify({
    locale: {
        defaultLocale: 'de',
        fallbackLocale: 'en',
        messages: {en, de},
    },
    defaults: {
        global: {
            ripple: false,
        },
    }
})
