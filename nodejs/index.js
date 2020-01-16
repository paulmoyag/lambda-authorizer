const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const cognitoIdentity = new AWS.CognitoIdentity();
const config = require('config-yml');

global.fetch = require("node-fetch");
AWS.config.region = 'us-east-2';

module.exports.handler = async () => {
  /*
  console.log(config.desa.username);
  console.log(config.desa.password);
  console.log(config.desa.userPoolId);
  console.log(config.desa.clientId);
  console.log(config.desa.identityPoolId);
  */
  const authenticationData = {
    Username: config.desa.username,
    Password: config.desa.password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const poolData = {
    UserPoolId: config.desa.userPoolId,
    ClientId: config.desa.clientId,
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username: config.desa.username,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accessToken = result.getAccessToken().getJwtToken();
      /**
       * Use the idToken for Logins Map when Federating User Pools 
       * with identity pools or when passing through an Authorization Header to an API Gateway Authorizer 
       */
      const idToken = result.idToken.jwtToken;
      console.log('idToken', idToken);
      
       const idParams = {
        IdentityPoolId: config.desa.identityPoolId,
        Logins: {
           'cognito-idp.us-east-2.amazonaws.com/us-east-2_UvhEsWOPJ': idToken
         }
       };
	  
      cognitoIdentity.getId(idParams, function (err, identity) {
        if (err) console.log(err, err.stack); // an error occurred
        // else console.log(identity);
        const credentialsParams = {
          IdentityId: identity.IdentityId,
          Logins: {
            'cognito-idp.us-east-2.amazonaws.com/us-east-2_UvhEsWOPJ': idToken
          }
        };
        cognitoIdentity.getCredentialsForIdentity(credentialsParams, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          console.log(data);           // successful response
        });
      })
    },

    onFailure: function (err) {
      console.error(err);
    },

  });
};

//this.handler();