
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core'
import { Router, Event, NavigationEnd, NavigationError, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { EventService, TelemetryService, UtilityService, ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { _ } from 'lodash'
import { ILeftMenu, LeftMenuService } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { Subscription } from 'rxjs'
import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
    let component: HomeComponent

    const valueSvc: Partial<ValueService> = {}
    const router: Partial<Router> = {}
    const activeRoute: Partial<ActivatedRoute> = {}
    const telemetrySvc: Partial<TelemetryService> = {}
    const events: Partial<EventService> = {}
    const utilitySvc: Partial<UtilityService> = {}
    const leftMenuService: Partial<LeftMenuService> = {}

    beforeAll(() => {
        component = new HomeComponent(
            valueSvc as ValueService,
            router as Router,
            activeRoute as ActivatedRoute,
            telemetrySvc as TelemetryService,
            events as EventService,
            utilitySvc as UtilityService,
            leftMenuService as LeftMenuService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create a instance of component', () => {
        expect(component).toBeTruthy()
    })
})
