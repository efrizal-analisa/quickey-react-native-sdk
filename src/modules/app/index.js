const { Base } = require('../../base')
const axios = require('axios')

class App extends Base {
    constructor ({apiKey}) {
        super(apiKey);
            this.apiKey = apiKey
        }

        async getMetaData () {
            try {
                const response = await axios.post(`${this.baseUrl}/auth/apiKey`, {apiKey: this.apiKey})
                const appData = {
                    appId: response.data.app._id,
                    userEmail: response.data.app.email,
                    appName: response.data.app.appName,
                    redirectUri: response.data.app.redirectUri,
                    redirectUrlApp: response.data.app.redirectUrlApp
                };
                return appData        
            } catch (error) {
                if (error.response) {
                    return error.response.data
                } else {
                    return error                    
                }
            }
    }
}


module.exports = { App }
