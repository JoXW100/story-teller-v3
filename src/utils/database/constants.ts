import type { ValueOf } from 'types'

export interface IDatabaseCollectionData {
    main: string
    backup: string
    temp: string
    test: string
}

export const Collections = {
    _document: {
        main: '_document',
        backup: '_document_backup',
        temp: '_document_temp',
        test: '_document_test'
    } as const,
    _story: {
        main: '_story',
        backup: '_story_backup',
        temp: '_story_temp',
        test: '_story_test'
    } as const,
    files: {
        main: 'files',
        backup: 'files_backup',
        temp: 'files_temp',
        test: 'files_test'
    } as const,
    stories: {
        main: 'stories',
        backup: 'stories_backup',
        temp: 'stories_temp',
        test: 'stories_test'
    } as const
} satisfies Record<string, IDatabaseCollectionData>

export type CollectionName = ValueOf<typeof Collections>['main']
