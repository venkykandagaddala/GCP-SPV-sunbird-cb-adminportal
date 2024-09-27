import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'ddMMYYYYFormat',
})
export class ReverseDateFormatPipe implements PipeTransform {

  transform(value: any): any {
    let dateString
    if (value.includes("-")) {
      dateString = value.split("-")
      let dd = dateString[2]
      let mm = dateString[1]
      let yy = dateString[0]
      return `${dd}-${mm}-${yy}`
    }


  }

}
