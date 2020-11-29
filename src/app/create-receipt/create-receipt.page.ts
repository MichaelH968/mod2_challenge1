import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ReceiptDataLog } from '../receipts/receipt.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ReceiptsService } from 'src/app/services/receipts-service.service';
const { Camera } = Plugins;


@Component({
  selector: 'app-create-receipt',
  templateUrl: './create-receipt.page.html',
  styleUrls: ['./create-receipt.page.scss'],
})
export class CreateReceiptPage implements OnInit {
  @Input() availableReceipt: ReceiptDataLog;
  receiptForm: FormGroup;
  receiptId: string;
  function: string = 'Create';
  currentReceipt: ReceiptDataLog;


  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private receiptsService: ReceiptsService,
    private alertController: AlertController,
    
  ) { }

  ngOnInit() {
    this.function = this.availableReceipt ? 'Edit' : 'Create';
    this.currentReceipt = {
      id: this.createId(),
      cost: 0,
      receiptImages: [],
      comment: '',
      receiptDate: new Date().toISOString(),
      type: '',
      ...this.availableReceipt,
    };

    this.receiptForm = this.formBuilder.group({
      cost: [this.currentReceipt.cost, [Validators.required]],
      receiptDate: [this.currentReceipt.receiptDate, [Validators.required]],
      comment: [this.currentReceipt.comment], 
      type: [this.currentReceipt.type, [Validators.required]],
    });
  }

  async createReceipt() {
    if (this.receiptForm.valid) {

      const receiptDataLog: ReceiptDataLog = {
      id: this.currentReceipt.id,
      cost: this.receiptForm.value?.cost,
      receiptDate: this.receiptForm.value?.receiptDate || new Date().toISOString(),
      comment: this.receiptForm.value?.comment || '',
      type: this.receiptForm.value?.type || '',
      receiptImages: [...this.currentReceipt?.receiptImages],
    };        
      try {
        await this.createOrEditReceipt(receiptDataLog);
        this.modalController.dismiss();
      } catch (error) {
        console.error(error);
      }
    }
    else {    
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: 'Please add all the required receipt details',
          buttons: ['OK']
        });
    
        await alert.present();
    }}

  async getImage() {
    const receiptImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const base64Image = await this.imageService.readAsBase64(receiptImage);
    this.currentReceipt.receiptImages.unshift(base64Image);
  }
  
async deleteReceipt(receipt) {
    const alert = await this.alertController.create({
      header: 'Delete Receipt?',
      message: 'Are you sure you wish to delete this receipt?',
      buttons: [
        {text: 'Cancel', role: 'cancel', cssClass: 'secondary', handler: () => {return;},},
        { cssClass: 'danger', text: 'Delete', handler: () => {this.receiptsService.deleteReceipt(receipt);},
        },
      ],
    });}

  async createOrEditReceipt(receipt) {
      this.receiptsService.createOrEditReceipt(receipt);  
  }

  createId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  deleteImg(position) {
    this.currentReceipt.receiptImages.splice(position, 1);
  }
}
