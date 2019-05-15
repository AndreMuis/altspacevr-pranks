import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Fart {
    static readonly fartCloudResourceId = "artifact: 1207620075821990676"

    private interval: NodeJS.Timeout

    private fartSoundAsset: MRESDK.Sound

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.fartSoundAsset = this.context.assetManager.createSound(
            'fartSound',
            { uri: `${this.baseUrl}/fart.wav` }
        ).value    
    }

    public playSound(user: User) {
        user.isFarting = true

        user.fartSoundActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere
            },
            actor: {
                appearance: { 
                    enabled: false 
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                }
            }
        }).value

        user.fartSoundActor.startSound(this.fartSoundAsset.id, {
            volume: 1.0,
            looping: false,
            doppler: 0.0,
            spread: 0.0,
            rolloffStartDistance: 1.0
        },
        0.0)

        user.fartCloudActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Fart.fartCloudResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: 0, z: -0.5 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                        scale: { x: 0.03, y: 0.03, z: 0.03 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
            }
        }).value

        this.interval = setTimeout(() => {
            user.isFarting = false
            user.fartSoundActor.destroy()
            user.fartCloudActor.destroy()
        }, 5000)
    }
}

