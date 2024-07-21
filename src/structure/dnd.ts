export enum MagicSchool {
    Abjuration = 'abjuration',
    Conjuration = 'conjuration',
    Divination = 'divination',
    Dunamancy = 'dunamancy',
    Enchantment = 'enchantment',
    Evocation = 'evocation',
    Illusion = 'illusion',
    Necromancy = 'necromancy',
    Transmutation = 'transmutation'
}

export enum SizeType {
    Tiny = 'tiny',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge',
    Gargantuan = 'gargantuan'
}

export enum CreatureType {
    None = 'none',
    Aberration = 'aberration',
    Beast = 'beast',
    Celestial = 'celestial',
    Construct = 'construct',
    Dragon = 'dragon',
    Elemental = 'elemental',
    Fey = 'fey',
    Fiend = 'fiend',
    Giant = 'giant',
    Humanoid = 'humanoid',
    Monstrosity = 'monstrosity',
    Ooze = 'ooze',
    Plant = 'plant',
    Undead = 'undead'
}

export enum MovementType {
    Walk = 'walk',
    Burrow = 'burrow',
    Climb = 'climb',
    Fly = 'fly',
    Hover = 'hover',
    Swim = 'swim'
}

export enum Attribute {
    STR = 'str',
    DEX = 'dex',
    CON = 'con',
    INT = 'int',
    WIS = 'wis',
    CHA = 'cha'
}

export enum Optional {
    None = 'none'
}

export const OptionalAttribute = { ...Attribute, ...Optional }
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionalAttribute = Attribute | Optional

export enum Alignment {
    None = 'none',
    Unaligned = 'unaligned',
    Any = 'any',
    LawfulGood = 'lg',
    LawfulNeutral = 'ln',
    LawfulEvil = 'le',
    NeutralGood = 'ng',
    TrueNeutral = 'nn',
    NeutralEvil = 'ne',
    ChaoticGood = 'cg',
    ChaoticNeutral = 'cn',
    ChaoticEvil = 'ce'
}

export enum Skill {
    Acrobatics = 'acrobatics',
    AnimalHandling = 'animalHandling',
    Arcana = 'arcana',
    Athletics = 'athletics',
    Deception = 'deception',
    History = 'history',
    Insight = 'insight',
    Intimidation = 'intimidation',
    Investigation = 'investigation',
    Medicine = 'medicine',
    Nature = 'nature',
    Perception = 'perception',
    Performance = 'performance',
    Persuasion = 'persuasion',
    Religion = 'religion',
    SleightOfHand = 'sleightOfHand',
    Stealth = 'stealth',
    Survival = 'survival'
}

export enum DamageType {
    None = 'none',
    Special = 'special',
    Acid = 'acid',
    Bludgeoning = 'bludgeoning',
    Cold = 'cold',
    Fire = 'fire',
    Force = 'force',
    Health = 'health',
    Lightning = 'lightning',
    Necrotic = 'necrotic',
    Piercing = 'piercing',
    Poison = 'poison',
    Psychic = 'psychic',
    Radiant = 'radiant',
    Slashing = 'slashing',
    Thunder = 'thunder',
}

export enum TargetType {
    None = 'none',
    Self = 'self',
    Touch = 'touch',
    Single = 'single',
    Multiple = 'multiple',
    Point = 'point',
    Area = 'area'
}

export enum AreaType {
    None = 'none',
    Line = 'line',
    Cone = 'cone',
    Square = 'square',
    Rectangle = 'rectangle',
    Cube = 'cube',
    Cuboid = 'cuboid',
    Sphere = 'sphere',
    Cylinder = 'cylinder'
}

export enum ItemType {
    WondrousItem = 'wondrousItem',
    Armor = 'armor',
    Consumable = 'consumable',
    Weapon = 'weapon',
    Other = 'other'
}

export enum ActionType {
    None = 'none',
    Action = 'action',
    BonusAction = 'bonusAction',
    Reaction = 'reaction',
    Special = 'special',
    Legendary = 'legendary',
}

export enum ScalingType {
    Constant = 'constant',
    Proficiency = 'proficiency',
    Level = 'level',
    ClassLevel = 'classLevel',
    SpellLevel = 'spellLevel',
    Finesse = 'finesse',
    SpellModifier = 'spellMod',
    STR = 'str',
    DEX = 'dex',
    CON = 'con',
    INT = 'int',
    WIS = 'wis',
    CHA = 'cha',
    WalkSpeed = 'walkSpeed',
    BurrowSpeed = 'burrowSpeed',
    ClimbSpeed = 'climbSpeed',
    FlySpeed = 'flySpeed',
    HoverSpeed = 'hoverSpeed',
    SwimSpeed = 'swimSpeed',
}

