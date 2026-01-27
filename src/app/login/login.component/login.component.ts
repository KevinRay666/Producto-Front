import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from 'src/app/services/auths/auth';
import { Producto } from 'src/app/services/products/producto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,
    FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{

  logInForm !: FormGroup;
  banderaLogin: boolean = false;
  banderaPermisos: boolean = true;
  banderaError: boolean = false;
  errorMessage: String = '';
  productos: any[] = [];

  @Output() banderaLoginEmmit: EventEmitter<boolean> = new EventEmitter();
  @Output() banderaPermisosEmmit: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public authService: Auth,
    public productoService: Producto,
    public logF: FormBuilder
  ){}


  ngOnInit(): void {
    this.logInForm = this.logF.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

    logIn(){
    this.authService.logIn(this.logInForm.value).subscribe(resp => {
      console.log(this.logInForm.value)
      console.log(resp)
      this.banderaLoginEmmit.emit(true);
      if(this.logInForm.value.username != 'admin'){
        this.banderaPermisosEmmit.emit(false);
      }
      this.banderaError = false;
      this.cargarProductos();
    }, error =>{
      console.error(error)
      this.errorMessage = error.error.data
      this.banderaError = true;
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

}
