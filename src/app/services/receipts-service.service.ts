import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptsService {

  allReceipts = new BehaviorSubject([]);

  constructor() 
  { }

  async setReceipts(key, receiptArray) 
  {
    await Storage.set({
      key: key,
      value: JSON.stringify(receiptArray),
    });
    return this.getReceipts();
  }
  
  async getReceipts() 
  {
    const store = await Storage.get({ 
      key: 'receipts' 
    });
    this.allReceipts.next(JSON.parse(store.value));
  }

  async getStoredReceipts(key) 
  {
    const store = await Storage.get({ 
      key: key 
    });
    return JSON.parse(store.value);
  }

  async createOrEditReceipt(receipt) 
  {
    const savedReceipts = (await this.getStoredReceipts('receipts')) || [];
    const receiptIndex = savedReceipts.findIndex((element) => 
    element.id === receipt.id);

    let savedReceiptsArray = [...savedReceipts];
    if (receiptIndex > -1) 
    {
      savedReceiptsArray[receiptIndex] = 
      { ...receipt  };
    }   
    else 
    {
      savedReceiptsArray.unshift(receipt);
    }
    return this.setReceipts('receipts', savedReceiptsArray);
  }  
  
  async deleteReceipt(receipt) 
  {
    const getValues = this.allReceipts.getValue();
    const receiptIndex = getValues.findIndex((element) => element.id === receipt.id);
    getValues.splice(receiptIndex, 1);
    this.setReceipts('receipts', getValues);
  }

  // async deleteReceipt() {
  //   await Storage.remove({ key: 'receipts' });
  // }
}
