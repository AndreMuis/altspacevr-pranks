import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Launch {
    static readonly planeResourceId = "artifact: 989569425642356944"
    static readonly planeScale = new MRESDK.Vector3 (3, 0, 3)

    static readonly riseDurationInSeconds = 2.0
    static readonly totalDurationInSeconds = 5.0
    static readonly height = 40.0

    private interval: NodeJS.Timeout

    constructor(private context: MRESDK.Context) {
    }

    public async start(user: User) {
        user.isLaunched = true

        let startPosition = new MRESDK.Vector3(
            user.launchLocationActor.transform.app.position.x,
            -2, 
            user.launchLocationActor.transform.app.position.z)

        user.launchPlaneActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Launch.planeResourceId,
            actor: {
                appearance: {
                    enabled: true
                },
                transform: {
                    local : {
                        scale: Launch.planeScale
                    },
                    app: {
                        position: startPosition
                    }
                }
            }
        })

        user.launchPlaneActor.createAnimation('rise', {
            keyframes: this.getRiseAnimationKeyFrames(startPosition),
            events: []
        })
        
        user.launchPlaneActor.enableAnimation("rise")

        this.interval = setTimeout(() => {
            user.launchPlaneActor.destroy()
        }, Launch.riseDurationInSeconds * 1000)    

        this.interval = setTimeout(() => {
            user.isLaunched = false
        }, Launch.totalDurationInSeconds * 1000)    
    }
    
    private getRiseAnimationKeyFrames(startPosition: MRESDK.Vector3) {
        let keyframes: MRESDK.AnimationKeyframe[] = [{
            time: 0,
            value: { transform: { local: { position: startPosition } } }
        }, {
            time: Launch.riseDurationInSeconds,
            value: { transform: { local: { position: new MRESDK.Vector3(startPosition.x, Launch.height, startPosition.z) } } }
        }]

        return keyframes
    }
}

