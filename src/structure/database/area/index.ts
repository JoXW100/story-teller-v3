import type { IconType } from 'assets/icons'
import type { DataPropertyMap } from 'types/database'
import type { IAreaBase } from 'types/database/area'

abstract class AreaBase implements IAreaBase {
    public abstract get icon(): IconType | null
    public abstract get text(): string

    public static properties: DataPropertyMap<IAreaBase, AreaBase> = {}
}

export default AreaBase
