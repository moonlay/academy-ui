// we want font-awesome to load as soon as possible to show the fa-spinner
import '../styles/styles.css';
import 'bootstrap';

import appConfig from "./config/app-config";
import { DOM } from 'aurelia-pal';


// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });
export async function configure(aurelia) {
  aurelia.use
    .feature('au-components')
    .standardConfiguration()
    .plugin("aurelia-api", config => {

      var auth = appConfig.endpoints.auth; 
      var core = appConfig.endpoints.core;

      config.registerEndpoint('auth', auth);
      config.registerEndpoint('core', core);
    })
    .plugin("aurelia-authentication", baseConfig => {
      baseConfig.configure(appConfig.auth);
    })
    .plugin('aurelia-dialog', config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = true;
      config.settings.startingZIndex = 5;
      config.settings.position = function (modalContainer, overlay) {
        const child = modalContainer.children[0];
        const vh = Math.max(DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

        child.style.marginTop = "50px";//Math.max((vh - child.offsetHeight) / 2, 40) + 'px';
        child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
      }
      config.settings.enableEscClose = true;
    })
    .developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker), 
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
