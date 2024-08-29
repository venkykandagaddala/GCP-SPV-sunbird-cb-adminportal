import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material'
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { ConformationPopupComponent } from '../../dialogs/conformation-popup/conformation-popup.component'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'ws-app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [DatePipe]
})
export class ContentUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>

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
  contentFileUploaded = false
  contentFileUploadCondition: any
  FILE_UPLOAD_MAX_SIZE: number = 100 * 1024 * 1024
  contentFile: any
  fileName: string = ''
  fileUploadedDate: string | null = ''
  dialogRef: any
  showUploadedStatusLoader = false
  showCoursesLoader = false

  constructor(
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      this.getContentList()
      this.getCoursesList()
    }
  }

  //#region (content files)
  getContentList() {
    if (this.providerDetails && this.providerDetails.id) {
      this.showUploadedStatusLoader = true
      this.marketPlaceSvc.getContentList(this.providerDetails.id)
        .pipe(map((responce: any) => {
          return this.formateContentList(responce)
        }))
        .subscribe({
          next: (result: any) => {
            this.showUploadedStatusLoader = false
            this.uploadedContentList = result
          },
          error: (error: HttpErrorResponse) => {
            this.showUploadedStatusLoader = false
            const errmsg = _.get(error, 'error.params.errMsg')
            this.showSnackBar(errmsg)
          }
        })
    }
  }

  formateContentList(responce: any) {
    const formatedList: any = []
    if (responce) {
      responce.forEach((element: any) => {
        const formatedData = {
          status: element.status === 'success' ? 'Live' : 'Failed',
          name: element.fileName,
          // intiatedOn: this.datePipe.transform(new Date(element.initiatedOn), 'dd MMM yyyy hh:mm a'),
          // completedOn: this.datePipe.transform(new Date(element.completedOn), 'dd MMM yyyy hh:mm a'),
        }
        formatedList.push(formatedData)
      })
    }
    return formatedList
  }
  //#endregion

  //#region (courses)
  getCoursesList() {
    if (this.providerDetails && this.providerDetails.contentPartnerName) {
      this.showCoursesLoader = true
      this.coursesList = []
      const formBody = {
        // providerName: this.providerDetails.contentPartnerName,
        // need to remove below and uncomment above
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
            this.showCoursesLoader = false
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'error.params.errMsg')
            this.showCoursesLoader = false
            this.showSnackBar(errmsg)
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
  //#endregion

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
      disableOn: 'isActive',
      showDeleteAll: true
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

  onDrop(file: File) {
    this.contentFileUploadCondition = {
      fileName: false,
      eval: false,
      externalReference: false,
      iframe: false,
      isSubmitPressed: false,
      preview: false,
      url: '',
    }
    this.fileName = file.name.replace(/[^A-Za-z0-9_.]/g, '')
    if (!(this.fileName.toLowerCase().endsWith('.csv') || this.fileName.toLowerCase().endsWith('.xlsx'))) {
      this.showSnackBar('Please upload csv or xlsx file')
    } else if (file.size > this.FILE_UPLOAD_MAX_SIZE) {
      this.showSnackBar('file size should not be more than 100 MB')
    } else {
      this.contentFile = file
      this.contentFileUploaded = true
      this.fileUploadedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    }
  }

  uploadFile() {
    this.openFileUploadPopup() // need to remove
    if (this.contentFile) {
      this.openFileUploadPopup()
      const formdata = new FormData()
      formdata.append(
        'content',
        this.contentFile as Blob,
        (this.contentFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )

      this.marketPlaceSvc.uploadContent(formdata, this.providerDetails.contentPartnerName).subscribe({
        next: (res: any) => {
          if (res) {
            console.log('file uploaded', res)
            this.dialogRef.close()
            // this.getContentList()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg')
          this.dialogRef.close()
          this.showSnackBar(errmsg)
        }
      })
    }
  }

  openFileUploadPopup() {
    const dialogData = {
      dialogType: 'csvLoader',
      descriptions: [
        {
          messages: [
            {
              msgClass: '',
              msg: `File processing`,
            },
          ],
        },
      ],
    }
    this.dialogRef = this.dialog.open(ConformationPopupComponent, {
      data: dialogData,
      autoFocus: false,
      width: '956px',
      maxWidth: '80vw',
      maxHeight: '90vh',
      height: '427px',
      // disableClose: true,
    })
  }

  deletedSelectedCourses(event: any) {
    if (event && event.row) {
      const deletionSubscritionList: any = []
      event.rows.forEach((row: any) => {
        deletionSubscritionList.push(this.marketPlaceSvc.deleteCourse(row.id))
      })
      forkJoin(deletionSubscritionList).subscribe({
        next: (res: any) => {
          if (res) {
            this.getCoursesList()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg')
          this.showSnackBar(errmsg)
        }
      })
    }
  }

  navigateToPreview(course: any) {
    this.marketPlaceSvc.setSelectedCourse(course)
    this.router.navigateByUrl('/app/home/marketplace-providers/course-preview')
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
