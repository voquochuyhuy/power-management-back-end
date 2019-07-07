/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  // 'GET /':                   { action: 'view-homepage-or-redirect' },
  // 'GET /welcome':            { action: 'dashboard/view-welcome' },

  // 'GET /signup':             { action: 'entrance/view-signup' },
  // 'GET /email/confirm':      { action: 'entrance/confirm-email' },
  // 'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },

  // 'GET /login':              { action: 'entrance/view-login' },
  // 'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  // 'GET /password/new':       { action: 'entrance/view-new-password' },

  // 'GET /account':            { action: 'account/view-account-overview' },
  // 'GET /account/password':   { action: 'account/view-edit-password' },
  // 'GET /account/profile':    { action: 'account/view-edit-profile' },




  // 'GET /board/view':         { action: 'board/view-board'},
  // 'GET /board/add':          { action: 'board/view-new-board'},
  // 'GET /board/delete':       { action: 'board/view-delete-board'},

  'GET /ping':              { action: 'ping' },

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  // 'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  // 'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },

  // ADMIN Role API
  'POST    /api/v1/board/':                         { action: 'board/admin/add-board' },
  'DELETE  /api/v1/board/:id':                      { action: 'board/admin/delete-board' },
  'GET     /api/v1/user/':                          { action: 'board/admin/get-all-users'},
  'GET     /api/v1/user/:id':                       { action: 'get-user'},

  // Board
  'GET     /api/v1/board/':                         { action: 'board/get-all-boards' },
  'GET     /api/v1/board/:id':                      { action: 'board/get-board' },
  'PUT     /api/v1/board/assign':                   { action: 'board/assign-board' },
  'PUT     /api/v1/board/unassign':                 { action: 'board/unassign-board' },
  'GET     /api/v1/get-additional-info':            { action: 'board/get-additional-info' },

  'PATCH   /api/v1/board/:id/toggle-all':           { action: 'board/toggle-power-all' },
  'PATCH   /api/v1/board/:id/toggle/:pinNumber':    { action: 'board/toggle-power-pin' },
  'GET     /api/v1/board/:id/pins':                 { action: 'board/view-pins' },  //chua xong
  'PATCH   /api/v1/board/:id':                      { action: 'board/update-board' },
  'POST    /api/v1/pin':                            { action: 'pin/new-pin' },
  'DELETE  /api/v1/pin/:id':                        { action: 'pin/delete-pin' },
  'PATCH   /api/v1/pin/:id/toggle':                 { action: 'pin/toggle-power' },



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  // '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',

};
