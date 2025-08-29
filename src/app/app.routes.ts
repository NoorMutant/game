import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Start } from './pages/start/start';
import { UserSelected } from './pages/user-selected/user-selected';
import { Result } from './pages/gameplay/result/result';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Profile } from './pages/auth/profile/profile';
import { preventBackGuard } from './guards/prevent-back-guard';
import { flowSafetyGuard } from './guards/flow-safety-guard';


export const routes: Routes = [
    {
        path: '',
        component:Start,
        canActivate:[flowSafetyGuard],
        // runGuardsAndResolvers: 'always'
    },
    {
        path:"user-selected/:selected",
        component: UserSelected,
        canActivate:[flowSafetyGuard],
        // runGuardsAndResolvers: 'always'
    },
    {
        path:"result/:selected",
        component: Result,
        canActivate:[flowSafetyGuard],
        // runGuardsAndResolvers: 'always'
    },
    {
        path:"login",
        component: Login,
        canActivate:[flowSafetyGuard]
    },
    {
        path:"signup",
        component: Signup,
        canActivate:[flowSafetyGuard]
    },
    {
        path:"profile",
        component: Profile,
        canActivate:[flowSafetyGuard]
    },
    {
        path: '**', 
        component: Start ,
        canActivate:[flowSafetyGuard]
    }

    
];


// @NgModule({
//     imports: [
//         // ✅ NOW pass the routes
//         RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
//     ],
//     exports: [RouterModule]
// })
// export class AppRoutingModule {}

