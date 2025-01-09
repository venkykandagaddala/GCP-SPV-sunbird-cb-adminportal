import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { FormControl } from '@angular/forms'
import { catchError, delay, map } from 'rxjs/operators'
import { forkJoin, of, Subscription } from 'rxjs'
import * as _ from 'lodash'
import { ActivatedRoute, Router, } from '@angular/router'
import { DatePipe } from '@angular/common'
import { ConfirmationBoxComponent } from '../../../../../home/components/confirmation-box/confirmation.box.component'
import { LoaderService } from '../../../../../home/services/loader.service'
import { DesignationsService } from '../../services/designations.service'
import { SelectedDesignationPopupComponent } from '../../../../../home/components/selected-designation-popup/selected-designation-popup.component'
import { ConformationPopupDesignationComponent } from '../../../../../home/components/conformation-popup/conformation-popup-designation.component'

@Component({
  selector: 'ws-app-import-designation',
  templateUrl: './import-designation.component.html',
  styleUrls: ['./import-designation.component.scss'],
})
export class ImportDesignationComponent implements OnInit, OnDestroy {
  @Output() closeComponent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() loader: boolean = false;
  @Input() importMasterflag: boolean = false;
  environmentVal: any
  designationConfig: any
  frameworkConfig: any
  configSvc: any
  loaderMsg = ''
  showCreateLoader = false
  searchControl = new FormControl()
  igotDesignationsList: any = []
  selectedDesignationsList: any = []
  orgDesignationsList: any = []
  pageSize = 30
  startIndex = 0
  lastIndex = 30
  deisgnationsCount = 0
  private apiSubscription: Subscription | undefined
  designationsImportSuccessResponses: any = []
  importedDesignationNames: any = []
  designationsImportFailed: any = []
  frameworkInfo: any = {}
  dialogRef: any
  progressDialogData: any

  constructor(
    private designationsService: DesignationsService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
    this.getFrameWorkDetails()
  }

