import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'receipts',
    loadChildren: () => import('./receipts/receipts.module').then( m => m.ReceiptsPageModule)
  },
  {
    path: '',
    redirectTo: 'receipts',
    pathMatch: 'full'
  },
  {
    path: 'create-receipt',
    loadChildren: () => import('./create-receipt/create-receipt.module').then( m => m.CreateReceiptPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
