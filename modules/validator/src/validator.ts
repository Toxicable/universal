import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModule, ServerModule } from '@angular/platform-server';
import { NgModule, enableProdMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
enableProdMode();


export function validate(module: any, bootstrapComponent: any, selector = 'app-root', timeout = 5000) {
  @NgModule({
    imports: [
      BrowserModule.withServerTransition({ appId: selector }),
      module
    ],
    declarations: [bootstrapComponent],
    bootstrap: [bootstrapComponent],
  })
  class AppModule { }

  @NgModule({
    imports: [
      ServerModule,
      AppModule,
    ],
    bootstrap: [bootstrapComponent],
  })
  class AppServerModule { }

  const document = `<${selector}></${selector}>`;

  let rendered = false;
  setTimeout(() => {
    if (!rendered) {
      throw new Error('Module did not render in time. Check that all async operations have been cleaned up');
    }
  }, timeout);
  return renderModule(AppServerModule, {
    document,
  }).then(html => {
    rendered = true;
    return html;
  })
}

