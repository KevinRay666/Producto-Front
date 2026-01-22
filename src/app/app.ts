import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Producto } from './services/products/producto';
import { tick } from '@angular/core/testing';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  productoForm !: FormGroup;
  productos: any[] = [];
  banderaError: boolean = false;
  errorMessage: String = '';

  constructor(
    public fb: FormBuilder,
    public productoService: Producto
  ) { }
  ngOnInit(): void {
    this.productoForm = this.fb.group({
      id:[''],
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
    })

    this.mostrarTabla();
  }

  mostrarTabla(): void {
    this.productoService.getAllProductos().subscribe(resp => {
      this.productos = resp.data;
      console.log(resp.data);
    },
      error => {
        console.error(error)
      }
    )
  }

  guardar(): void {
    this.productoService.saveProducto(this.productoForm.value).subscribe(resp => {
      this.banderaError = false;
      this.productoForm.reset();
      this.productos.push(resp.data);
    },
      error => {
        console.error(error)
        this.errorMessage = error.error.data.message
        this.banderaError = true;
      }
    )
  }

  eliminar(producto: any) {
    this.productoService.deleteProducto(producto.id).subscribe(resp => {
      console.log(resp)
      if (resp.data === false) {
        this.productos.pop();
      }
    })
  }

  seleccionar(product: any) {
    this.productoForm.setValue({
      id: product.id,
      sku: product.sku,
      nombre: product.nombre,
      precio:product.precio,
      cantidad: product.cantidad
    })
  }

  actualizar() {
    console.log(this.productoForm.value)
    this.productoService.editarProducto(this.productoForm.value).subscribe(resp => {
      console.log(resp)
      this.productoForm.reset();
      this.mostrarTabla();
    })
  }

}
