import type { CSSProperties } from 'react'
// Flags
import GBFlag from './flags/gb.svg'
// Damage
import AcidIcon from './dmg/acid.svg'
import BludgeoningIcon from './dmg/bludgeoning.svg'
import ColdIcon from './dmg/cold.svg'
import FireIcon from './dmg/fire.svg'
import ForceIcon from './dmg/force.svg'
import HealthIcon from './dmg/health.svg'
import LightningIcon from './dmg/lightning.svg'
import NecroticIcon from './dmg/necrotic.svg'
import PiercingIcon from './dmg/piercing.svg'
import PoisonIcon from './dmg/poison.svg'
import PsychicIcon from './dmg/psychic.svg'
import RadiantIcon from './dmg/radiant.svg'
import SlashingIcon from './dmg/slashing.svg'
import ThunderIcon from './dmg/thunder.svg'
// shapes
import ConeIcon from './shapes/cone.svg'
import CubeIcon from './shapes/cube.svg'
import CylinderIcon from './shapes/cylinder.svg'
import LineIcon from './shapes/line.svg'
import SquareIcon from './shapes/square.svg'
import SphereIcon from './shapes/sphere.svg'
// Dice
import D100Icon from './dice/d100.svg'
import D20Icon from './dice/d20.svg'
import D12Icon from './dice/d12.svg'
import D10Icon from './dice/d10.svg'
import D8Icon from './dice/d8.svg'
import D6Icon from './dice/d6.svg'
import D4Icon from './dice/d4.svg'
import DXIcon from './dice/dX.svg'
// documents
import DocumentIcon from '@mui/icons-material/InsertDriveFileSharp'
import CharacterIcon from '@mui/icons-material/PersonSharp'
import FolderIcon from '@mui/icons-material/FolderSharp'
import SpellIcon from '@mui/icons-material/AutoAwesomeSharp'
import ClassIcon from '@mui/icons-material/SchoolSharp'
import ItemIcon from '@mui/icons-material/ShieldSharp'
// other
import AdvantageIcon from './advantage.svg'
import CampIcon from './camp.svg'
import ConcentrationIcon from './concentration.svg'
import CritIcon from './crit.svg'
import DisadvantageIcon from './disadvantage.svg'
import EncounterIcon from './crossedSwords.svg'
import DragonIcon from './dragon.svg'
import HandIcon from './hand.svg'
import ImmunityIcon from './immunity.svg'
import LibraryIcon from './library.svg'
import NightIcon from './night.svg'
import ResistanceIcon from './resistance.svg'
import RitualIcon from './ritual.svg'
import VulnerabilityIcon from './vulnerability.svg'

import SettingsIcon from '@mui/icons-material/SettingsSharp'
import StoryIcon from '@mui/icons-material/ImportContactsSharp'
import HomeIcon from '@mui/icons-material/HomeSharp'
import EditIcon from '@mui/icons-material/EditSharp'
import ErrorIcon from '@mui/icons-material/ErrorSharp'

export type IconParams = React.PropsWithRef<{
    data?: string
    className?: string
    style?: CSSProperties
}>

const IconMap = {
    // Flags https://flagicons.lipis.dev/
    'flag-gb': GBFlag as React.FC<IconParams>,
    // damage
    'acid': AcidIcon as React.FC<IconParams>,
    'bludgeoning': BludgeoningIcon as React.FC<IconParams>,
    'cold': ColdIcon as React.FC<IconParams>,
    'fire': FireIcon as React.FC<IconParams>,
    'force': ForceIcon as React.FC<IconParams>,
    'health': HealthIcon as React.FC<IconParams>,
    'lightning': LightningIcon as React.FC<IconParams>,
    'necrotic': NecroticIcon as React.FC<IconParams>,
    'piercing': PiercingIcon as React.FC<IconParams>,
    'poison': PoisonIcon as React.FC<IconParams>,
    'psychic': PsychicIcon as React.FC<IconParams>,
    'radiant': RadiantIcon as React.FC<IconParams>,
    'slashing': SlashingIcon as React.FC<IconParams>,
    'thunder': ThunderIcon as React.FC<IconParams>,
    // shapes
    'cone': ConeIcon as React.FC<IconParams>,
    'cube': CubeIcon as React.FC<IconParams>,
    'cylinder': CylinderIcon as React.FC<IconParams>,
    'line': LineIcon as React.FC<IconParams>,
    'sphere': SphereIcon as React.FC<IconParams>,
    'square': SquareIcon as React.FC<IconParams>,
    // dice
    'd4': D4Icon as React.FC<IconParams>,
    'd6': D6Icon as React.FC<IconParams>,
    'd8': D8Icon as React.FC<IconParams>,
    'd10': D10Icon as React.FC<IconParams>,
    'd12': D12Icon as React.FC<IconParams>,
    'd20': D20Icon as React.FC<IconParams>,
    'd100': D100Icon as React.FC<IconParams>,
    'dx': DXIcon as React.FC<IconParams>,
    // documents
    'abi': HandIcon as React.FC<IconParams>,
    'cha': CharacterIcon as React.FC<IconParams>,
    'npc': CharacterIcon as React.FC<IconParams>,
    'rce': CharacterIcon as React.FC<IconParams>,
    'src': CharacterIcon as React.FC<IconParams>,
    'cla': ClassIcon as React.FC<IconParams>,
    'scl': ClassIcon as React.FC<IconParams>,
    'cnd': PoisonIcon as React.FC<IconParams>,
    'cre': DragonIcon as React.FC<IconParams>,
    'enc': EncounterIcon as React.FC<IconParams>,
    'txt': DocumentIcon as React.FC<IconParams>,
    'spe': SpellIcon as React.FC<IconParams>,
    'mod': SettingsIcon as React.FC<IconParams>,
    'ite': ItemIcon as React.FC<IconParams>,
    'folder': FolderIcon as React.FC<IconParams>,
    // other
    'story': StoryIcon as React.FC<IconParams>,
    'advantage': AdvantageIcon as React.FC<IconParams>,
    'disadvantage': DisadvantageIcon as React.FC<IconParams>,
    'resistance': ResistanceIcon as React.FC<IconParams>,
    'immunity': ImmunityIcon as React.FC<IconParams>,
    'vulnerability': VulnerabilityIcon as React.FC<IconParams>,
    'crit': CritIcon as React.FC<IconParams>,
    'concentration': ConcentrationIcon as React.FC<IconParams>,
    'ritual': RitualIcon as React.FC<IconParams>,
    'dragon': DragonIcon as React.FC<IconParams>,
    'hand': HandIcon as React.FC<IconParams>,
    'library': LibraryIcon as React.FC<IconParams>,
    'night': NightIcon as React.FC<IconParams>,
    'camp': CampIcon as React.FC<IconParams>,
    'home': HomeIcon as React.FC<IconParams>,
    'settings': SettingsIcon as React.FC<IconParams>,
    'edit': EditIcon as React.FC<IconParams>,
    'error': ErrorIcon as React.FC<IconParams>
}

export type IconType = keyof typeof IconMap

export default IconMap
