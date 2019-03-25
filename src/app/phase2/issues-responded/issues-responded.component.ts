import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {IssueService} from '../../core/services/issue.service';
import {MatPaginator, MatSort} from '@angular/material';
import {ErrorHandlingService} from '../../core/services/error-handling.service';
import {IssuesDataTable} from '../../shared/data-tables/IssuesDataTable';
import {Issue} from '../../core/models/issue.model';
import {RespondType} from '../../core/models/comment.model';
import {UserService} from '../../core/services/user.service';
import {UserRole} from '../../core/models/user.model';

@Component({
  selector: 'app-issues-responded',
  templateUrl: './issues-responded.component.html',
  styleUrls: ['./issues-responded.component.css']
})
export class IssuesRespondedComponent implements OnInit, OnChanges {
  issuesDataSource: IssuesDataTable;
  displayedColumns: string[];

  @Input() teamFilter: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private issueService: IssueService, private errorHandlingService: ErrorHandlingService, private userService: UserService) {
    if (userService.currentUser.role === UserRole.Student) {
      this.displayedColumns = ['id', 'title', 'type', 'severity', 'responseTag', 'assignees'];
    } else {
      this.displayedColumns = ['id', 'title', 'teamAssigned', 'type', 'severity', 'responseTag', 'assignees'];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.teamFilter.isFirstChange()) {
      this.issuesDataSource.teamFilter = changes.teamFilter.currentValue;
    }
  }

  ngOnInit() {
    const filter = (issue: Issue): boolean => {
      return this.issueService.hasResponse(issue.id, RespondType.teamResponse);
    };
    this.issuesDataSource = new IssuesDataTable(this.issueService, this.errorHandlingService, this.sort,
      this.paginator, this.displayedColumns, filter);
    this.issuesDataSource.loadIssues();
  }

  applyFilter(filterValue: string) {
    this.issuesDataSource.filter = filterValue;
  }
}