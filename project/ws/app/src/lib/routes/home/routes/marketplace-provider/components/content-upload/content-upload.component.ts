import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { map } from 'rxjs/operators'
import { of } from 'rxjs'
import * as _ from 'lodash'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ws-app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [DatePipe]
})
export class ContentUploadComponent implements OnInit {

  @Input() providerDetails?: any

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

  tabledata: any
  dataSource!: MatTableDataSource<any>
  coursesList: any = [
    {
      id: 1,
      courseName: 'AI Accelerator Bootcamp..',
      courseImg: '/assets/icons/csv.svg',
      source: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      isActive: false,
    },
    {
      id: 2,
      courseName: 'AI Accelerator Bootcamp..',
      source: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      id: 3,
      courseName: 'AI Accelerator Bootcamp..',
      source: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: false,
    },
    {
      id: 4,
      courseName: 'AI Accelerator Bootcamp..',
      isActive: false,
      source: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
    },
    {
      id: 5,
      courseName: 'AI Accelerator Bootcamp..',
      source: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      id: 6,
      courseName: 'AI Accelerator Bootcamp..',
      source: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: false,
    },
    {
      id: 7,
      courseName: 'AI Accelerator Bootcamp..',
      courseImg: '/assets/icons/csv.svg',
      source: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      isActive: false,
    }
  ]
  length = 20

  constructor(
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private datePipe: DatePipe
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      // this.getContentList()
      this.getCoursesList()
    }
  }

  getContentList() {
    if (this.providerDetails && this.providerDetails.providerName) {
      const formBody = {
        providerName: this.providerDetails.providerName,
        size: 10,
        page: 0,
        isActive: false
      }
      this.marketPlaceSvc.getContentList(formBody)
        .pipe(map((responce: any) => {
          return this.formateContentList(responce)
        }))
        .subscribe({
          next: (result: any) => {
            console.log('files list', result)
          }
        })
    }
  }

  formateContentList(responce: any) {
    return of(responce)
  }

  getCoursesList() {
    if (this.providerDetails && this.providerDetails.contentPartnerName) {
      this.coursesList = []
      const formBody = {
        // providerName: this.providerDetails.contentPartnerName,
        providerName: 'eCornell',
        size: 20,
        page: 0,
        isActive: false
      }
      this.marketPlaceSvc.getCoursesList(formBody)
        .pipe(map((responce: any) => {
          return this.formateCoursesList(_.get(responce, 'result', []))
        }))
        .subscribe({
          next: (result: any) => {
            this.coursesList = result
          }
        })
    }
  }

  formateCoursesList(responce: any[]) {
    const formatedList: any = []
    responce.forEach((course: any) => {
      const formateCourse = {
        id: _.get(course, 'ciosData.content.externalId', ''),
        courseName: _.get(course, 'ciosData.content.name', ''),
        courseImg: _.get(course, 'ciosData.content.appIcon', ''),
        source: _.get(course, 'ciosData.content.source', ''),
        courseStatus: course.isActive ? 'Published' : 'Not Published',
        publishedOn: course.publishedOn ? (this.datePipe.transform(new Date(course.publishedOn), 'MMM dd, yyyy')) : 'N/A',
        listedOn: course.createdDate ? (this.datePipe.transform(new Date(course.createdDate), 'MMM dd, yyyy')) : 'N/A',
        isActive: course.isActive,
        isChecked: false
      }
      formatedList.push(formateCourse)
    })
    return formatedList
  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg' },
        { displayName: 'Source', key: 'source', cellType: 'text' },
        { displayName: 'Course Status', key: 'courseStatus', cellType: 'text' },
        { displayName: 'Publised On', key: 'publishedOn', cellType: 'text' },
        { displayName: 'Listed On', key: 'listedOn', cellType: 'text' },
        { displayName: '', key: 'delete', cellType: 'delete-btn' },

      ],
      needCheckBox: true,
      disableOn: 'isActive'
    }
    this.dataSource = new MatTableDataSource(this.coursesList)
  }

  contentEvents(event: any, content: any) {
    switch (event.action) {
      case 'view':
        this.navigateToPreview(content)
        break
      case 'delete':
        console.log(event, content)
        break
    }
  }

  navigateToPreview(course: any) {
    this.marketPlaceSvc.setSelectedCourse(course)
    this.router.navigateByUrl('/app/home/marketplace-providers/course-preview')
  }

}