export enum Duration {
    Instantaneous = 'instantaneous',
    Round = 'round',
    Minute = 'minute',
    Hour = 'hour',
    Day = 'day',
    Custom = 'custom'
}

export enum CastingTime {
    Action = 'action',
    BonusAction = 'bonusAction',
    Reaction = 'reaction',
    Minute = 'minute',
    Hour = 'hour',
    Custom = 'custom',
}

export enum ArmorType {
    Clothing = 'clothing',
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
    Shield = 'shield'
}

export enum WeaponTypeValue {
    Battleaxe = 'battleaxe',
    Club = 'club',
    Dagger = 'dagger',
    Dart = 'dart',
    Flail = 'flail',
    Greataxe = 'greataxe',
    Glaive = 'glaive',
    Greatclub = 'greatclub',
    Greatsword = 'greatsword',
    Halberd = 'halberd',
    Handaxe = 'handaxe',
    Javelin = 'javelin',
    Lance = 'lance',
    LightHammer = 'lightHammer',
    Longsword = 'longsword',
    Mace = 'mace',
    Maul = 'maul',
    Morningstar = 'morningstar',
    Pike = 'pike',
    Quarterstaff = 'quarterstaff',
    Rapier = 'rapier',
    Scimitar = 'scimitar',
    Shortsword = 'shortsword',
    Sickle = 'sickle',
    Spear = 'spear',
    Trident = 'trident',
    WarPick = 'warPick',
    Warhammer = 'warhammer',
    Whip = 'whip',
    Blowgun = 'blowgun',
    HandCrossbow = 'handCrossbow',
    HeavyCrossbow = 'heavyCrossbow',
    LightCrossbow = 'lightCrossbow',
    Longbow = 'longbow',
    Net = 'net',
    Shortbow = 'shortbow',
    Sling = 'sling',
    Simple = 'simple',
    Martial = 'martial',
    Improvised = 'improvised'
}

export enum SimpleWeapon {
    Club = WeaponTypeValue.Club,
    Dagger = WeaponTypeValue.Dagger,
    Greatclub = WeaponTypeValue.Greatclub,
    Handaxe = WeaponTypeValue.Handaxe,
    Javelin = WeaponTypeValue.Javelin,
    LightHammer = WeaponTypeValue.LightHammer,
    Mace = WeaponTypeValue.Mace,
    Quarterstaff = WeaponTypeValue.Quarterstaff,
    Sickle = WeaponTypeValue.Sickle,
    Spear = WeaponTypeValue.Spear
}

export enum MartialWeapon {
    Battleaxe = WeaponTypeValue.Battleaxe,
    Flail = WeaponTypeValue.Flail,
    Glaive = WeaponTypeValue.Glaive,
    Greataxe = WeaponTypeValue.Greataxe,
    Greatsword = WeaponTypeValue.Greatsword,
    Halberd = WeaponTypeValue.Halberd,
    Lance = WeaponTypeValue.Lance,
    Longsword = WeaponTypeValue.Longsword,
    Maul = WeaponTypeValue.Maul,
    Morningstar = WeaponTypeValue.Morningstar,
    Pike = WeaponTypeValue.Pike,
    Rapier = WeaponTypeValue.Rapier,
    Scimitar = WeaponTypeValue.Scimitar,
    Shortsword = WeaponTypeValue.Shortsword,
    Trident = WeaponTypeValue.Trident,
    WarPick = WeaponTypeValue.WarPick,
    Warhammer = WeaponTypeValue.Warhammer,
    Whip = WeaponTypeValue.Whip,
    Blowgun = WeaponTypeValue.Blowgun,
    HandCrossbow = WeaponTypeValue.HandCrossbow,
    HeavyCrossbow = WeaponTypeValue.HeavyCrossbow,
    Longbow = WeaponTypeValue.Longbow,
    Net = WeaponTypeValue.Net
}

export enum WeaponTypeCategory {
    Simple = WeaponTypeValue.Simple,
    Martial = WeaponTypeValue.Martial,
    Improvised = WeaponTypeValue.Improvised
}

