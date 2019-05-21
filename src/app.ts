import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { HUD } from './HUD'
import { Vector3 } from '@microsoft/mixed-reality-extension-sdk';

export default class App {
    private users: Array<User> = []

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())

        this.context.onUserJoined((user) => this.userJoined(user))        
        this.context.onUserLeft((user) => this.userLeft(user))        
    }

    private async started() {
    }

    private userJoined = async (mreUser: MRESDK.User) => {


        let actor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact: 989569425642356944",
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: 0, z: 0 },
                        scale: { x: 3, y: 0, z: 3 } 
                    }
                },
                attachment: {
                    userId: mreUser.id,
                    attachPoint: 'hips'
                }
    
                }
        }).value

        await actor.createAnimation('rise', {
            wrapMode: MRESDK.AnimationWrapMode.Loop,
            keyframes: this.riseAnimationKeyFrames,
            events: []
        })
        
        //actor.enableAnimation("rise")



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

    private riseAnimationKeyFrames: MRESDK.AnimationKeyframe[] = [{
        time: 0,
        value: { transform: { local: { position: new Vector3(0, -1.3, 0) } } }
    },{
        time: 3,
        value: { transform: { local: { position: new Vector3(0, -1.3, 0) } } }
    }, {
        time: 3.5,
        value: { transform: { local: { position: new Vector3(0, 10, 0) } } }
    }]
}
