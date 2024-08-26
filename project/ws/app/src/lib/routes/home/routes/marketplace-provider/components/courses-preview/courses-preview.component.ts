import { Component, OnInit } from '@angular/core'
import { MarketplaceService } from '../../services/marketplace.service'
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material'

@Component({
  selector: 'ws-app-courses-preview',
  templateUrl: './courses-preview.component.html',
  styleUrls: ['./courses-preview.component.scss']
})
export class CoursesPreviewComponent implements OnInit {
  selectedCourse: any
  tabledata: any
  dataSource!: MatTableDataSource<any>
  coursesList: any = [
    {
      courseName: 'AI Accelerator Bootcamp..',
      courseImg: '/assets/icons/csv.svg',
      course: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      isActive: true,
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      course: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      course: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      isActive: false,
      course: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      course: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      course: 'file 1',
      courseStatus: 'Not Published',
      publishedOn: 'N/A',
      listedOn: 'Sep 13, 2024',
      courseImg: '/assets/icons/csv.svg',
      isActive: true,
    },
    {
      courseName: 'AI Accelerator Bootcamp..',
      courseImg: '/assets/icons/csv.svg',
      course: 'file 1',
      courseStatus: 'Published',
      publishedOn: 'Sep 13, 2024',
      listedOn: 'Sep 13, 2024',
      isActive: false,
    }
  ]

  constructor(
    private marketPlaceSvc: MarketplaceService,
    private router: Router
  ) {
    this.selectedCourse = this.marketPlaceSvc.getSelectedCourse
    if (!this.selectedCourse) {
      this.router.navigate(['/app/home/marketplace-providers/onboard-partner', { tab: 'contentUpload' }])
    }
  }

  ngOnInit() {
    console.log(this.selectedCourse)
    this.setTabledata()
  }

  setTabledata() {
    this.tabledata = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg' },
        { displayName: 'Source', key: 'course', cellType: 'text' },
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

}