export enum MeleeWeaponType {
    Battleaxe = WeaponTypeValue.Battleaxe,
    Club = WeaponTypeValue.Club,
    Flail = WeaponTypeValue.Flail,
    Glaive = WeaponTypeValue.Glaive,
    Greataxe = WeaponTypeValue.Greataxe,
    Greatclub = WeaponTypeValue.Greatclub,
    Greatsword = WeaponTypeValue.Greatsword,
    Halberd = WeaponTypeValue.Halberd,
    Lance = WeaponTypeValue.Lance,
    Longsword = WeaponTypeValue.Longsword,
    Mace = WeaponTypeValue.Mace,
    Maul = WeaponTypeValue.Maul,
    Morningstar = WeaponTypeValue.Morningstar,
    Pike = WeaponTypeValue.Pike,
    Quarterstaff = WeaponTypeValue.Quarterstaff,
    Rapier = WeaponTypeValue.Rapier,
    Scimitar = WeaponTypeValue.Scimitar,
    Shortsword = WeaponTypeValue.Shortsword,
    Sickle = WeaponTypeValue.Sickle,
    WarPick = WeaponTypeValue.WarPick,
    Warhammer = WeaponTypeValue.Warhammer,
    Whip = WeaponTypeValue.Whip
}

export enum ThrownWeaponType {
    Dagger = WeaponTypeValue.Dagger,
    Dart = WeaponTypeValue.Dart,
    Handaxe = WeaponTypeValue.Handaxe,
    Javelin = WeaponTypeValue.Javelin,
    LightHammer = WeaponTypeValue.LightHammer,
    Spear = WeaponTypeValue.Spear,
    Trident = WeaponTypeValue.Trident
}

export enum RangedWeaponType {
    Blowgun = WeaponTypeValue.Blowgun,
    HandCrossbow = WeaponTypeValue.HandCrossbow,
    HeavyCrossbow = WeaponTypeValue.HeavyCrossbow,
    LightCrossbow = WeaponTypeValue.LightCrossbow,
    Longbow = WeaponTypeValue.Longbow,
    Net = WeaponTypeValue.Net,
    Shortbow = WeaponTypeValue.Shortbow,
    Sling = WeaponTypeValue.Sling
}

