import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Producto {

  private API_SERVER = "http://localhost:8080/api/v1/products";

  constructor(
    private httpClient: HttpClient
  ){}
  
  public getAllProductos(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public saveProducto(product:any): Observable<any>{
    return this.httpClient.post(this.API_SERVER,product);
  }

  public deleteProducto(id: number):Observable<any>{
    return this.httpClient.delete(this.API_SERVER+"/"+id);
  }

  public editarProducto(product:any):Observable<any>{
    return this.httpClient.put(this.API_SERVER+"/"+product.id,product);
  }


}
