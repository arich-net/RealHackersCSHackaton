'use strict';
/**
 * Sample transaction processor function.
 * @param {org.real.hackers.Validation} tx The sample transaction instance.
 * @transaction
 */
function execValidation(validation) {
    // Save the old value of the asset.
    var application = validation.application;
    application.signatures.push(validation.signature);
    if (application.signatures.length >= 3) {
        application.applicationStatus = 3;
    }
    // Update the asset with the new value.

    // Get the asset registry for the asset.
    return getAssetRegistry('org.real.hackers.Application')
        .then(function (assetRegistry) {

            // Update the asset in the asset registry.
            return assetRegistry.update(validation.application);

        })
        .then(function () {

            // Emit an event for the modified asset.
            //var event = getFactory().newEvent('org.real.hackers', 'ApplicationSend');
            //event.asset = tx.asset;
            //event.oldValue = oldValue;
            //event.newValue = tx.newValue;
            //emit(event);

        });

}

/**
 * Sample transaction processor function.
 * @param {org.real.hackers.SignaturesCompletedTransaction} signaturesCompleted Check signatures.
 * @transaction
 */
function signaturesCompletedTransaction(signaturesCompleted) {
    var factory = getFactory();

    var application = signaturesCompleted.application;
    var signaturesokevent = factory.newEvent('org.real.hackers', 'SignaturesCompleted'); 

    if(application.applicationStatus == 3){
        emit(signaturesokevent);
    }
}

/**
 * Sample transaction processor function.
 * @param {org.real.hackers.SubscribeSignaturesCompletedEvent} event listener.
 * @transaction
 */
function subscribeSignaturesCompletedEvent(event) {
    // event: { "$class": "org.namespace.BasicEvent", "eventId": "0000-0000-0000-000000#0" }
    console.log(event);
}