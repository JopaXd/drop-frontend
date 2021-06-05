import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  fileLink;

  onFileDropped($event){
    let file = $event[0]
    //Converting the file size to megabytes.
    let file_size_mb = file.size / 1000000
    //Check if file is larger than 200MB.
    if (file_size_mb > 200){
      //Toast message.
      this.toastr.error("File is too big! The file should be less than 200 MB!", "Error!", { positionClass: "toast-bottom-right" })
    }
    else{
      let formData = new FormData();
      formData.append("file", file)
      let upload = this.http.post("http://localhost:8000/uploadfile/", formData);
      upload.subscribe(data => {
          if (data["success"] == true){
            //Will figure out how to create a proper link in production..
            this.fileLink = `http://localhost:8000/file/${data["file_id"]}`
            let linkModal = new Modal(document.getElementById('linkModal'))
            linkModal.show()
          }
          else{
            this.toastr.error(data["error"], "Error!", { positionClass: "toast-bottom-right" })
          }
      },
      error => {
        this.toastr.error("An unknown error occured, the server may be offline. Try again later.", "Error!", { positionClass: "toast-bottom-right" })
      })
    }
  }
}