  ngOnInit() {
    this.configSvc = this.activateRoute.snapshot.data['configService']
    // this.loadDesignations()
    // this.valueChangeSubscription()
    // this.getRoutesData()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loader'].currentValue === false) {
      this.frameworkInfo = this.designationsService.frameWorkInfo
      this.loadDesignations()
      this.valueChangeSubscription()
      this.getRoutesData()
    }
  }

  getFrameWorkDetails() {
    this.frameworkInfo = this.designationsService.frameWorkInfo
    if (this.frameworkInfo === undefined) {
      this.navigateToMyDesignations()
    }
  }

  loadDesignations(searchKey: string = '') {
    this.loaderService.changeLoaderState(true)
    const pageNumber = this.startIndex === 0 ? 0 : this.startIndex / this.pageSize
    const requestParams: any = {
      pageNumber,
      filterCriteriaMap: {
        status: 'Active',
      },
      requestedFields: [],
      pageSize: this.pageSize,
    }
    if (searchKey) {
      requestParams['searchString'] = searchKey
    }

    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
      this.apiSubscription = undefined
    }

    this.apiSubscription = this.designationsService.getIgotMasterDesignations(requestParams).subscribe(
      (result: any) => {
        this.igotDesignationsList = result.formatedDesignationsLsit
        this.deisgnationsCount = result.totalCount
        this.loaderService.changeLoaderState(false)
      },
      (_err: any) => {
        this.loaderService.changeLoaderState(false)
      })
  }

  get getFilteredSelectedList() {
    if (this.searchControl.value) {
      return this.selectedDesignationsList
        .filter((designation: any) =>
          designation.name.toLowerCase().includes(this.searchControl.value.toLowerCase()))
    }
    return this.selectedDesignationsList
  }

  valueChangeSubscription() {
    if (this.searchControl) {
      this.searchControl.valueChanges.pipe(delay(500)).subscribe((value: string) => {
        this.loadDesignations(value)
      })
    }
  }

  getRoutesData() {
    this.activateRoute.data.subscribe(data => {
      this.designationConfig = data.pageData.data
    })
  }

  selectDesignation(index: number) {
    const designation = this.igotDesignationsList[index]
    if (designation && !designation.isOrgDesignation) {
      const checked = designation['selected'] !== true ? true : false
      if (checked) {
        designation['selected'] = true
        this.selectedDesignationsList.push(designation)
        this.designationsService.updateSelectedDesignationList(this.selectedDesignationsList)
      } else {
        this.removeDesignation([designation])
      }
    }
  }

  get selctedDesignationsCount() {
    return this.selectedDesignationsList.length
  }

  removeDesignation(designationToRemoveList: any[]) {
    designationToRemoveList.forEach((designationToRemove: any) => {
      this.selectedDesignationsList = this.selectedDesignationsList
        .filter((selectedDesignation: any) => selectedDesignation.id !== designationToRemove.id)
      this.designationsService.updateSelectedDesignationList(this.selectedDesignationsList)

      const igotListIndex = this.igotDesignationsList
        .findIndex((designation: any) => designation.id === designationToRemove.id)
      if (igotListIndex >= 0) {
        const designation = this.igotDesignationsList[igotListIndex]
        designation['selected'] = false
        // this.displayList.splice(igotListIndex, 1)
        // this.displayList.splice(this.selctedDesignationsCount, 0, designation)
      }
    })

  }

  openPreviewPoup() {
    const dialogData = JSON.parse(JSON.stringify(this.selectedDesignationsList))
    const dialogRef = this.dialog.open(SelectedDesignationPopupComponent, {
      disableClose: true,
      data: dialogData,
      autoFocus: false,
      maxHeight: '90vh',
      width: '90%',
    })
    dialogRef.afterClosed().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        // this.selectedDesignationsList
        this.removeDesignation(res)
      }
    })
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = pe.pageIndex * pe.pageSize
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize
    this.pageSize = pe.pageSize
    this.loadDesignations(this.searchControl.value)
  }

  importDesignations() {
    this.openProcessingBox()
    if (this.selctedDesignationsCount) {
      this.openProcessingBox()

      const currentDate = this.datePipe.transform(new Date(), 'dd MMM, yyyy')
      const orgCategorie = _.get(this.frameworkInfo, 'categories', [])
        .find((category: any) => category.code === 'org')
      const observables = this.selectedDesignationsList.map((selectedDesignation: any) => {
        const requestBody = {
          name: selectedDesignation.designation,
          code: this.designationsService.getUuid,
          description: selectedDesignation.description,
          refId: selectedDesignation.id,
          refType: 'designation',
          category: 'designation',
          status: 'Live',
          framework: _.get(this.frameworkInfo, 'code'),
          additionalProperties: {
            importedByName: _.get(this.configSvc, 'userProfileV2.firstName'),
            importedById: _.get(this.configSvc, 'userProfileV2.userId'),
            importedOn: currentDate,
            previousCategoryCode: _.get(orgCategorie, 'terms[0].category'),
            previousTermCode: _.get(orgCategorie, 'terms[0].code'),
            timeStamp: new Date().getTime() + 1,
          },
        }
        this.designationsImportSuccessResponses =
          _.get(this.frameworkInfo, 'categories[0].terms[0].associations', []).map((c: any) => {
            return c.identifier ? { identifier: c.identifier } : null
          })
        return this.designationsService.createTerm(requestBody).pipe(
          map((response: any) => {
            this.designationsImportSuccessResponses.push({ identifier: _.get(response, 'result.node_id[0]') })
            this.importedDesignationNames.push(selectedDesignation.designation)
            return response
          }),
          catchError((error: any) => {
            this.designationsImportFailed.push({ error, designation: selectedDesignation })
            return of(null)
          })
        )
      })

      forkJoin(observables).subscribe({
        next: (response: any) => {
          if (response) {
            this.updateTerms(orgCategorie)
          }
        },
        error: () => {
          this.dialogRef.close()
          const errorMessage = _.get(this.designationConfig, 'internalErrorMsg')
          this.openSnackbar(errorMessage, 2000, 'error')
        },
      })
    }
  }

  updateTerms(orgCategorie: any, retry = false) {
    if (this.selectedDesignationsList.length === this.designationsImportFailed.length) {
      this.dialogRef.close(false)
      const errorMessage = _.get(this.designationConfig, 'internalErrorMsg')
      this.openSnackbar(errorMessage, 2000, 'error')
      this.designationsImportFailed = []
    } else {
      if (!retry) {
        this.progressDialogData['subTitle'] = _.get(this.designationConfig, 'associationUpdateMsg')
      }
      const framework = _.get(this.frameworkInfo, 'code')
      const category = _.get(orgCategorie, 'terms[0].category')
      const categoryTermCode = _.get(orgCategorie, 'terms[0].code')
      const requestBody = {
        request: {
          term: {
            associations: this.designationsImportSuccessResponses,
          },
        },
      }
      this.designationsService.updateTerms(framework, category, categoryTermCode, requestBody).subscribe({
        next: response => {
          if (response) {
            this.publishFrameWork()
          }
        },
        error: () => {
          if (retry) {
            const errorMessage = _.get(this.designationConfig, 'internalErrorMsg')
            this.dialogRef.close()
            this.openSnackbar(errorMessage, 2000, 'error')
          } else {
            this.progressDialogData['subTitle'] = _.get(this.designationConfig, 'associationRetryMsg')
            const traiagain = true
            this.updateTerms(orgCategorie, traiagain)
          }
        },
      })
    }
  }

  publishFrameWork() {
    const frameworkName = _.get(this.frameworkInfo, 'code')
    this.progressDialogData['subTitle'] = _.get(this.designationConfig, 'publishingMsg')
    this.designationsService.publishFramework(frameworkName).subscribe({
      next: response => {
        if (response) {
          // setTimeout(() => {
          //   this.dialogRef.close(true)
          // },         _.get(this.designationConfig, 'refreshDelayTime', 10000))
          const refreshTime = ((this.designationsImportSuccessResponses.length / 2) * 1000) >= 10000 ?
            (this.designationsImportSuccessResponses.length / 2) * 1000 : 10000
          setTimeout(() => {
            this.dialogRef.close(true)
          }, refreshTime)

        }
      },
      error: () => {
        const errorMessage = _.get(this.designationConfig, 'internalErrorMsg')
        this.dialogRef.close()
        this.openSnackbar(errorMessage, 2000, 'error')
      },
    })
  }

  openProcessingBox() {
    this.progressDialogData = {
      type: 'progress',
      icon: 'vega',
      title: _.get(this.designationConfig, 'importingDesignation'),
      subTitle: _.get(this.designationConfig, 'termCreationMsg'),
      showLoader: true,
    }
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: this.progressDialogData,
      autoFocus: false,
      panelClass: 'info-dialog',

    })

    this.dialogRef.afterClosed().subscribe((res: boolean = false) => {
      if (res) {
        this.openConforamtionPopup()
      }
    })
  }

  openConforamtionPopup() {
    if (this.designationsImportFailed.length > 0) {
      const descriptions = []
      const designationNames = this.designationsImportFailed.map((e: any) => e.designation.designation).join(', ')
      const description = {
        header: 'The following designations could not be imported at the moment. Please retry after some time.',
        headerClass: 'flex items-center justify-center text-blue',
        messages: [
          {
            msgClass: '',
            msg: `${designationNames}`,
          },
        ],
      }
      descriptions.push(description)
      const dialogData = {
        descriptions,
        dialogType: 'warning',
        footerClass: 'items-center justify-center',
        buttons: [
          {
            btnText: 'ok',
            btnClass: 'btn-full-success',
            response: true,
          },
        ],
      }

      const dialogRef = this.dialog.open(ConformationPopupDesignationComponent, {
        data: dialogData,
        autoFocus: false,
        // width: '500px',
        panelClass: 'info-dialog',
        disableClose: true,
      })
      dialogRef.afterClosed().subscribe(() => {
        if (this.importMasterflag) {
          this.router.navigate(['/app/home/directory/organisation'])
        }
        else {
          this.navigateToMyDesignations()
        }
      })
    } else {
      setTimeout(() => {
        const successMessage = _.get(this.designationConfig, 'successMsg')
        this.openSnackbar(successMessage, 10000, 'success')
        this.dialog.closeAll()
        if (this.importMasterflag) {
          this.router.navigate(['/app/home/directory/organisation'])
        } else {
          this.navigateToMyDesignations()
        }
      }, 4000)

    }
  }

  navigateToMyDesignations() {
    // this.route.navigateByUrl('app/home/org-designations')
    this.closeComponent.emit(false)
  }

  private openSnackbar(primaryMsg: any, duration: number = 5000, type?: string) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
      panelClass: [type ? type : '']
    })
  }

  ngOnDestroy(): void {
    this.designationsService.updateSelectedDesignationList([])
    this.loaderService.changeLoaderState(false)
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe()
    }
  }
}
