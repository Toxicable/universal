import { NgModule } from "@angular/core";
import { AbsoluteUrlInterceptor } from "./interceptor";


@NgModule({
  providers: [ AbsoluteUrlInterceptor ]
})
export class AbsoluteUrlInterceptorModule{}
