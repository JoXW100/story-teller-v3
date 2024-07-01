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
    Armor = 'armor',
    Trinket = 'trinket',
    Consumable = 'consumable',
    MeleeWeapon = 'meleeWeapon',
    RangedWeapon = 'rangedWeapon',
    ThrownWeapon = 'thrownWeapon',
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
    None = 'none',
    Finesse = 'finesse',
    SpellModifier = 'spellMod',
    STR = 'str',
    DEX = 'dex',
    CON = 'con',
    INT = 'int',
    WIS = 'wis',
    CHA = 'cha'
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
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
    Shields = 'shields'
}

export enum WeaponType {
    Battleaxe = 'battleaxe',
    Club = 'club',
    Dagger = 'dagger',
    Dart = 'dart',
    Flail = 'flail',
    Greataxe = 'greataxe',
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

export enum MeleeWeaponType {
    Battleaxe = WeaponType.Battleaxe,
    Club = WeaponType.Club,
    Dagger = WeaponType.Dagger,
    Dart = WeaponType.Dart,
    Flail = WeaponType.Flail,
    Greataxe = WeaponType.Greataxe,
    Greatclub = WeaponType.Greatclub,
    Greatsword = WeaponType.Greatsword,
    Halberd = WeaponType.Halberd,
    Handaxe = WeaponType.Handaxe,
    Javelin = WeaponType.Javelin,
    Lance = WeaponType.Lance,
    LightHammer = WeaponType.LightHammer,
    Longsword = WeaponType.Longsword,
    Mace = WeaponType.Mace,
    Maul = WeaponType.Maul,
    Morningstar = WeaponType.Morningstar,
    Pike = WeaponType.Pike,
    Quarterstaff = WeaponType.Quarterstaff,
    Rapier = WeaponType.Rapier,
    Scimitar = WeaponType.Scimitar,
    Shortsword = WeaponType.Shortsword,
    Sickle = WeaponType.Sickle,
    Spear = WeaponType.Spear,
    Trident = WeaponType.Trident,
    WarPick = WeaponType.WarPick,
    Warhammer = WeaponType.Warhammer,
    Whip = WeaponType.Whip,
    Improvised = WeaponType.Improvised
}

export enum ThrownWeaponType {
    Dagger = WeaponType.Dagger,
    Dart = WeaponType.Dart,
    Handaxe = WeaponType.Handaxe,
    Javelin = WeaponType.Javelin,
    LightHammer = WeaponType.LightHammer,
    Trident = WeaponType.Trident,
    Spear = WeaponType.Spear,
    Improvised = WeaponType.Improvised
}

export enum RangedWeaponType {
    Blowgun = WeaponType.Blowgun,
    HandCrossbow = WeaponType.HandCrossbow,
    HeavyCrossbow = WeaponType.HeavyCrossbow,
    LightCrossbow = WeaponType.LightCrossbow,
    Longbow = WeaponType.Longbow,
    Net = WeaponType.Net,
    Shortbow = WeaponType.Shortbow,
    Sling = WeaponType.Sling,
    Improvised = WeaponType.Improvised
}

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
    Abyssal = 'abyssal',
    Celestial = 'celestial',
    Common = 'common',
    Draconic = 'draconic',
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
    SkillChecks = 'skillChecks',
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
    Charmed = 'charmed'
}

export enum ArmorClassBase {
    DEX = 'dex',
    DEXAndAttribute = 'dexAndAttr',
    DEXAndFixed = 'dexAndFixed'
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
