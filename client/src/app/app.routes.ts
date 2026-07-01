import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Dashboard } from '../components/dashboard/dashboard';
import { SignUp } from '../components/sign-up/sign-up';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
         path: '',
    component: Login
    },
     {
         path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
    },
     {
        path: 'signUp',
    component: SignUp
    },

];
