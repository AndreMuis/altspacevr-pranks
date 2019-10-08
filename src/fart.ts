import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

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
        const assetContainer = new MRESDK.AssetContainer(this.context)
        this.fartSoundAsset = await assetContainer.createSound(
            'fartSound',
            { uri: `${this.baseUrl}/fart.wav` }
        )
    }

    public async playSound(user: User) {
        user.isFarting = true

        const assetContainer = new MRESDK.AssetContainer(this.context)
        user.fartSoundActor = MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: assetContainer.createSphereMesh('sphere', 1, 15, 15).id,
                    enabled: false
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.0)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                }
            }
        })

        user.fartSoundActor.startSound(this.fartSoundAsset.id, {
            volume: 1.0,
            looping: false,
            doppler: 0.0,
            spread: 0.0,
            rolloffStartDistance: 2.0
        })

        user.fartCloudActor = MRESDK.Actor.CreateFromLibrary(this.context, {
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

