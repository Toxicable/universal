import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaderResponse, HttpProgressEvent, HttpSentEvent, HttpUserEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UNIVERSAL_BASE_URL } from './tokens';


@Injectable()
export class AbsoluteUrlInterceptor implements HttpInterceptor {

  constructor(@Inject(UNIVERSAL_BASE_URL) protected serverUrl: string) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpHeaderResponse| HttpProgressEvent|HttpSentEvent|HttpUserEvent<any>|HttpResponse<any>>{

    const serverReq = !this.serverUrl ? req : req.clone({
      url: `${this.serverUrl}${req.url}`
    });

    return next.handle(serverReq);

  }

}
