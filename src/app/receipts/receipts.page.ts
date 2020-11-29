import { Component } from '@angular/core';
import { CreateReceiptPage } from '../create-receipt/create-receipt.page';
import { ReceiptsService } from '../services/receipts-service.service';
import { Observable } from 'rxjs';
import { ReceiptDataLog } from '../receipts/receipt.model';
import { ModalController, AlertController, AnimationController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'receipts',
  templateUrl: 'receipts.page.html',
})

export class ReceiptsPage {
  
  constructor(
    public modalControl: ModalController,
    public animationControl: AnimationController,
    public actionSheetController: ActionSheetController,
    private receiptsService: ReceiptsService,
    private alertControl: AlertController
    
  ) {
    this.receiptsService.getReceipts();
  }
  
  async presentModal(availableReceipt?) {
    
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationControl.create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationControl.create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ]);

      return this.animationControl.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    }

    const modal = await this.modalControl.create({
      component: CreateReceiptPage,
      enterAnimation,
      leaveAnimation,
      componentProps: { availableReceipt: availableReceipt } || {},
    });

    await modal.present();
    modal
      .onWillDismiss()
      .then(() => {
        this.receiptsService.getReceipts();
      })
      .catch((e) => console.error(e));
  }


 get ReceiptsTotal(): number {
    return this.receiptsService?.allReceipts?.value?.reduce((a, b) => a + b.cost, 0) || 0;
  }

  get AllReceipts(): Observable<ReceiptDataLog[]> {
    return this.receiptsService.allReceipts;
  }

  async presentOptions(receipt) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          return this.deleteReceipt(receipt);
        }
      }, {
        text: 'Edit',
        icon: 'create-outline',
        handler: () => {
          return this.editReceipt(receipt);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

    editReceipt(receipt) {
    this.presentModal(receipt);
  }
  async deleteReceipt(receipt) {
    const alert = await this.alertControl.create({
      header: 'Delete This Receipt?',
      message: '<strong>All information on this receipt will be deleted</strong>',
      buttons: [
        {
          cssClass: 'secondary',
          text: 'Cancel',
          role: 'cancel',  
          handler: () => {return;},},
        { cssClass: 'danger', 
          text: 'Delete', 
          handler: () => {this.receiptsService.deleteReceipt(receipt);},
        },
      ],
    });
    await alert.present();
  }

}
  

