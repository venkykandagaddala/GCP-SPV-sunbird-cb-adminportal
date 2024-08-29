import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  CREATE_CONTENTPARTNER: `/apis/proxies/v8/contentpartner/v1/create`,
  GET_PROVIDERS_LIST: `/apis/proxies/v8/contentpartner/v1/search`,
  DELETE_PROVIDER: `/apis/proxies/v8/contentpartner/v1/delete/`,
  GET_PROVIDER_DETAILS: (id: string) => `/apis/proxies/v8/contentpartner/v1/read/${id}`,
  UPLOAD_CONTENT: `/apis/proxies/v8/ciosIntegration/v1/loadContentFromExcel`,
  GET_FILES_LIST: `/apis/proxies/v8/ciosIntegration/v1/file/info/`,
  GET_CONTENT_LIST: `/apis/proxies/v8/ciosIntegration/v1/readAllContentFromDb`,
  DELETE_COURSE: `/apis/proxies/v8/cios/v1/content/delete/`,
  CREATE_RESOURCE: `/apis/proxies/v8/action/content/v3/create`,
  UPLOAD_FILE: `/apis/proxies/v8/upload/action/content/v3/upload/`,
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  selectedCourse: any

  constructor(
    private http: HttpClient,
  ) { }

  createProvider(formBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_CONTENTPARTNER}`, formBody)
  }

  getProvidersList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_PROVIDERS_LIST}`, formBody)
  }

  deleteProvider(providerId: string) {
    return this.http.delete(`${API_END_POINTS.DELETE_PROVIDER}${providerId}`)
  }

  getProviderDetails(id: string) {
    return this.http.get(API_END_POINTS.GET_PROVIDER_DETAILS(id))
  }

  getContentList(providerId: any) {
    return this.http.get(`${API_END_POINTS.GET_FILES_LIST}${providerId}`)
  }

  uploadContent(
    data: FormData,
    partnerName: string
  ): Observable<any> {
    const file = data.get('content') as File
    let fileName = file.name
    const newFormData = new FormData()
    newFormData.append('data', file, fileName)
    const formBody = {
      file: newFormData,
      partnerName
    }
    const url = `${API_END_POINTS.UPLOAD_CONTENT}`
    return this.http.post<any>(
      url,
      formBody,
    )
  }

  getCoursesList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_CONTENT_LIST}`, formBody)
  }

  deleteCourse(courseId: string) {
    return this.http.delete(`${API_END_POINTS.DELETE_COURSE}${courseId}`)
  }

  setSelectedCourse(course: any) {
    this.selectedCourse = course
  }

  createResource(req: any) {
    return this.http.post<null>(
      `${API_END_POINTS.CREATE_RESOURCE}`,
      req,
    )
  }

  upload(
    data: FormData,
    contentId: any,
    options?: any
  ): Observable<any> {
    const file = data.get('content') as File
    let fileName = file.name
    const newFormData = new FormData()
    newFormData.append('data', file, fileName)
    const url = `${API_END_POINTS.UPLOAD_FILE}${contentId}`
    return this.http.post<any>(
      url,
      newFormData,
      options,
    )
  }

  get getSelectedCourse() {
    return this.selectedCourse
  }
}
