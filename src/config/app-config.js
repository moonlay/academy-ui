// var appConfig = require("./default");
export default {
  auth: {
    endpoint: "auth",
    configureEndpoints: ["auth", "core"],

    loginUrl: "/Accounts/login",
    profileUrl: "/me",
    
    authHeader: "Authorization",
    authTokenType: "",
    accessTokenProp: "id",

    storageChangedReload: true
  },
  endpoints: {
    // auth: "https://academy-auth-webapi-pinkgorilla.c9users.io/v1/",
    // auth: "https://dl-auth-api-dev.mybluemix.net/v1/",
    // auth: "https://academy-webapi-dev.herokuapp.com/api/",

    // core: "https://academy-webapi-dev.herokuapp.com/api/"
    auth: "http://localhost:3000/api/",
    core: "http://localhost:3000/api/"
  }
};
