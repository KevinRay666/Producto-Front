import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Producto } from './services/products/producto';


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
  producto: any[] = [];
  banderaError: boolean = false;
  errorMessage: String = '';

  constructor(
    public fb: FormBuilder,
    public productoService: Producto
  ) {

  }
  ngOnInit(): void {
    this.productoForm = this.fb.group({
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
    })

    this.mostrarTabla();

  }

  mostrarTabla(): void {
    this.productoService.getAllProductos().subscribe(resp => {
      this.producto = resp.data;
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
      this.producto.push(resp.data);
    },
      error => {
        console.error(error)
        this.errorMessage = error.error.data.message
        this.banderaError = true;
      }

    )

  }

}
