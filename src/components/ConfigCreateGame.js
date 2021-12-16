import React,{useState} from "react";
import { Button, Icon, Input} from 'react-native-elements';
import {View, Text} from "react-native";

import { useNavigation } from '@react-navigation/native';


const ConfigCreateGame = () => {
    const navigation = useNavigation();
    const [nbrBots, setNbrBots] = useState(2);
    const [username, setUsername] = useState("");
    const startTheGameWithParams = () => {
        const newJson = {};
        newJson["User"] = username;
        newJson["Bots"] = [];
        for (let i = 0; i < nbrBots; i++) {
            newJson["Bots"].push(`bot${i+1}`)
        }
        navigation.navigate('game', {
            "User" : newJson["User"],
            "Bots" : newJson["Bots"]
        })
    }
    const handleChangeUsername = (event) => {
        setUsername(event);
    }
    const handleLessBots = () => {
        if (nbrBots > 0) {
            setNbrBots(prevState => prevState - 1);
        }
    }
    const handleMoreBots = () => {
        if (nbrBots < 7) {
            setNbrBots(prevState => prevState + 1);
        }
    }
    return (
        <View>
            <View style={{justifyContent : "center", alignItems : "center"}}>
                <View><Text>NbrBots</Text></View>
                <View style={{flexDirection : "row", justifyContent : "center", alignItems : "center"}}>
                    <Icon name="chevron-left" size={50} onPress={() => {handleLessBots()}}/>
                    <Text style={{fontSize : 25}}>{nbrBots}</Text>
                    <Icon name="chevron-right" size={50} onPress={() => {handleMoreBots()}}/>
                </View>
            </View>
            <Input
                placeholder='Votre nom'
                onChangeText={(e) => {handleChangeUsername(e)}}
            />
            <Button
                onPress={() => {startTheGameWithParams()}}
                title="Create the game"
                type="outline"
                size={15}
            />
        </View>
    )
}
export default ConfigCreateGame;