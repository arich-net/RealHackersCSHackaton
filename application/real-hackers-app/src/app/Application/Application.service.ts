import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Application } from '../org.real.hackers';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class ApplicationService {

	
		private NAMESPACE: string = 'Application';
	



    constructor(private dataService: DataService<Application>) {
    };

    public getAll(): Observable<Application[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Application> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Application> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Application> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Application> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
