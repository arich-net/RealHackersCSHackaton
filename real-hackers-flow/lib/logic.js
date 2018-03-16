'use strict';
/**
 * Sample transaction processor function.
 * @param {org.acme.real.Validation} tx The sample transaction instance.
 * @transaction
 */

function execValidation(validation) {
    // Save the old value of the asset.
    var oldValue = validation.application;
    // Update the asset with the new value.
    //tx.asset.value = validation.newValue;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.real.Application')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(validation);

        })
        .then(function () {

            // Emit an event for the modified asset.
            //var event = getFactory().newEvent('org.acme.real', 'ApplicationSend');
            //event.asset = tx.asset;
            //event.oldValue = oldValue;
            //event.newValue = tx.newValue;
            //emit(event);

        });

}
