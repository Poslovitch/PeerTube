import { from } from 'rxjs'
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core'
import { Notifier, UserService } from '@app/core'
import { FormReactive, FormValidatorService } from '@app/shared/shared-forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref'
import { User } from '@shared/models'
import { USER_BAN_REASON_VALIDATOR } from '../form-validators/user-validators'
import { BlocklistService } from './blocklist.service'
import { Account } from '../shared-main'

@Component({
  selector: 'my-user-ban-modal',
  templateUrl: './user-ban-modal.component.html',
  styleUrls: [ './user-ban-modal.component.scss' ]
})
export class UserBanModalComponent extends FormReactive implements OnInit {
  @ViewChild('modal', { static: true }) modal: NgbModal
  @Output() userBanned = new EventEmitter<User | User[]>()

  private usersToBan: User | User[]
  private openedModal: NgbModalRef

  constructor (
    protected formValidatorService: FormValidatorService,
    private modalService: NgbModal,
    private notifier: Notifier,
    private userService: UserService,
    private blocklistService: BlocklistService
  ) {
    super()
  }

  ngOnInit () {
    this.buildForm({
      reason: USER_BAN_REASON_VALIDATOR,
      mute: null
    })
  }

  openModal (user: User | User[]) {
    this.usersToBan = user
    this.openedModal = this.modalService.open(this.modal, { centered: true })
  }

  hide () {
    this.usersToBan = undefined
    this.openedModal.close()
  }

  async banUser () {
    const reason = this.form.value['reason'] || undefined
    const mute = this.form.value['mute']

    this.userService.banUsers(this.usersToBan, reason)
      .subscribe(
        () => {
          const message = Array.isArray(this.usersToBan)
            ? $localize`${this.usersToBan.length} users banned.`
            : $localize`User ${this.usersToBan.username} banned.`

          this.notifier.success(message)

          this.userBanned.emit(this.usersToBan)
          this.hide()
        },

          err => this.notifier.error(err.message)
      )

      if (mute) {
        const users = Array.isArray(this.usersToBan) ? this.usersToBan : [ this.usersToBan ]
        console.log(users)
        users.forEach(user => {
          const account = new Account(user.account) // Does this make this account... different?
          this.blocklistService.blockAccountByInstance(account)
            .subscribe(
              () => {
                this.notifier.success($localize`Account ${account.nameWithHost} muted by the instance.`)
                account.mutedByInstance = true
              },

              err => this.notifier.error(err.message)
          )
        });
      }
  }
}
