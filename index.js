const { App } = require('./src/modules/app/index.js')
const { Provider } = require('./src//modules/provider/index.js')
const { Auth } = require('./src/modules/auth/index.js')

class QuickeySDK {
    constructor (apiKey) {
        this.app = new App({apiKey})
        this.auth = new Auth({apiKey})
        this.provider = new Provider({apiKey})             
    }
} 

module.exports = { QuickeySDK }