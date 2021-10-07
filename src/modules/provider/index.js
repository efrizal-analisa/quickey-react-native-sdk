const { Base } = require('../../base')
const axios = require('axios')

class Provider extends Base {
    constructor ({apiKey}) {
        super(apiKey);
            this.apiKey = apiKey
            this.mobilePlatform = true
        }

        async getData ({appId, type, provider}) {
            try {
                if (type === 'socialLogin') {
                    const response = await axios.get(`${this.baseUrl}/socialData/${appId}/${provider}`)
                    return response.data 
                } else if (type === 'otpLogin') {
                    const response = await axios.get(`${this.baseUrl}/otpData/${appId}/${provider}`)
                    return response.data
                } else {
                    throw { status:400, message:'Invalid Type Input' }
                }
            } catch (error) {
                return error
            }
        }
        
        async getURlLogin ({provider, fbToken, role, fbID, fbEmail}) {
            if (provider === 'facebookLogin') {
                try {
                    const response = await axios({
                        method: 'post',
                        url: `${this.baseUrl}/social/getUrlLogin`,
                        headers: {
                            authorization: this.apiKey
                        },
                        data: { provider, mobilePlatform:this.mobilePlatform, role, fbID, fbEmail, fbToken }
                    });
                    return response.data    
                } catch (error) {
                    return error.response.data
                }        
            } else {
                try {
                    const response = await axios({
                        method: 'post',
                        url: `${this.baseUrl}/social/getUrlLogin`,
                        headers: {
                            authorization: this.apiKey
                        },
                            data: { provider,  mobilePlatform:this.mobilePlatform, type }
                        });
                    return response.data    
                } catch (error) {
                    return error.response.data
                }            
            }
        }
        
        async sendOTP ({phone, provider}) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `${this.baseUrl}/otp/sendToUserPhone`,
                    headers: {
                        authorization: this.apiKey
                    },
                    data: { phone, provider }
                });
                return response.data    
            } catch (error) {
                return error.response.data
            }
    }
}



module.exports = { Provider }