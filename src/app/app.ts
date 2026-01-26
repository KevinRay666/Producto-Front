import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Producto } from './services/products/producto';
import { Auth } from './services/auths/auth';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  logInForm !: FormGroup;
  productoForm !: FormGroup;
  productos: any[] = [];
  banderaError: boolean = false;
  errorMessage: String = '';
  banderaLogin: boolean = false;
  userName: String = '';
  banderaPermisos: boolean = true;

  constructor(
    public fb: FormBuilder,
    public logF: FormBuilder,
    public productoService: Producto,
    public authService: Auth
  ) { }
  ngOnInit(): void {
    this.productoForm = this.fb.group({
      id: [''],
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
    })

    this.logInForm = this.logF.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

  }

  cargarProductos(): void {
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
      this.cargarProductos();
      this.banderaError = false;
    },
      error => {
        console.error(error)
        this.errorMessage = error.error.data.message
        this.banderaError = true;
      }
    )
  }

  logIn(){
    this.authService.logIn(this.logInForm.value).subscribe(resp => {
      console.log(this.logInForm.value)
      console.log(resp)
      this.banderaLogin = true;
      if(this.logInForm.value.username != 'admin'){
        this.banderaPermisos = false;
      }
      this.banderaError = false;
      this.cargarProductos();
    }, error =>{
      console.error(error)
      this.errorMessage = error.error.data
      this.banderaError = true;
    })
  }

  cerrarSesion(){
    this.authService.logout();
    this.banderaLogin = false;
    this.banderaPermisos = true;
    this.banderaError = false;
  }

  eliminar(producto: any) {
    this.productoService.deleteProducto(producto.id).subscribe(resp => {
      console.log(resp)
      if (resp.data === false) {
        this.productoForm.reset();
         this.cargarProductos();
         this.banderaError = false;
      }
    })
  }

  seleccionar(product: any) {
    this.productoForm.setValue({
      id: product.id,
      sku: product.sku,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: product.cantidad
    })
  }

  actualizar() {
    console.log(this.productoForm.value)
    this.productoService.editarProducto(this.productoForm.value).subscribe(resp => {
      console.log(resp)
      this.productoForm.reset();
      this.cargarProductos();
      this.banderaError = false;
    })
  }

  mostrarProductoById(){
    console.log();
  }

}