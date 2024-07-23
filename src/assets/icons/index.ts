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
import EncounterIcon from './crossedSwords.svg'
import DisadvantageIcon from './disadvantage.svg'
import DragonIcon from './dragon.svg'
import HandIcon from './hand.svg'
import LibraryIcon from './library.svg'
import NightIcon from './night.svg'
import RitualIcon from './ritual.svg'

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
    // documents
    'story': StoryIcon as React.FC<IconParams>,
    'ability': HandIcon as React.FC<IconParams>,
    'character': CharacterIcon as React.FC<IconParams>,
    'class': ClassIcon as React.FC<IconParams>,
    'creature': DragonIcon as React.FC<IconParams>,
    'document': DocumentIcon as React.FC<IconParams>,
    'encounter': EncounterIcon as React.FC<IconParams>,
    'folder': FolderIcon as React.FC<IconParams>,
    'modifier': SettingsIcon as React.FC<IconParams>,
    'spell': SpellIcon as React.FC<IconParams>,
    'item': ItemIcon as React.FC<IconParams>,
    // other
    'advantage': AdvantageIcon as React.FC<IconParams>,
    'disadvantage': DisadvantageIcon as React.FC<IconParams>,
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
