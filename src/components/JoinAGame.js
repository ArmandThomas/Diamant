import React, {useState} from 'react';
import {SafeAreaView, TextInput} from 'react-native';

const JoinAGame = () => {
    const [idSession, setIdSession] = useState();
    const [username, setUsername] = useState();
    const handleChangeId = (event) => {
        setIdSession(event)
    }
    const handleChangeName = (event) => {
        setUsername(event)
    }
    return(
        <SafeAreaView>
            <TextInput
                placeholder="Entrez l'id de session :"
                onChangeText={(event) => {handleChangeId(event)}}
                value={idSession}
            />
            <TextInput
                placeholder="Votre pseudo : "
                onChangeText={(event) => {handleChangeName(event)}}
                value={username}
            />
        </SafeAreaView>
    )
}
export default JoinAGame;