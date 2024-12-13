import { asObjectId } from 'utils'
import type { ObjectId } from 'types'

const Navigation = {
    LoginAPI: '/api/auth/login' as const,
    LogoutAPI: '/api/auth/logout' as const,
    LoginPath: '/login' as const,
    SettingsPath: '/settings' as const,
    StoryPath: '/story' as const,
    StoriesPath: '/stories' as const,
    CreateStoryPath: '/create-story' as const,
    EditStoryPath: '/edit-story' as const,

    homeURL(): URL {
        return new URL(location.origin)
    },

    pageURL(path?: string): URL {
        if (path === undefined) {
            return this.homeURL()
        }
        return new URL(location.origin + path)
    },

    loginPath(returnURL?: string): string {
        if (returnURL === undefined) {
            return this.LoginPath
        }
        return this.LoginPath + '?returnPath=' + returnURL
    },

    loginURL(returnPath?: string): URL {
        return new URL(location.origin + this.loginPath(returnPath))
    },

    settingsPath(returnURL?: string): string {
        if (returnURL === undefined) {
            return this.SettingsPath
        }
        return this.SettingsPath + '?returnPath=' + returnURL
    },

    settingsURL(returnPath?: string): URL {
        return new URL(location.origin + this.settingsPath(returnPath))
    },

    storiesURL(): URL {
        return new URL(location.origin + this.StoriesPath)
    },

    createStoryURL(): URL {
        return new URL(location.origin + this.CreateStoryPath)
    },

    editStoryURL(storyId: ObjectId): URL {
        return new URL(location.origin + this.EditStoryPath + '/' + storyId)
    },

    storyPath(storyId: ObjectId): string {
        return this.StoryPath + '/' + String(storyId)
    },

    storyURL(storyId: ObjectId): URL {
        return new URL(location.origin + this.storyPath(storyId))
    },

    filePath(fileId: ObjectId, storyId: ObjectId): string {
        return this.storyPath(storyId) + '/' + String(fileId)
    },

    fileURL(fileId: ObjectId, storyId: ObjectId | null = null): URL {
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
    },

    editURL(edit: boolean): URL {
        return new URL(location.origin + location.pathname + (edit ? '?edit' : ''))
    },

    viewURL(fileId: ObjectId): URL {
        return new URL(`${location.origin}/view/${String(fileId)}`)
    },

    getCurrentStoryId(): ObjectId | null {
        const result = /^\/story\/([0-9a-fA-F]{24})/.exec(location.pathname)
        if (result !== null) {
            return result[1] as ObjectId
        }
        return null
    },

    getCurrentDocumentId(path?: string): ObjectId | null {
        const result = /^\/story\/[^/]+\/([0-9a-fA-F]{24})/.exec(path ?? location.pathname)
        if (result !== null) {
            return result[1] as ObjectId
        }
        return null
    },

    open5eURL (type: string, itemId: string): URL {
        return new URL(`https://open5e.com/${type}/${itemId}`)
    }
} as const

export default Navigation
