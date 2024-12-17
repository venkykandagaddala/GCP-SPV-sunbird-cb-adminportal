import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/departmentType/',
  CREATE_DEPARTMENT: '/apis/protected/v8/portal/spv/department',
  UPDATE_DEPARTMENT: '/apis/protected/v8/portal/spv/department',
  ASSIGN_ADMIN_TO_CREATED_DEPARTMENT: '/apis/proxies/v8/user/private/v1/assign/role',
  GET_DEPARTMENT_BY_ID: '/apis/protected/v8/portal/deptAction/',
  CUSTOM_SELF_REGISTRATION_QR: '/apis/proxies/v8/customselfregistration',
  REGISTERED_LINKS_LIST: '/apis/proxies/v8/customselfregistration/listallqrs',
}

const DEPARTMENT_NAME = 'igot'

@Injectable({
  providedIn: 'root',
})
export class CreateMDOService {
  constructor(private http: HttpClient) { }
  getAllSubDepartments(deptName: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS}${deptName}`)
  }
  createDepartment(deptData: any, subDept: any): Observable<any> {
    const departmentData = {
      rootOrg: DEPARTMENT_NAME,
      deptName: deptData.name,
      deptTypeInfos: subDept,
      description: '',
      headquarters: deptData.head,
      logo: deptData.fileUpload,
    }
    return this.http.post<any>(`${API_END_POINTS.CREATE_DEPARTMENT}`, departmentData)
  }
  updateDepartment(deptData: any, updateId: number, subDept: any): Observable<any> {
    const departmentData = {
      id: updateId,
      rootOrg: DEPARTMENT_NAME,
      deptName: deptData.name,
      deptTypeIds: subDept,
      description: '',
      headquarters: deptData.head,
      logo: deptData.fileUpload,
    }
    return this.http.patch<any>(`${API_END_POINTS.UPDATE_DEPARTMENT}`, departmentData)
  }
  assignAdminToDepartment(userId: string, deptId: string, deptRole: string): Observable<any> {
    // const departmentData = {
    //   userId,
    //   deptId,
    //   roles: [deptRole],
    //   isActive: true,
    //   isBlocked: false,
    // }
    const departmentData = {

      request: {
        userId,
        organisationId: deptId,
        roles: [
          deptRole,
          'PUBLIC',
        ],
      },
    }
    return this.http.post<any>(`${API_END_POINTS.ASSIGN_ADMIN_TO_CREATED_DEPARTMENT}`, departmentData)
  }

  generateSelfRegistrationQRCode(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CUSTOM_SELF_REGISTRATION_QR}`, request)
  }

  getListOfRegisteedLinks(request: any) {
    return this.http.post<any>(`${API_END_POINTS.REGISTERED_LINKS_LIST}`, request)
  }
}
