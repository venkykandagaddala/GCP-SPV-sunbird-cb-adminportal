import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { MatTableDataSource } from '@angular/material'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-courses-table',
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.scss']
})
export class CoursesTableComponent implements OnInit, OnChanges {
  @Input() tableData!: any
  @Input() data?: []
  @Input() length = 20
  @Output() actionsClick = new EventEmitter<any>()
  @Output() searchKey = new EventEmitter<string>()

  displayedColumns: any
  dataSource!: any
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  columnsList: any = []
  allSelected = false
  selectedRowData: any = []
  showDeleteAll = true

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
      this.showDeleteAll = this.tableData.showDeleteAll
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tableData) {
      this.getFinalColumns()
    }
    if (changes.data) {
      this.dataSource.data = this.data
    }
  }

  getFinalColumns() {
    this.columnsList = []
    if (this.tableData.needCheckBox) {
      const selectColumn = { displayName: '', key: 'select', cellType: 'select' }
      this.tableData.columns.splice(0, 0, selectColumn)
    }
    this.columnsList = _.map(this.tableData.columns, c => c.key)
  }

  deleteAllSelected() {
    this.buttonClick('delete', this.selectedRowData)
  }

  buttonClick(action: string, rows: any) {
    if (this.tableData) {
      this.actionsClick.emit({ action, rows })
    }
  }

  applyFilter(searchKey: string) {
    if (this.searchKey) {
      this.searchKey.emit(searchKey)
    }
  }

  selectAll() {
    // this.allSelected = !this.allSelected
    this.selectedRowData = []
    _.get(this.dataSource, 'filteredData', []).forEach((rowData: any) => {
      if (!rowData.isActive) {
        rowData['isChecked'] = this.allSelected
        if (this.allSelected) {
          this.selectedRowData.push(rowData)
        }
      }
    })
  }

  onCheckboxChange(column: any) {
    if (column.isChecked) {
      this.selectedRowData.push(column)
    } else {
      this.selectedRowData = this.selectedRowData.filter((rowData: any) => rowData.id !== column.id)
    }
  }

}
