import { SortMeta } from 'primeng/api'
import { Subject } from 'rxjs'
import { Component, OnInit } from '@angular/core'
import { ComponentPagination, hasMoreItems, Notifier, RestService } from '@app/core'
import { InstanceFollowService } from '@app/shared/shared-instance'

@Component({
  selector: 'my-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: [ './about-team.component.scss' ]
})
export class AboutTeamComponent implements OnInit {

  ngOnInit () {

  }

}
