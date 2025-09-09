import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
// ...existing code...
export const routes: Routes = [
{ path: '', component: Home }, // Página inicial
{ path: 'login', component: Login }, // Página de login
{ path: 'cadastro', component: Cadastro }, // Página de login
];
