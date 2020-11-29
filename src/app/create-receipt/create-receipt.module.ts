import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CreateReceiptPageRoutingModule } from './create-receipt-routing.module';
import { CreateReceiptPage } from './create-receipt.page';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  imports: [CommonModule, IonicModule, CreateReceiptPageRoutingModule, ReactiveFormsModule, CurrencyMaskModule],
  declarations: [CreateReceiptPage],
})
export class CreateReceiptPageModule {}
