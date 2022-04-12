const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant('customer').readOwn('profile').updateOwn('profile')

  ac.grant('vendor').extend('customer').readAny('profile')

  ac.grant('admin').extend('customer').extend('vendor').updateAny('profile').deleteAny("profile");
  
})();
