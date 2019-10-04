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

    constructor(public id: string, public name: string) {
        this.hud = null

        this.isFarting = false
        this.fartSoundActor = null
        this.fartCloudActor = null

        this.isBlackedOut = false
        this.blackoutOutwardFacingCubeActor = null
        this.blackoutInwardFacingCubeActor = null
    }
}   
