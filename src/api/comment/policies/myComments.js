"use strict";

/**
 * `myComments` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In myComments policy.");

  console.log("dfasjfnjsdnfnjasnf");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
