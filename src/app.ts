import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { HUD } from './HUD'

export default class App {
    private users: Array<User> = []

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())

        this.context.onUserJoined((user) => this.userJoined(user))        
        this.context.onUserLeft((user) => this.userLeft(user))        
    }

    private started() {
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact: 989569229617365197",
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: -1, z: 0 },
                        scale: { x: 10, y: 10, z: 10 } 
                    }
                }
            }
        })
    }

    private userJoined = async (mreUser: MRESDK.User) => {
        let user = new User(mreUser.id, mreUser.name)
        this.users.push(user)

        let hud = new HUD(this.context, this.baseUrl)
        await hud.attachTo(user)

        for (let user of this.users) {
            await user.hud.update(this.users)
        }
    }

    private userLeft = async (mreUser: MRESDK.User) => {
        this.users = this.users.filter(user => user.id != mreUser.id)

        for (let user of this.users) {
            await user.hud.update(this.users)
        }
    }
}
