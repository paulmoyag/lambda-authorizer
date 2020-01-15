const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require("node-fetch");
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-2';

const cognitoIdentity = new AWS.CognitoIdentity();
module.exports.handler = async () => {
  const authenticationData = {
    Username: 'ReingeCotizadoresUser',
    Password: 'T7YFsc^G:;YLa}ak',
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const poolData = {
    UserPoolId: 'us-east-2_UvhEsWOPJ',
    // ClientId: '4mnd9o9dfu62qgoj74fg26u08i',
	ClientId: '7it0nrh1ibhaejupap7u5q7euu',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username: 'ReingeCotizadoresUser',
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const accessToken = result.getAccessToken().getJwtToken();
      // console.log(accessToken);
      /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
      const idToken = result.idToken.jwtToken;
      console.log('idToken', idToken);
      // us-east-2:c6291b40-d3b0-4760-a1d2-4a544645ee3a
       const idParams = {
        IdentityPoolId: "us-east-2:8c366778-47b6-447c-a0e1-2951120c5134",
        Logins: {
           'cognito-idp.us-east-2.amazonaws.com/us-east-2_UvhEsWOPJ': idToken
         }
       };
	  // const idParams = {
      //  IdentityPoolId: "us-east-2:c6291b40-d3b0-4760-a1d2-4a544645ee3a",
      // Logins: {
      //    'cognito-idp.us-east-2.amazonaws.com/us-east-2_UvhEsWOPJ': idToken
      //  }
      // };
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


this.handler();
