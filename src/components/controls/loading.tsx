import CircularProgress from '@mui/material/CircularProgress'

type LoadingProps = React.PropsWithChildren<{
    loaded?: boolean
}>

const Loading: React.FC<LoadingProps> = ({ loaded = false, children }): React.ReactNode => {
    if (loaded) {
        return children
    } else {
        return (
            <div className='fill center-flex' >
                <CircularProgress className='icon' color='inherit'/>
            </div>
        )
    }
}

export default Loading
