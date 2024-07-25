import type { IFileContent, IFileMetadata, IFileStorage } from '.'

interface IDocumentContent extends IFileContent {
}

interface IDocumentMetadata extends IFileMetadata {
}

interface IDocumentStorage extends IFileStorage {
}

export type {
    IDocumentContent,
    IDocumentMetadata,
    IDocumentStorage
}
