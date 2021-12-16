import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import { Button } from 'react-native-elements';

const MusicPlayer = () =>  {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [erreur, setErreur] = useState();
    const jsonApi = {username : 'Armand', password : "123"}
    const handleChangeUsername = (text) =>{
        setUsername(text);
    };
    const handleChangePassword = (text) => {
        setPassword(text)
    };
    const handleSubmit = (event) => {
        console.log(username, password)
    };

    return (
        <View>
            <TextInput placeholder="Username :" onChangeText ={text => {handleChangeUsername(text)}} value={username} style={{height: 40, minWidth : 12,  margin: 12, borderWidth: 1, padding: 10}}/>
            <TextInput secureTextEntry autoCorrect={true} type="password" placeholder="Votre mot de passe" value={password} onChangeText={text => {handleChangePassword(text)}} style={{height: 40, minWidth : 12,  margin: 12, borderWidth: 1, padding: 10}} />
            <Button
                onPress={(e) => {handleSubmit(e)}}
                title="Se connecter"
                color="#841584"
                accessibilityLabel="Connecter vous à l'application"
            />
            {
                erreur
                && <Text style={{color : "red"}}>{erreur}</Text>
            }
        </View>
    )
}
export default MusicPlayer;
