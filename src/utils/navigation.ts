import { type ObjectId } from 'types'
import { isObjectId } from 'utils'

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

    public static fileURL(fileId: ObjectId | null, storyId: ObjectId | null = null): URL {
        let page = 'story'
        if (storyId == null) {
            const expr = /\/([A-z]+)\/([^/?]+)/i
            const match = expr.exec(location.pathname)
            if (match != null && isObjectId(match[2])) {
                page = match[1]
                storyId = match[2]
            }
        }
        if (storyId === null) {
            return new URL(location.origin + this.StoryPath)
        }
        if (fileId === null) {
            return this.storyURL(storyId)
        }
        if (page === 'view') { return new URL(`${location.origin}/${page}/${String(fileId)}`) }
        return new URL(location.origin + this.filePath(fileId, storyId) + location.search)
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
