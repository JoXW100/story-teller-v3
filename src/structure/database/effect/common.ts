export enum EffectType {
    Text = 'text',
    Die = 'die',
    Damage = 'damage'
}

export enum EffectScaling {
    Level = 'level',
    CasterLevel = 'casterLevel',
    SpellSlot = 'spellSlot'
}

export enum EffectCategory {
    Uncategorized = 'uncategorized',
    AttackDamage = 'attack',
    AreaDamage = 'area',
    SingleDamage = 'target',
    MeleeDamage = 'melee',
    ThrownDamage = 'thrown',
    RangedDamage = 'ranged',
}
