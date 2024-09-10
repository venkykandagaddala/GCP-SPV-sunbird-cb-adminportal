import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { ConformationPopupComponent } from '../../dialogs/conformation-popup/conformation-popup.component'

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

  contentTableData: any
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
  showUploadedStatusLoader = false
  contenetMenuItems: {
    icon: string,
    btnText: string,
    action: string
  }[] = []
  contentSearchKey = ''
  contentTablePaginationDetails: any

  publishedCoursesTableData: any
  publishedCoursesList: any = [
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
  showPublishedCoursesLoader = false
  publishedCoursesSerachKey = ''
  publishedCoursesTablePaginationDetails: any

  unPublishedCoursesTableData: any
  unPublishedCoursesList: any = [
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
  showUnpublishedCoursesLoader = false
  unpublishedCoursesMenuItems: {
    icon: string,
    btnText: string,
    action: string
  }[] = []
  unPublishedCoursesSearchKey = ''
  unPublishedCoursesTablePaginationDetails: any

  // contentFileUploaded = false
  // contentFileUploadCondition: any
  FILE_UPLOAD_MAX_SIZE: number = 100 * 1024 * 1024
  contentFile: any
  fileName: string = ''
  fileUploadedDate: string | null = ''
  dialogRef: any
  defaultPagination = {
    startIndex: 0,
    lastIndes: 20,
    pageSize: 20,
    pageIndex: 0,
    totalCount: 20
  }
  selectedIndex = 0

  constructor(
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      this.tableDataInitialzation()
      this.getContentList()
      this.getPublishedCoursesList()
      this.getUnPublishedCoursesList()
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
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
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
          intiatedOn: this.datePipe.transform(new Date(element.initiatedOn), 'dd MMM yyyy hh:mm a'),
          completedOn: this.datePipe.transform(new Date(element.completedOn), 'dd MMM yyyy hh:mm a'),
        }
        formatedList.push(formatedData)
      })
    }
    return formatedList
  }
  //#endregion

  //#region (courses)
  getPublishedCoursesList() {
    if (this.providerDetails && this.providerDetails.providerName) {
      this.showPublishedCoursesLoader = true
      this.publishedCoursesList = []
      const formBody = {
        providerName: this.providerDetails.providerName,
        size: this.publishedCoursesTablePaginationDetails.pageSize,
        page: this.publishedCoursesTablePaginationDetails.pageIndex,
        isActive: true,
        keyword: this.publishedCoursesSerachKey
      }
      this.marketPlaceSvc.getCoursesList(formBody)
        .pipe(map((responce: any) => {
          const formatedData = {
            totalCount: _.get(responce, 'totalElements', 0),
            formatedList: this.formateCoursesList(_.get(responce, 'result', []))
          }
          return formatedData
        }))
        .subscribe({
          next: (result: any) => {
            this.publishedCoursesList = result.formatedList
            this.publishedCoursesTablePaginationDetails.totalCount = result.totalCount
            this.showPublishedCoursesLoader = false
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
            this.showPublishedCoursesLoader = false
            this.showSnackBar(errmsg)
          }
        })
    }
  }

  getUnPublishedCoursesList() {
    if (this.providerDetails && this.providerDetails.providerName) {
      this.showUnpublishedCoursesLoader = true
      this.unPublishedCoursesList = []
      const formBody = {
        providerName: this.providerDetails.providerName,
        size: this.unPublishedCoursesTablePaginationDetails.pageSize,
        page: this.unPublishedCoursesTablePaginationDetails.pageIndex,
        isActive: false,
        keyword: this.unPublishedCoursesSearchKey
      }
      this.marketPlaceSvc.getCoursesList(formBody)
        .pipe(map((responce: any) => {
          const formatedData = {
            totalCount: _.get(responce, 'totalElements', 0),
            formatedList: this.formateCoursesList(_.get(responce, 'result', []))
          }
          return formatedData
        }))
        .subscribe({
          next: (result: any) => {
            this.unPublishedCoursesList = result.formatedList
            this.unPublishedCoursesTablePaginationDetails.totalCount = result.totalCount
            this.showUnpublishedCoursesLoader = false
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
            this.showPublishedCoursesLoader = false
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

  searchCourses(publishedCourses: boolean, searchKey: string) {
    if (publishedCourses) {
      this.publishedCoursesSerachKey = searchKey
      this.setPagination('published', this.defaultPagination)
      this.getPublishedCoursesList()
    } else {
      this.unPublishedCoursesSearchKey = searchKey
      this.setPagination('notPublished', this.defaultPagination)
      this.getUnPublishedCoursesList()
    }
  }

  pageChange(event: any, courseType: string) {
    if (courseType === 'published') {
      this.publishedCoursesTablePaginationDetails = event
      this.getPublishedCoursesList()
    } else if (courseType === 'notPublished') {
      this.unPublishedCoursesTablePaginationDetails = event
      this.getUnPublishedCoursesList()
    }
  }
  //#endregion

  ngOnInit() {
  }

  tableDataInitialzation() {
    this.contentTableData = {
      columns: [
        { displayName: 'File Name', key: 'name', cellType: 'text' },
        { displayName: 'File Status', key: 'status', cellType: 'status' },
        { displayName: 'Initiated On', key: 'intiatedOn', cellType: 'text' },
        { displayName: 'Completed On', key: 'completedOn', cellType: 'text' },
      ],
      needCheckBox: false,
      showDeleteAll: false,
      showSearchBox: false,
      showPagination: false
    }
    this.contenetMenuItems = [
      {
        icon: '',
        btnText: 'Download Log',
        action: 'downloadLog'
      },
    ]

    this.unPublishedCoursesTableData = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg', cellClass: 'text-overflow-elipse' },
        { displayName: 'Source', key: 'source', cellType: 'text' },
        { displayName: 'Listed On', key: 'listedOn', cellType: 'text' }

      ],
      needCheckBox: true,
      showDeleteAll: true
    }
    this.unpublishedCoursesMenuItems = [
      {
        icon: '',
        btnText: 'Delete',
        action: 'delete'
      },
    ]
    this.setPagination('notPublished', this.defaultPagination)

    this.publishedCoursesTableData = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg', cellClass: 'text-overflow-elipse' },
        { displayName: 'Source', key: 'source', cellType: 'text' },
        { displayName: 'Publised On', key: 'publishedOn', cellType: 'text' },
        { displayName: 'Listed On', key: 'listedOn', cellType: 'text' },

      ],
      needCheckBox: false,
      showDeleteAll: false
    }
    this.setPagination('published', this.defaultPagination)
  }

  setPagination(tableType: string, pagination: any) {
    switch (tableType) {
      case 'published':
        this.publishedCoursesTablePaginationDetails = JSON.parse(JSON.stringify(pagination))
        break
      case 'notPublished':
        this.unPublishedCoursesTablePaginationDetails = JSON.parse(JSON.stringify(pagination))
        break
    }
  }

  contentEvents(event: any, content: any) {
    switch (event.action) {
      case 'view':
        this.navigateToPreview(content)
        break
      case 'delete':
        this.deletedSelectedCourses(event)
        break
    }
  }

  onDrop(file: File) {
    // this.contentFileUploadCondition = {
    //   fileName: false,
    //   eval: false,
    //   externalReference: false,
    //   iframe: false,
    //   isSubmitPressed: false,
    //   preview: false,
    //   url: '',
    // }
    this.fileName = file.name.replace(/[^A-Za-z0-9_.]/g, '')
    if (!(this.fileName.toLowerCase().endsWith('.csv') || this.fileName.toLowerCase().endsWith('.xlsx'))) {
      this.showSnackBar('Unsupported File Format. Please upload a CSV or XLSX file.')
    } else if (file.size > this.FILE_UPLOAD_MAX_SIZE) {
      this.showSnackBar('Please upload a file less than 100 MB')
    } else {
      this.contentFile = file
      // this.contentFileUploaded = true
      this.fileUploadedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy')
      this.uploadFile()
      // this.showSnackBar('File uploaded')
    }
  }

  uploadFile() {
    if (this.contentFile) {
      this.openFileUploadPopup()
      const formData = new FormData()
      formData.append(
        'content',
        this.contentFile as Blob,
        (this.contentFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )

      this.marketPlaceSvc.uploadContent(formData, this.providerDetails.providerName).subscribe({
        next: (res: any) => {
          if (res) {
            this.showSnackBar('File imported successfully')
            this.dialogRef.close()
            this.getContentList()
            this.getUnPublishedCoursesList()
            this.getPublishedCoursesList()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.code', 'Some thig went wrong while uploading. Please try again')
          this.dialogRef.close()
          this.showSnackBar(errmsg)
        }
      })
    } else {
      this.showSnackBar('Please upload a file to import')
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
      disableClose: true,
    })
  }

  deletedSelectedCourses(event: any) {
    if (event && event.rows) {
      const formBody = {
        partnerName: this.providerDetails.providerName,
        externalId: typeof event.rows === 'object' ? [event.rows.id] : event.rows.map((item: any) => item.id)
      }
      this.marketPlaceSvc.deleteUnPublishedCourses(formBody).subscribe({
        next: (res: any) => {
          if (res) {
            const msg = 'Selected courses are deleted successfully'
            this.showSnackBar(msg)
            this.getUnPublishedCoursesList()
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
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
