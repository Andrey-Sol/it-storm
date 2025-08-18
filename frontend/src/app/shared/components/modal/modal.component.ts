import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { SharedService } from "../../services/shared.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ServiceType } from "../../../../types/service.type";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  modalForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: ''
  })
  requestSuccess: boolean = false;
  requestError: boolean = false;
  serviceNames: string[] = [];

  constructor(private fb: FormBuilder,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: {type: string, service: string}) { }

  ngOnInit(): void {
    this.sharedService.getServices().forEach((service: ServiceType) => {
      this.serviceNames.push(service.name);
    })

    this.modalForm.get('service')?.setValue(this.data.service);
  }

  request() {
    if (this.modalForm.valid && this.modalForm.value.name && this.modalForm.value.phone) {
      let requestData;
      if (this.data.type === 'order') {
        requestData = {
          name: this.modalForm.value.name,
          phone: this.modalForm.value.phone,
          type: this.data.type,
          service: this.modalForm.value.service,
        }
      } else {
        requestData = {
          name: this.modalForm.value.name,
          phone: this.modalForm.value.phone,
          type: this.data.type,
        }
      }

      this.sharedService.newRequest(requestData)
        .subscribe({
          next: () => {
            this.requestSuccess = true;
          },
          error: () => {
            this.requestError = true;
          }
        })
    }
  }
}
