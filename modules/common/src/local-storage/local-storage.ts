import { Injectable, Inject, PLATFORM_ID, InjectionToken, NgModule } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ServerTransferStateModule } from '@angular/platform-server';

export const LOCAL_STORAGE_BACKEND_TOKEN = new InjectionToken<Storage>('LOCAL_STORAGE_BACKEND_TOKEN');
export const LOCAL_STORAGE_STATE_TRANSFER_KEY = makeStateKey<{ [key: string]: string }>('LOCAL_STORAGE_STATE_TRANSFER_KEY');

@Injectable()
export class ServerStorageBackendService implements Storage {
  private store: { [key: string]: string };
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
  [index: number]: string;
  [key: string]: any;
  key(index: number): string {
    throw new Error("Method not implemented.");
  }
  get length() {
    return Object.keys(this.store).length;
  }
  clear() {
    this.store = {};
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  getItem(key: string) {
    return this.store[key];
  }
  setItem(key: string, value: string) {
    this.store[key] = value;
  }
}

@Injectable()
export class WindowService implements WindowLocalStorage{
  localStorage: Storage;
}


export function windowServiceFactory(localStorage): WindowService{
  return { localStorage };
}

export function browserStorageBackendFactory(stateTransfer: TransferState) {
  var serverStorage = stateTransfer.get(LOCAL_STORAGE_STATE_TRANSFER_KEY, {});

  Object.keys(serverStorage)
    .forEach(key => window.localStorage.setItem(key, serverStorage[key]))

  return window.localStorage;
}

@NgModule({
  providers: [
    {
      provide: WindowService,
      useFactory: windowServiceFactory,
      deps: [
        LOCAL_STORAGE_BACKEND_TOKEN
      ]
    },
    {
      provide: LOCAL_STORAGE_BACKEND_TOKEN,
      useFactory: browserStorageBackendFactory,
      deps: [
        TransferState
      ]
    }
  ],
})
export class BrowserWindowServiceModule { }

@NgModule({
  providers: [
    { provide: LOCAL_STORAGE_BACKEND_TOKEN, useClass: ServerStorageBackendService }
  ],
})
export class ServerWindowServiceModule { }

