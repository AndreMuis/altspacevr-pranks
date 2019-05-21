import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'
require('@microsoft/mixed-reality-extension-sdk/built/protocols/protocol').DefaultConnectionTimeoutSeconds = 0

import { User } from './common'

export class Fart {
    static readonly fartCloudResourceId = "artifact: 1209665568215400791"
    static readonly durationInMilliseconds = 7000 

    private interval: NodeJS.Timeout

    private fartSoundAsset: MRESDK.Sound

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.setupAssets()
    }

    private async setupAssets() {
        this.fartSoundAsset = await this.context.assetManager.createSound(
            'fartSound',
            { uri: `${this.baseUrl}/fart.wav` }
        )
    }

    public async playSound(user: User) {
        user.isFarting = true

        user.fartSoundActor = await MRESDK.Actor.CreatePrimitive(this.context, {
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
        })

        await user.fartSoundActor.startSound(this.fartSoundAsset.id, {
            volume: 1.0,
            looping: false,
            doppler: 0.0,
            spread: 0.0,
            rolloffStartDistance: 2.0
        },
        0.0)

        user.fartCloudActor = await MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Fart.fartCloudResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: 0.05, z: -0.4 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -110 * MRESDK.DegreesToRadians),
                        scale: { x: 0.55, y: 0.55, z: 0.55 }
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
            }
        })

        this.interval = setTimeout(() => {
            user.isFarting = false
            user.fartSoundActor.destroy()
            user.fartCloudActor.destroy()
        }, Fart.durationInMilliseconds)
    }
}

