import { useState } from 'react'
import { changeSwitchWithoutTimer } from '../services/dashbord'

export default function useSwitchState(sensorID, initialState = false) {
    const [isChecked, setIsChecked] = useState(initialState)

    const handleSwitchChange = async (sensorID, newState) => {
        setIsChecked(newState)
        try{
            changeSwitchWithoutTimer(sensorID, newState)
        }catch(error){
            setIsChecked(!newState)
            console.error("Error al actualizar el estado del sensor:", error);
        }
    }

    const toogleSwtichFromButton = () => {
        handleSwitchChange(isChecked)
    } 

    return { handleSwitchChange , toogleSwtichFromButton }
}