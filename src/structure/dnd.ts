import { ValueOf } from "types"

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
    Tool = 'tool',
    Weapon = 'weapon',
    Consumable = 'consumable',
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
    AttunedItems = 'attunedItems',
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
    Simple = 'simple',
    Martial = 'martial',
    Improvised = 'improvised',

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
    Sling = 'sling'
}

export const SimpleWeapon = {
    Club: WeaponTypeValue.Club,
    Dagger: WeaponTypeValue.Dagger,
    Greatclub: WeaponTypeValue.Greatclub,
    Handaxe: WeaponTypeValue.Handaxe,
    Javelin: WeaponTypeValue.Javelin,
    LightHammer: WeaponTypeValue.LightHammer,
    Mace: WeaponTypeValue.Mace,
    Quarterstaff: WeaponTypeValue.Quarterstaff,
    Sickle: WeaponTypeValue.Sickle,
    Spear: WeaponTypeValue.Spear
} as const

export const MartialWeapon = {
    Battleaxe: WeaponTypeValue.Battleaxe,
    Flail: WeaponTypeValue.Flail,
    Glaive: WeaponTypeValue.Glaive,
    Greataxe: WeaponTypeValue.Greataxe,
    Greatsword: WeaponTypeValue.Greatsword,
    Halberd: WeaponTypeValue.Halberd,
    Lance: WeaponTypeValue.Lance,
    Longsword: WeaponTypeValue.Longsword,
    Maul: WeaponTypeValue.Maul,
    Morningstar: WeaponTypeValue.Morningstar,
    Pike: WeaponTypeValue.Pike,
    Rapier: WeaponTypeValue.Rapier,
    Scimitar: WeaponTypeValue.Scimitar,
    Shortsword: WeaponTypeValue.Shortsword,
    Trident: WeaponTypeValue.Trident,
    WarPick: WeaponTypeValue.WarPick,
    Warhammer: WeaponTypeValue.Warhammer,
    Whip: WeaponTypeValue.Whip,
    Blowgun: WeaponTypeValue.Blowgun,
    HandCrossbow: WeaponTypeValue.HandCrossbow,
    HeavyCrossbow: WeaponTypeValue.HeavyCrossbow,
    Longbow: WeaponTypeValue.Longbow,
    Net: WeaponTypeValue.Net
} as const

export const WeaponTypeCategory = {
    Simple: WeaponTypeValue.Simple,
    Martial: WeaponTypeValue.Martial,
    Improvised: WeaponTypeValue.Improvised
} as const

export const MeleeWeaponType = {
    Battleaxe: WeaponTypeValue.Battleaxe,
    Club: WeaponTypeValue.Club,
    Flail: WeaponTypeValue.Flail,
    Glaive: WeaponTypeValue.Glaive,
    Greataxe: WeaponTypeValue.Greataxe,
    Greatclub: WeaponTypeValue.Greatclub,
    Greatsword: WeaponTypeValue.Greatsword,
    Halberd: WeaponTypeValue.Halberd,
    Lance: WeaponTypeValue.Lance,
    Longsword: WeaponTypeValue.Longsword,
    Mace: WeaponTypeValue.Mace,
    Maul: WeaponTypeValue.Maul,
    Morningstar: WeaponTypeValue.Morningstar,
    Pike: WeaponTypeValue.Pike,
    Quarterstaff: WeaponTypeValue.Quarterstaff,
    Rapier: WeaponTypeValue.Rapier,
    Scimitar: WeaponTypeValue.Scimitar,
    Shortsword: WeaponTypeValue.Shortsword,
    Sickle: WeaponTypeValue.Sickle,
    WarPick: WeaponTypeValue.WarPick,
    Warhammer: WeaponTypeValue.Warhammer,
    Whip: WeaponTypeValue.Whip
} as const

export const ThrownWeaponType = {
    Dagger: WeaponTypeValue.Dagger,
    Dart: WeaponTypeValue.Dart,
    Handaxe: WeaponTypeValue.Handaxe,
    Javelin: WeaponTypeValue.Javelin,
    LightHammer: WeaponTypeValue.LightHammer,
    Spear: WeaponTypeValue.Spear,
    Trident: WeaponTypeValue.Trident
} as const

