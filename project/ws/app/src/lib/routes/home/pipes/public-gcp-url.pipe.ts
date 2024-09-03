import { Pipe, PipeTransform } from '@angular/core'
import { environment } from '../../../../../../../../src/environments/environment'
// import { environment } from '../../../../../../../../src/environments/environment'

@Pipe({
  name: 'publicGcpUrl',
})
export class PublicGcpUrlPipe implements PipeTransform {
  transform(url: string): string {
    const originalUrlPart = 'https://storage.googleapis.com/igotuat'
    const replacementUrlPart = `${environment.contentHost}/assets/public`
    if (url.includes(originalUrlPart)) {
      return url.replace(originalUrlPart, replacementUrlPart)
    }

    return url // If the original string is not found, return the original URL

  }
}
