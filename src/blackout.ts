import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Blackout {
    static readonly outwardFacingCubeResourceId = "artifact: 1210966302131225037"
    static readonly inwardFacingCubeResourceId = "artifact: 1210966307894198735"
    static readonly durationInMilliseconds = 5000 

    private interval: NodeJS.Timeout

    constructor(private context: MRESDK.Context) {
    }

    public async drawPlane(user: User) {
        user.isBlackedOut = true

        user.blackoutOutwardFacingCubeActor = await MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Blackout.outwardFacingCubeResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        scale: { x: 0.50, y: 0.50, z: 0.50 }
                    },
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                }    
            }
        })

        user.blackoutInwardFacingCubeActor = await MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Blackout.inwardFacingCubeResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        scale: { x: 0.49, y: 0.49, z: 0.49 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                }
            }
        })

        this.interval = setTimeout(() => {
            user.isBlackedOut = false
            user.blackoutOutwardFacingCubeActor.destroy()
            user.blackoutInwardFacingCubeActor.destroy()
        }, Blackout.durationInMilliseconds)
    }
}