export const WeaponType = {
    ...MeleeWeaponType,
    ...ThrownWeaponType,
    ...RangedWeaponType
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WeaponType = MeleeWeaponType | ThrownWeaponType | RangedWeaponType

export const WeaponCategoryType = {
    ...WeaponType,
    ...WeaponTypeCategory
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WeaponCategoryType = WeaponType | WeaponTypeCategory

export enum ToolType {
    AlchemistsSupplies = 'alchemistsSupplies',
    Bagpipes = 'bagpipes',
    BrewersSupplies = 'brewersSupplies',
    CalligraphersSupplies = 'calligraphersSupplies',
    CarpentersTools = 'carpentersTools',
    CartographersTools = 'cartographersTools',
    CobblersTools = 'cobblersTools',
    CooksUtensils = 'cooksUtensils',
    DiceSet = 'diceSet',
    DisguiseKit = 'disguiseKit',
    Drum = 'drum',
    Dulcimer = 'dulcimer',
    Flute = 'flute',
    ForgeryKit = 'forgeryKit',
    GlassblowersTools = 'glassblowersTools',
    HerbalismKit = 'herbalismKit',
    Horn = 'horn',
    JewelersTools = 'jewelersTools',
    LeatherworkersTools = 'leatherworkersTools',
    Lute = 'lute',
    Lyre = 'lyre',
    MasonsTools = 'masonsTools',
    NavigatorsTools = 'navigatorsTools',
    PaintersSupplies = 'paintersSupplies',
    PanFlute = 'panFlute',
    PlayingCardSet = 'playingCardSet',
    PoisonersKit = 'poisonersKit',
    PottersTools = 'pottersTools',
    Shawm = 'shawm',
    SmithsTools = 'smithsTools',
    ThievesTools = 'thievesTools',
    TinkersTools = 'tinkersTools',
    VehiclesLand = 'vehiclesLand',
    VehiclesWater = 'vehiclesWater',
    Viol = 'viol',
    WeaversTools = 'weaversTools',
    WoodcarversTools = 'woodcarversTools',
}

export enum Language {
    All = 'All',
    Abyssal = 'abyssal',
    Celestial = 'celestial',
    Common = 'common',
    Draconic = 'draconic',
    Druidic = 'druidic',
    DeepSpeech = 'deepSpeech',
    Dwarvish = 'dwarvish',
    Elvish = 'elvish',
    Giant = 'giant',
    Gnomish = 'gnomish',
    Goblin = 'goblin',
    Halfling = 'halfling',
    Infernal = 'infernal',
    Leonin = 'leonin',
    Orc = 'orc',
    Primordial = 'primordial',
    Sylvan = 'sylvan',
    ThievesCant = 'thieves',
    Undercommon = 'undercommon'
}

export enum Sense {
    BlindSight = 'blindSight',
    DarkVision = 'darkVision',
    TremorSense = 'tremorSense',
    TrueSight = 'trueSight',
}

export enum ProficiencyType {
    Armor = 'armor',
    Weapon = 'weapon',
    Tool = 'tool',
    Language = 'language',
    Save = 'save',
    Skill = 'skill',
}

export enum ProficiencyLevelBasic {
    None = 'none',
    Proficient = 'proficient',
}

export enum ProficiencyLevelExpanded {
    HalfProficient = 'halfProficient',
    Expert = 'expert',
}

export const ProficiencyLevel = {
    ...ProficiencyLevelBasic,
    ...ProficiencyLevelExpanded
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProficiencyLevel = ProficiencyLevelBasic | ProficiencyLevelExpanded

export enum RestType {
    None = 'none',
    ShortRest = 'short',
    LongRest = 'long'
}

export enum Rarity {
    Mundane = 'mundane',
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    VeryRare = 'veryRare',
    Legendary = 'legendary',
    Artifact = 'artifact'
}

export enum AdvantageBinding {
    Generic = 'generic',
    // Saves
    Saves = 'saves',
    StrengthSave = 'strSave',
    DexteritySave = 'dexSave',
    ConstitutionSave = 'conSave',
    IntelligenceSave = 'intSave',
    WisdomSave = 'wisSave',
    CharismaSave = 'chaSave',
    // Checks
    Checks = 'checks',
    StrengthChecks = 'strCheck',
    DexterityChecks = 'dexCheck',
    ConstitutionChecks = 'conCheck',
    IntelligenceChecks = 'intCheck',
    WisdomChecks = 'wisCheck',
    CharismaChecks = 'chaCheck',
    // Skills
    SkillChecks = 'skillCheck',
    AcrobaticsCheck = 'acrobaticsCheck',
    AnimalHandlingCheck = 'animalCheck',
    ArcanaCheck = 'arcanaCheck',
    AthleticsCheck = 'athleticsCheck',
    DeceptionCheck = 'deceptionCheck',
    HistoryCheck = 'historyCheck',
    InsightCheck = 'insightCheck',
    IntimidationCheck = 'intimidationCheck',
    InvestigationCheck = 'investigationCheck',
    MedicineCheck = 'medicineCheck',
    NatureCheck = 'natureCheck',
    PerceptionCheck = 'perceptionCheck',
    PerformanceCheck = 'performanceCheck',
    PersuasionCheck = 'persuasionCheck',
    ReligionCheck = 'religionCheck',
    SleightOfHandCheck = 'sleightCheck',
    StealthCheck = 'stealthCheck',
    SurvivalCheck = 'survivalCheck',
    // Attacks
    Attack = 'attack',
    // Other
    Initiative = 'initiative',
}

export enum DamageBinding {
    Generic = 'generic',
    Acid = 'acid',
    Bludgeoning = 'bludgeoning',
    Cold = 'cold',
    Fire = 'fire',
    Force = 'force',
    Lightning = 'lightning',
    Necrotic = 'necrotic',
    Piercing = 'piercing',
    Poison = 'poison',
    Psychic = 'psychic',
    Radiant = 'radiant',
    Slashing = 'slashing',
    Thunder = 'thunder',
}

export enum ConditionBinding {
    Generic = 'generic',
    Charmed = 'charmed',
    Sleep = 'sleep',
    Frightened = 'frightened',
    Diseased = 'diseased',
    Poisoned = 'poisoned',
}

export enum SpellPreparationType {
    None = 'none',
    Cantrip = 'cantrip',
    FreeCantrip = 'freeCantrip',
    AlwaysPrepared = 'always',
    Prepared = 'prepared',
    Learned = 'learned'
}

export enum SpellLevel {
    Cantrip = '0',
    Level1 = '1',
    Level2 = '2',
    Level3 = '3',
    Level4 = '4',
    Level5 = '5',
    Level6 = '6',
    Level7 = '7',
    Level8 = '8',
    Level9 = '9',
}

export enum ClassLevel {
    Level1 = '1',
    Level2 = '2',
    Level3 = '3',
    Level4 = '4',
    Level5 = '5',
    Level6 = '6',
    Level7 = '7',
    Level8 = '8',
    Level9 = '9',
    Level10 = '10',
    Level11 = '11',
    Level12 = '12',
    Level13 = '13',
    Level14 = '14',
    Level15 = '15',
    Level16 = '16',
    Level17 = '17',
    Level18 = '18',
    Level19 = '19',
    Level20 = '20',
}

export const PreparedSpellPreparationType = new Set<SpellPreparationType>([
    SpellPreparationType.Prepared, SpellPreparationType.AlwaysPrepared,
    SpellPreparationType.Cantrip, SpellPreparationType.FreeCantrip
])
