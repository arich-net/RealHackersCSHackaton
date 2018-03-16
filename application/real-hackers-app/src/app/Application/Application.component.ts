import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApplicationService } from './Application.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Application',
	templateUrl: './Application.component.html',
	styleUrls: ['./Application.component.css'],
  providers: [ApplicationService]
})
export class ApplicationComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          appId = new FormControl("", Validators.required);
        
  
      
          customer = new FormControl("", Validators.required);
        
  
      
          creditHistory = new FormControl("", Validators.required);
        
  
      
          propertyName = new FormControl("", Validators.required);
        
  
      
          fundingRequest = new FormControl("", Validators.required);
        
  
      
          duration = new FormControl("", Validators.required);
        
  
      
          signatures = new FormControl("", Validators.required);
        
  
      
          applicationStatus = new FormControl("", Validators.required);
        
  


  constructor(private serviceApplication:ApplicationService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          appId:this.appId,
        
    
        
          customer:this.customer,
        
    
        
          creditHistory:this.creditHistory,
        
    
        
          propertyName:this.propertyName,
        
    
        
          fundingRequest:this.fundingRequest,
        
    
        
          duration:this.duration,
        
    
        
          signatures:this.signatures,
        
    
        
          applicationStatus:this.applicationStatus
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceApplication.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.real.hackers.Application",
      
        
          "appId":this.appId.value,
        
      
        
          "customer":this.customer.value,
        
      
        
          "creditHistory":this.creditHistory.value,
        
      
        
          "propertyName":this.propertyName.value,
        
      
        
          "fundingRequest":this.fundingRequest.value,
        
      
        
          "duration":this.duration.value,
        
      
        
          "signatures":this.signatures.value,
        
      
        
          "applicationStatus":this.applicationStatus.value
        
      
    };

    this.myForm.setValue({
      
        
          "appId":null,
        
      
        
          "customer":null,
        
      
        
          "creditHistory":null,
        
      
        
          "propertyName":null,
        
      
        
          "fundingRequest":null,
        
      
        
          "duration":null,
        
      
        
          "signatures":null,
        
      
        
          "applicationStatus":null
        
      
    });

    return this.serviceApplication.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "appId":null,
        
      
        
          "customer":null,
        
      
        
          "creditHistory":null,
        
      
        
          "propertyName":null,
        
      
        
          "fundingRequest":null,
        
      
        
          "duration":null,
        
      
        
          "signatures":null,
        
      
        
          "applicationStatus":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.real.hackers.Application",
      
        
          
        
    
        
          
            "customer":this.customer.value,
          
        
    
        
          
            "creditHistory":this.creditHistory.value,
          
        
    
        
          
            "propertyName":this.propertyName.value,
          
        
    
        
          
            "fundingRequest":this.fundingRequest.value,
          
        
    
        
          
            "duration":this.duration.value,
          
        
    
        
          
            "signatures":this.signatures.value,
          
        
    
        
          
            "applicationStatus":this.applicationStatus.value
          
        
    
    };

    return this.serviceApplication.updateAsset(form.get("appId").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceApplication.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceApplication.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "appId":null,
          
        
          
            "customer":null,
          
        
          
            "creditHistory":null,
          
        
          
            "propertyName":null,
          
        
          
            "fundingRequest":null,
          
        
          
            "duration":null,
          
        
          
            "signatures":null,
          
        
          
            "applicationStatus":null 
          
        
      };



      
        if(result.appId){
          
            formObject.appId = result.appId;
          
        }else{
          formObject.appId = null;
        }
      
        if(result.customer){
          
            formObject.customer = result.customer;
          
        }else{
          formObject.customer = null;
        }
      
        if(result.creditHistory){
          
            formObject.creditHistory = result.creditHistory;
          
        }else{
          formObject.creditHistory = null;
        }
      
        if(result.propertyName){
          
            formObject.propertyName = result.propertyName;
          
        }else{
          formObject.propertyName = null;
        }
      
        if(result.fundingRequest){
          
            formObject.fundingRequest = result.fundingRequest;
          
        }else{
          formObject.fundingRequest = null;
        }
      
        if(result.duration){
          
            formObject.duration = result.duration;
          
        }else{
          formObject.duration = null;
        }
      
        if(result.signatures){
          
            formObject.signatures = result.signatures;
          
        }else{
          formObject.signatures = null;
        }
      
        if(result.applicationStatus){
          
            formObject.applicationStatus = result.applicationStatus;
          
        }else{
          formObject.applicationStatus = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "appId":null,
        
      
        
          "customer":null,
        
      
        
          "creditHistory":null,
        
      
        
          "propertyName":null,
        
      
        
          "fundingRequest":null,
        
      
        
          "duration":null,
        
      
        
          "signatures":null,
        
      
        
          "applicationStatus":null 
        
      
      });
  }

}
