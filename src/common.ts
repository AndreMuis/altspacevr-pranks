import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { HUD } from './HUD'

export class User {
    public hud: HUD

    public isFarting: boolean
    public fartSoundActor: MRESDK.Actor
    public fartCloudActor: MRESDK.Actor

    public isBlackedOut: boolean
    public blackoutOutwardFacingCubeActor: MRESDK.Actor
    public blackoutInwardFacingCubeActor: MRESDK.Actor

    public isLaunched: boolean
    public launchLocationActor: MRESDK.Actor
    public launchPlaneActor: MRESDK.Actor

    public isHelmetAttached: boolean
    public helmetActor: MRESDK.Actor

    constructor(context: MRESDK.Context, public id: string, public name: string) {
        this.hud = null

        this.isFarting = false
        this.fartSoundActor = null
        this.fartCloudActor = null

        this.isBlackedOut = false
        this.blackoutOutwardFacingCubeActor = null
        this.blackoutInwardFacingCubeActor = null

        this.isLaunched = false
        
        this.launchLocationActor = MRESDK.Actor.Create(context, {
            actor: {
                attachment: {
                    userId: id,
                    attachPoint: 'hips'
                }
            }
        })
        this.launchLocationActor.subscribe('transform')

        this.launchPlaneActor = null

        this.isHelmetAttached = false
        this.helmetActor = null
    }
}   
