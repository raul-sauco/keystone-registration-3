import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRequiredMessageComponent } from './login-required-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        RouterModule,
        TranslateModule,
        LoginRequiredMessageComponent
    ],
    exports: [LoginRequiredMessageComponent]
})
export class LoginRequiredMessageModule { }
