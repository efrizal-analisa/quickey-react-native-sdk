import { NativeModules } from 'react-native';
const { QuickeySdk } = NativeModules;
import { AccessToken, LoginManager } from 'react-native-fbsdk';
const { Base } = require('../../base')
const axios = require('axios')

class Auth extends Base {
    constructor ({apiKey}) {
        super(apiKey);
            this.apiKey = apiKey
        }
        
        async getAccessToken ({email, phone, provider, otpCode }) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `${this.baseUrl}/loginCustomer`,
                    headers: {
                        authorization: this.apiKey
                    },
                    data: { email, phone, provider, otpCode }
                });
                return response.data    
            } catch (error) {
                if (error.response) {
                    return error.response.data
                } else {
                    return error                    
                }
            }
        }
        
        async authorizeUrlLogin ({url}) {
            try {
                QuickeySdk.showUrl(url, (res, err) => {
                    if (err) {
                        throw err
                    } else {
                        return res                
                    }
                })
            } catch (error) {
                if (error.response) {
                    return error.response.data
                } else {
                    return error                    
                }
            }
        }
        
        async authorizeFbToken () {
            try {
                LoginManager.logInWithPermissions(["public_profile"]).then(
                  function(result) {
                    if (result.isCancelled) {
                        return "Login cancelled"
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            return data.accessToken.toString()
                        }
                      )
                    }
                  },
                  function(error) {
                    console.log("Login fail with error: " + error);
                  }
                );
            } catch (error) {
                if (error.response) {
                    return error.response.data
                } else {
                    return error                    
                }
            }
        }
        
        async linkPhoneToEmail ({phone, token}) {
            try {
                const response = await axios({
                    method: 'post',
                    url: `${this.baseUrl}/otp/linkToEmail`,
                    headers: {
                        authorization: this.apiKey
                    },
                    data: { phone, token }
                });
                return response.data    
            } catch (error) {
                if (error.response) {
                    return error.response.data
                } else {
                    return error                    
                }
            }
        }
}


module.exports = { Auth }
