import {createContext, useState} from "react"

export const PlayerContext = createContext()


const PlayerContextProvider = ({children}) => {
    const [currentTrack, setCurrentTrack] = useState(null)

    return <PlayerContext.Provider value={{
        currentTrack,
        setCurrentTrack
    }}>
        {children}
    </PlayerContext.Provider>
}

export default PlayerContextProvider