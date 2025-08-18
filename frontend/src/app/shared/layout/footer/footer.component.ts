import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../../components/modal/modal.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private modal: MatDialog) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.open(ModalComponent, { data: { type: 'consultation' }})
  }
}