export const RangedWeaponType = {
    Blowgun: WeaponTypeValue.Blowgun,
    HandCrossbow: WeaponTypeValue.HandCrossbow,
    HeavyCrossbow: WeaponTypeValue.HeavyCrossbow,
    LightCrossbow: WeaponTypeValue.LightCrossbow,
    Longbow: WeaponTypeValue.Longbow,
    Net: WeaponTypeValue.Net,
    Shortbow: WeaponTypeValue.Shortbow,
    Sling: WeaponTypeValue.Sling
} as const

export const WeaponType = {
    ...MeleeWeaponType,
    ...ThrownWeaponType,
    ...RangedWeaponType
} as const

export type WeaponType = ValueOf<typeof MeleeWeaponType> | ValueOf<typeof ThrownWeaponType> | ValueOf<typeof RangedWeaponType>

export const WeaponCategoryType = {
    ...WeaponType,
    ...WeaponTypeCategory
} as const

export type WeaponCategoryType = WeaponType | ValueOf<typeof WeaponTypeCategory>

export enum ArtisansTools {
    AlchemistsSupplies = 'alchemistsSupplies',
    BrewersSupplies = 'brewersSupplies',
    CalligraphersSupplies = 'calligraphersSupplies',
    CarpentersTools = 'carpentersTools',
    CartographersTools = 'cartographersTools',
    CobblersTools = 'cobblersTools',
    CooksUtensils = 'cooksUtensils',
    GlassblowersTools = 'glassblowersTools',
    JewelersTools = 'jewelersTools',
    LeatherworkersTools = 'leatherworkersTools',
    MasonsTools = 'masonsTools',
    PaintersSupplies = 'paintersSupplies',
    PottersTools = 'pottersTools',
    SmithsTools = 'smithsTools',
    TinkersTools = 'tinkersTools',
    WeaversTools = 'weaversTools',
    WoodcarversTools = 'woodcarversTools'
}

export enum GamingSet {
    DiceSet = 'diceSet',
    DragonchessSet = 'dragonchessSet',
    PlayingCardSet = 'playingCardSet',
    ThreeDragonAnteSet = 'threeDragonAnteSet'
}

export enum MusicalInstrument {
    Bagpipes = 'bagpipes',
    Drum = 'drum',
    Dulcimer = 'dulcimer',
    Flute = 'flute',
    Horn = 'horn',
    Lute = 'lute',
    Lyre = 'lyre',
    PanFlute = 'panFlute',
    Shawm = 'shawm',
    Viol = 'viol'
}

export enum MiscellaneousTools {
    DisguiseKit = 'disguiseKit',
    ForgeryKit = 'forgeryKit',
    HerbalismKit = 'herbalismKit',
    NavigatorsTools = 'navigatorsTools',
    PoisonersKit = 'poisonersKit',
    ThievesTools = 'thievesTools',
    VehiclesLand = 'vehiclesLand',
    VehiclesWater = 'vehiclesWater',
}

export enum ToolCategory {
    All = 'all',
    ArtisansTools = 'artisansTools',
    GamingSets = 'gamingSets',
    MusicalInstruments = 'musicalInstruments'
}

export const ToolType = {
    ...ToolCategory,
    ...ArtisansTools,
    ...GamingSet,
    ...MusicalInstrument,
    ...MiscellaneousTools
}
 
export type ToolType = ToolCategory | ArtisansTools | GamingSet | MusicalInstrument | MiscellaneousTools

export enum Language {
    All = 'all',
    Telepathy = 'telepathy',
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
    StrengthCheck = 'strCheck',
    DexterityCheck = 'dexCheck',
    ConstitutionCheck = 'conCheck',
    IntelligenceCheck = 'intCheck',
    WisdomCheck = 'wisCheck',
    CharismaCheck = 'chaCheck',
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
    Blinded = 'blinded',
    Charmed = 'charmed',
    Deafened = 'deafened',
    Diseased = 'diseased',
    Exhaustion = 'exhaustion',
    Frightened = 'frightened',
    Grappled = 'grappled',
    Incapacitated = 'incapacitated',
    Invisible = 'invisible',
    Paralyzed = 'paralyzed',
    Petrified = 'petrified',
    Poisoned = 'poisoned',
    Restrained = 'restrained',
    Sleep = 'sleep',
    Stunned = 'stunned',
    Unconscious = 'unconscious',
}

export enum SpellPreparationType {
    None = 'none',
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
    SpellPreparationType.Prepared, SpellPreparationType.AlwaysPrepared
])
