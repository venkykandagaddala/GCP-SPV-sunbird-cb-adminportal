import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'ws-app-via-api-params-table',
  templateUrl: './via-api-params-table.component.html',
  styleUrls: ['./via-api-params-table.component.scss']
})
export class ViaApiParamsTableComponent implements OnInit {
  //#region (global varialbles)
  //#region (view chaild, input and output)
  @Input() tableListFormGroup?: FormGroup
  @Input() paramsHeader: string = 'Query Params'
  //#endregion
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.addParams()
  }

  get tableList(): FormArray {
    return this.tableListFormGroup!.get('tableListFormArray') as FormArray
  }

  addParams(): void {
    const nameGroup = this.formBuilder.group({
      key: [''],
      value: [''],
      description: ['']
    })

    this.tableList.push(nameGroup)
  }

  onParamInput(index: number) {
    if (index + 1 === this.tableList.controls.length) {
      this.addParams()
    }
  }

}
