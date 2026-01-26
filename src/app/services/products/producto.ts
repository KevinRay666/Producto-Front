import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_API } from '@env/environments';

@Injectable({
  providedIn: 'root',
})
export class Producto {

  private API_SERVER = URL_API.URL_API;

  constructor(
    private httpClient: HttpClient
  ) { }



  public getAllProductos(): Observable<any> {

    const token = localStorage.getItem("authToken");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(this.API_SERVER, { headers });
  }

  public saveProducto(product: any): Observable<any> {
    const token = localStorage.getItem("authToken");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post(this.API_SERVER, product, { headers });
  }

  public deleteProducto(id: number): Observable<any> {
    const token = localStorage.getItem("authToken");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.delete(this.API_SERVER + "/" + id, { headers });
  }

  public editarProducto(product: any): Observable<any> {
    const token = localStorage.getItem("authToken");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.put(this.API_SERVER + "/" + product.id, product, { headers });
  }

  public selectProductoId(id: number): Observable<any> {
    const token = localStorage.getItem("authToken");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.get(this.API_SERVER + "/" + id, { headers });

  }
}
