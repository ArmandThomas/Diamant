import React from 'react';
import {View} from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


const LoadingPage = () => {
    const navigation = useNavigation();
    const joinAGame = () => {
        navigation.navigate('joingame')
    }
    const createAGame = () => {
        navigation.navigate('configgame')
    }
    return(
        <View style={styles.container}>
            <Button
                onPress={() => {joinAGame()}}
                title="JOIN A GAME"
                type="outline"
                size={15}
            />
            <Button
                onPress={() => {createAGame()}}
                title="CREATE A GAME"
                type="outline"
                size={15}
            />
        </View>
    )
}
export default LoadingPage;

const styles = {
    'container' : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgoundColor : '#000',
    },
}