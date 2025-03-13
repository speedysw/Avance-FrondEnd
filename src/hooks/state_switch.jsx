import { useState } from 'react'
import { activarTemporizador, changeHoraTermino, changeSwitchWithoutTimer } from '../services/dashbord'

export default function useSwitchState(sensorID, initialState = false) {
    const [isChecked, setIsChecked] = useState(initialState)

    const handleSwitchChange = async (sensorID, newState) => {
        setIsChecked(newState)
        try{
            if (!newState) {
                const updateSensor = { id_radar: sensorID, timerActive: false };
                await changeHoraTermino(sensorID,null)
                await activarTemporizador(updateSensor)
            }
            await changeSwitchWithoutTimer(sensorID, newState)
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