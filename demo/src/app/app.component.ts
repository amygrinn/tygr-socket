import { Component } from '@angular/core';

import { Store } from '@tygr/core';
import { SocketService } from '@tygr/socket/dist/client/socket.service';
import { SocketActions } from '@tygr/socket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private store: Store, private socketService: SocketService) {
    console.log(store.getState());
    //store.dispatch(new SocketActions.ServerConnect());
  }
}
