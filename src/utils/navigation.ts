import { asObjectId } from 'utils'
import type { ObjectId } from 'types'

abstract class Navigation {
    public static readonly LoginAPI: string = '/api/auth/login'
    public static readonly LogoutAPI: string = '/api/auth/logout'
    public static readonly LoginPath: string = '/login'
    public static readonly SettingsPath: string = '/settings'
    public static readonly StoryPath: string = '/story'
    public static readonly StoriesPath: string = '/stories'
    public static readonly CreateStoryPath: string = '/create-story'
    public static readonly EditStoryPath: string = '/edit-story'

    public static homeURL(): URL {
        return new URL(location.origin)
    }

    public static pageURL(path?: string): URL {
        if (path === undefined) {
            return this.homeURL()
        }
        return new URL(location.origin + path)
    }

    public static loginPath(returnURL?: string): string {
        if (returnURL === undefined) {
            return this.LoginPath
        }
        return this.LoginPath + '?returnPath=' + returnURL
    }

    public static loginURL(returnPath?: string): URL {
        return new URL(location.origin + this.loginPath(returnPath))
    }

    public static settingsPath(returnURL?: string): string {
        if (returnURL === undefined) {
            return this.SettingsPath
        }
        return this.SettingsPath + '?returnPath=' + returnURL
    }

    public static settingsURL(returnPath?: string): URL {
        return new URL(location.origin + this.settingsPath(returnPath))
    }

    public static storiesURL(): URL {
        return new URL(location.origin + this.StoriesPath)
    }

    public static createStoryURL(): URL {
        return new URL(location.origin + this.CreateStoryPath)
    }

    public static editStoryURL(storyId: ObjectId): URL {
        return new URL(location.origin + this.EditStoryPath + '/' + storyId)
    }

    public static storyPath(storyId: ObjectId): string {
        return this.StoryPath + '/' + String(storyId)
    }

    public static storyURL(storyId: ObjectId): URL {
        return new URL(location.origin + this.storyPath(storyId))
    }

    public static filePath(fileId: ObjectId, storyId: ObjectId): string {
        return this.storyPath(storyId) + '/' + String(fileId)
    }

    public static fileURL(fileId: ObjectId, storyId: ObjectId | null = null): URL {
        const parts = location.pathname.split('/')
        const page = parts[1]
        if (page === 'view') {
            return this.viewURL(fileId)
        }

        const currentStoryId = asObjectId(parts[2])
        if (currentStoryId === null) {
            return this.homeURL()
        }

        if (storyId !== null && storyId !== currentStoryId) {
            return this.viewURL(fileId)
        }

        return new URL(location.origin + this.filePath(fileId, storyId ?? currentStoryId) + location.search)
    }

    public static editURL(edit: boolean): URL {
        return new URL(location.origin + location.pathname + (edit ? '?edit' : ''))
    }

    public static viewURL(fileId: ObjectId): URL {
        return new URL(`${location.origin}/view/${String(fileId)}`)
    }

    public static getCurrentStoryId(): ObjectId | null {
        const result = /^\/story\/([0-9a-fA-F]{24})/.exec(location.pathname)
        if (result !== null) {
            return result[1] as ObjectId
        }
        return null
    }

    public static getCurrentDocumentId(path?: string): ObjectId | null {
        const result = /^\/story\/[^\/]+\/([0-9a-fA-F]{24})/.exec(path ?? location.pathname)
        if (result !== null) {
            return result[1] as ObjectId
        }
        return null
    }

    public static open5eURL (type: string, itemId: string): URL {
        return new URL(`https://open5e.com/${type}/${itemId}`)
    }
}

export default Navigation
