import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

const API_END_POINTS = {
  CREATE_CONTENTPARTNER: `/apis/proxies/v8/contentpartner/v1/create`,
  GET_PROVIDERS_LIST: `/apis/proxies/v8/contentpartner/v1/search`,
  GET_PROVIDER_DETAILS: (id: string) => `/apis/proxies/v8/contentpartner/v1/read/${id}`,
  GET_CONTENT_LIST: `/apis/proxies/v8/ciosIntegration/v1/readAllContentFromDb`,
  GET_FILES_LIST: ``
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  selectedCourse: any

  constructor(
    private http: HttpClient
  ) { }

  createProvider(formBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_CONTENTPARTNER}`, formBody)
  }

  getProvidersList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_PROVIDERS_LIST}`, formBody)
  }

  getProviderDetails(id: string) {
    return this.http.get(API_END_POINTS.GET_PROVIDER_DETAILS(id))
  }

  getContentList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_FILES_LIST}`, formBody)
  }

  getCoursesList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_CONTENT_LIST}`, formBody)
  }

  setSelectedCourse(course: any) {
    this.selectedCourse = course
  }

  get getSelectedCourse() {
    return this.selectedCourse
  }
}
