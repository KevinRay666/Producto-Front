import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from 'src/app/services/auths/auth';
import { Producto } from 'src/app/services/products/producto';

@Component({
  selector: 'app-forms',
  imports: [    ReactiveFormsModule,
    FormsModule,],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
})
export class FormsComponent implements OnInit{

  productoForm !: FormGroup;
  banderaError: boolean = false;
  errorMessage: String = '';
  //banderaLogin: boolean = false;
  //banderaPermisos: boolean = true;
  productos: any[] = [];
  producto: any;

  @Input() banderaLogin!: boolean;
  @Input() banderaPermisos!: boolean;

  constructor(
    public fb: FormBuilder,
    public authService: Auth,
    public productoService: Producto
  ){

  }

    ngOnInit(): void {
      this.productoForm = this.fb.group({
      id: [''],
      sku: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      cantidad: ['', Validators.required],
    })
    this.cargarProductos();
    }


    cerrarSesion(){
    this.authService.logout();
    this.banderaLogin = false;
    this.banderaPermisos = true;
    this.banderaError = false;
  }

    guardar(): void {
    this.productoService.saveProducto(this.productoForm.value).subscribe(resp => {
      console.log("Hola");
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

    mostrarProductoById(id: string){
    console.log("Hola");
    console.log(id);
    this.productoService.selectProductoId(id).subscribe(resp => {
      this.productoForm.setValue({
      id: resp.data.id,
      sku: resp.data.sku,
      nombre: resp.data.nombre,
      precio: resp.data.precio,
      cantidad: resp.data.cantidad
    })
      
    },
      error => {
        console.error(error)
      }
    )
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
  actualizar() {
    console.log(this.productoForm.value)
    this.productoService.editarProducto(this.productoForm.value).subscribe(resp => {
      console.log(resp)
      this.productoForm.reset();
      this.cargarProductos();
      this.banderaError = false;
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

}
