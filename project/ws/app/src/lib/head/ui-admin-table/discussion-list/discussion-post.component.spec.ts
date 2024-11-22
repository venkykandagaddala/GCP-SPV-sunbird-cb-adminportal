
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Component,OnInit,Input,Output,EventEmitter,ViewChild,OnChanges,SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { _ } from 'lodash';
import { RejectPublishService } from '../reject-publish.service';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from '@sunbird-cb/utils';
import { DialogTextProfanityComponent } from './discussion-post-popup.component';

describe('UIDiscussionPostComponent', () => {
    let component: UIDiscussionPostComponent;

    const logger :Partial<LoggerService> ={};
	const discussion :Partial<RejectPublishService> ={};
	const dialog :Partial<MatDialog> ={};

    beforeAll(() => {
        component = new UIDiscussionPostComponent(
            logger as LoggerService,
			discussion as RejectPublishService,
			dialog as MatDialog
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
});