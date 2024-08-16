import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss']
})
export class ContentUploadComponent implements OnInit {

  helpCenterGuide = {
    header: 'Content Upload Details: Video Guides and Tips',
    guideNotes: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit orci in ultricies aliquam. Maecenas tempus fermentum mi, at laoreet elit ultricies eget.'
    ],
    helpVideoLink: 'url'
  }

  uploadedContentList = [
    {
      status: 'Live',
      name: '1710482612470_1710214198937_users-file-upload-sample (15).xlsx',
      intiatedOn: '15 Mar 2024 11:33 AM',
      completedOn: '15 Mar 2024 11:33 AM',
    },
    {
      status: 'Live',
      name: '1710482612470_1710214198937_users-file-upload-sample (15).xlsx',
      intiatedOn: '15 Mar 2024 11:33 AM',
      completedOn: '15 Mar 2024 11:33 AM',
    },
    {
      status: 'Failed',
      name: '1710482612470_1710214198937_users-file-upload-sample (15).xlsx',
      intiatedOn: '15 Mar 2024 11:33 AM',
      completedOn: '15 Mar 2024 11:33 AM',
    },
    {
      status: 'Deleted',
      name: '1710482612470_1710214198937_users-file-upload-sample (15).xlsx',
      intiatedOn: '15 Mar 2024 11:33 AM',
      completedOn: '15 Mar 2024 11:33 AM',
    },
  ]

  constructor() { }

  ngOnInit() {
  }

  contentEvents(event: any, content: any) {
    switch (event.action) {
      case 'view':
        this.navigateToPreview()
        break
      case 'delete':
        console.log(event, content)
        break
    }
  }

  navigateToPreview() { }

}
