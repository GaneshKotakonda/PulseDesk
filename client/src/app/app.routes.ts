import { Routes } from '@angular/router';
import { Login } from '../components/login/login';
import { Dashboard } from '../components/dashboard/dashboard';
import { SignUp } from '../components/sign-up/sign-up';

export const routes: Routes = [
    {
         path: '',
    component: Login
    },
     {
         path: 'dashboard',
    component: Dashboard
    },
     {
        path: 'signUp',
    component: SignUp
    },

];
