import { Component } from '@angular/core'

@Component({
  selector: 'my-play-all-videos-button',
  templateUrl: './my-play-all-videos-button.component.html',
  styleUrls: [ './my-play-all-videos-button.component.scss' ]
})
export class PlayAllVideosButtonComponent {
  playAllVideos() {
    console.log("Hello!")
  }
}
