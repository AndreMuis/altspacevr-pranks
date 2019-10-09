import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Helmet {
    static readonly pumpkinResourceId = "artifact: 1049499012731764738"

    static readonly durationInSeconds = 5.0

    private interval: NodeJS.Timeout

    constructor(private context: MRESDK.Context) {
    }

    public async attach(user: User) {
        user.isHelmetAttached = true

        user.helmetActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Helmet.pumpkinResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0.0, y: -0.3, z: 0.0 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), 180 * MRESDK.DegreesToRadians),
                        scale: { x: 1, y: 1, z: 1 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                },
            }
        })

        this.interval = setTimeout(() => {
            user.helmetActor.destroy()
            user.isHelmetAttached = false
        }, Helmet.durationInSeconds * 1000)    
    }
}

