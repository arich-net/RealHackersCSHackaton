import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.real.hackers{
   export class Application extends Asset {
      appId: string;
      customer: Customer;
      creditHistory: string;
      propertyName: string;
      fundingRequest: number;
      duration: number;
      signatures: Signature[];
      applicationStatus: number;
   }
   export class Customer extends Participant {
      customerId: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
   }
   export class Registrar extends Participant {
      registrarId: string;
      registrarName: string;
   }
   export class Bank extends Participant {
      bankId: string;
      name: string;
   }
   export class Signature {
      theDate: Date;
      name: string;
      handwriting: string;
   }
   export class Validation extends Transaction {
      application: Application;
      signature: Signature;
   }
// }
