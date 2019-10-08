import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { Fart } from './fart'
import { Blackout } from './blackout'
import { Utility } from './utility'
import { Launch } from './launch'

export class HUD {
    static readonly grayColor = new MRESDK.Color3(50.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0)
    static readonly greenColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 0.0 / 255.0)
    static readonly blueColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 255.0 / 255.0)

    static readonly width = 1.2
    static readonly height = 1.0
    static readonly margin = 0.03
    static readonly padding = 0.03

    static readonly headerHeight = 0.06
    static readonly textHeight = 0.05

    private assetContainer: MRESDK.AssetContainer

    private whiteMaterial: MRESDK.Material
    private darkGrayMaterial: MRESDK.Material

    private hudPlaneMesh: MRESDK.Mesh

    private planeActor: MRESDK.Actor 
    private fart: Fart
    private blackout: Blackout
    private launch: Launch

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.fart = new Fart(context, baseUrl)
        this.blackout = new Blackout(context)
        this.launch = new Launch(context)

        this.setupAssets()
    }

    private setupAssets() {
        this.assetContainer = new MRESDK.AssetContainer(this.context)

        this.whiteMaterial = this.assetContainer.createMaterial('white', {
            color: MRESDK.Color3.FromInts(255, 255, 255)
        })

        this.darkGrayMaterial = this.assetContainer.createMaterial('gray', {
            color: MRESDK.Color3.FromInts(200, 200, 200)
        })

        this.hudPlaneMesh = this.assetContainer.createPlaneMesh('plane', HUD.width, HUD.height, 1, 1)
    }

    public async attachTo(user: User) {
        user.hud = this

        this.planeActor = MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: this.hudPlaneMesh.id,
                    materialId: this.whiteMaterial.id
                },
                transform: { 
                    local: {
                        position: { x: 0, y: 0, z: 1 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
                exclusiveToUser: user.id
            }
        })
    }

    public async update(users: Array<User>) {
        for (let actor of this.planeActor.children) {
            actor.destroy()
        }

        await this.addTextToHUD(this.planeActor, HUD.margin, HUD.margin, "User", HUD.grayColor, true)
        await this.addTextToHUD(this.planeActor, HUD.margin + 0.4, HUD.margin, "Actions", HUD.grayColor, true)

        for (let index = 0; index < users.length; index = index + 1) {
            let user = users[index]

            let y = HUD.margin + (index + 1) * (HUD.textHeight + HUD.padding)

            await this.addTextToHUD(this.planeActor, HUD.margin, y, Utility.truncate(user.name, 13), HUD.greenColor, false)

            let fartBoxActor = await this.addButtonToHUD(this.planeActor, HUD.margin + 0.4, y, 0.15, "fart")
            
            const fartBoxButtonBehavior = fartBoxActor.setBehavior(MRESDK.ButtonBehavior)
            fartBoxButtonBehavior.onButton('pressed', async (mreUser: MRESDK.User) => {
                if (user.isFarting == false) {
                    await this.fart.playSound(user)
                }
            })

            let blackoutBoxActor = await this.addButtonToHUD(this.planeActor, HUD.margin + 0.6, y, 0.27, "blackout")
            
            const blackoutBoxButtonBehavior = blackoutBoxActor.setBehavior(MRESDK.ButtonBehavior)
            blackoutBoxButtonBehavior.onButton('pressed', async (mreUser: MRESDK.User) => {
                if (user.isBlackedOut == false) {
                    await this.blackout.drawPlane(user)
                }
            })

            let launchBoxActor = await this.addButtonToHUD(this.planeActor, HUD.margin + 0.9, y, 0.2, "launch")
            
            const launchBoxButtonBehavior = launchBoxActor.setBehavior(MRESDK.ButtonBehavior)
            launchBoxButtonBehavior.onButton('pressed', async (mreUser: MRESDK.User) => {
                if (user.isLaunched == false) {
                    await this.launch.start(user)
                }
            })
        }
    }

    private addButtonToHUD(hudPlane: MRESDK.Actor, x: number, z: number, width: number, contents: string): MRESDK.Actor {
        let boxActor = MRESDK.Actor.Create(this.context, {
            actor: {
                parentId: hudPlane.id,
                appearance: {
                    meshId: this.assetContainer.createBoxMesh(`box`, width, 0.0, HUD.textHeight + 0.01).id,
                    materialId: this.darkGrayMaterial.id
                },
                collider: { geometry: { shape: 'auto' } },
                transform: {
                    local: {
                        position: { 
                            x: -HUD.width / 2.0 + width / 2.0 + x,
                            y: 0.001, 
                            z: HUD.height / 2.0 - HUD.textHeight / 2.0 - 0.005 - z }
                    }
                }
            }
        })

        MRESDK.Actor.Create(this.context, {
            actor: {
                parentId: boxActor.id,
                transform: {
                    local: {
                        position: { x: 0, y: 0.001, z: 0 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                    }
                },
                text: {
                    contents: contents,
                    color: HUD.blueColor,
                    height: HUD.textHeight,
                    anchor: MRESDK.TextAnchorLocation.MiddleCenter
                }
            }
        })

        return boxActor
    }

    private addTextToHUD(hudPlane: MRESDK.Actor, x: number, y: number, contents: string, color: MRESDK.Color3, isHeader: boolean): MRESDK.Actor {
        var height: number = isHeader ? HUD.headerHeight : HUD.textHeight
        
        let textActor = MRESDK.Actor.Create(this.context, {
            actor: {
                parentId: hudPlane.id,
                transform: {
                    local: {
                        position: { 
                            x: -HUD.width / 2.0 + x, 
                            y: 0.01, 
                            z: HUD.height / 2.0 - y },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                    }
                },
                text: {
                    contents: contents,
                    color: color,
                    height: height
                }
            }
        })

        return textActor
    }
}
