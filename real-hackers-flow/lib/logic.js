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
    //console.log("Arich DebugLog: " + application.applicationStatus);
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
            if (application.applicationStatus == 3) {
                var event = getFactory().newEvent('org.real.hackers', 'SignaturesCompletedEvent');
                console.log("Arich Log Signatures Completed Emit Event");
                emit(event);
            }
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
 * @param {org.real.hackers.MortageAssignement} tx The sample transaction instance.
 * @transaction
 */
function execMortageAssignement(mortagetx) {
    // Execute Mortgage when application have been validated
    var factory = getFactory();

    var application = mortagetx.application;
    var bank = mortagetx.bank;
    var user = mortagetx.user;

    console.log("Application Data:" + application.applicationStatus);
    console.log("Bank Data:" + bank.name);
    console.log("User Data:" + user.email);

    if (application.applicationStatus == 3) {
        var mortage = factory.newResource('org.real.hackers', 'MortgageContract', application.appId + bank.bankId);
        mortage.duration = application.duration;
        mortage.fundingAmount = application.fundingRequest;
        mortage.paymentSchedule = mortagetx.paymentSchedule;
        mortage.application = application;
        mortage.bank = bank;

        // Change application status to 5
        application.applicationStatus = 5;
        getAssetRegistry('org.real.hackers.Application')
            .then(function (assetRegistry) {
                // Update the asset in the asset registry.
                assetRegistry.update(application);
        });

        return getAssetRegistry('org.real.hackers.MortgageContract')
            .then(function (assetRegistry) {
                // Update the asset in the asset registry.
                return assetRegistry.add(mortage);
                //return true;
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

    console.log("Arich Log Creating Signatures OK");

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