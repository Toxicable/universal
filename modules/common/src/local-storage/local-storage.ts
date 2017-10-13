import { Injectable, Inject, PLATFORM_ID, InjectionToken, NgModule } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TransferState , makeStateKey} from '@angular/platform-browser';
import { ServerTransferStateModule } from '@angular/platform-server';


interface LocalStorage{
  length: number;
  clear: () => void;
  removeItem: (key: string) => void;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
}
export const LOCAL_STORAGE_BACKEND_TOKEN = new InjectionToken<LocalStorage>('LOCAL_STORAGE_BACKEND_TOKEN');
export const LOCAL_STORAGE_STATE_TRANSFER_KEY = makeStateKey<{[key: string]: string}>('LOCAL_STORAGE_STATE_TRANSFER_KEY');

@Injectable()
export class ServerLocalStorageBackendService implements LocalStorage {
  private store: {[key: string]: string};
  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    private stateTransfer: TransferState,
  ) {
    console.log('server')
    if (!isPlatformServer(platformId)) {
      throw new Error('must only be provided on the server')
    }
    this.store = {};
  }
  get length(){
    return Object.keys(this.store).length;
  }
  clear(){
    this.store = {};
  }
  removeItem(key: string){
    delete this.store[key];
  }
  getItem(key: string){
    return this.store[key];
  }
  setItem(key: string, value: string){
    this.store[key] = value;
  }
}


@Injectable()
export class LocalStorageService implements LocalStorage {
  length: number;
  clear: () => void;
  removeItem: (key: string) => void;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
}

export function localStorageServiceFactory(backend: LocalStorage){
  return backend;
}

export function browserLocalStorageBackendFactory(stateTransfer: TransferState){
  var serverStorage = stateTransfer.get(LOCAL_STORAGE_STATE_TRANSFER_KEY, {});
  
  Object.keys(serverStorage)
    .forEach(key => window.localStorage.setItem(key, serverStorage[key]))

  return window.localStorage;
}

@NgModule({
  providers: [
    { 
      provide: LocalStorageService, 
      useFactory: localStorageServiceFactory,
      deps: [
        LOCAL_STORAGE_BACKEND_TOKEN
      ]
    },
    { 
      provide: LOCAL_STORAGE_BACKEND_TOKEN,
       useFactory: browserLocalStorageBackendFactory ,
      deps: [
        TransferState
      ]
    }
  ],
})
export class BrowserLocalStorageModule { }

@NgModule({
  providers: [
    { provide: LOCAL_STORAGE_BACKEND_TOKEN, useClass: ServerLocalStorageBackendService }
  ],
})
export class ServerLocalStorageModule { }

