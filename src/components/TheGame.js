import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    Button,
    Alert,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

import backImage from '../img/papyrus.jpg';
import carteImg from '../img/carte.png';
import continuerImg from '../img/continuer.png';
import sortirImg from '../img/sortir.png';

import botIconContinue from '../img/botIconContinue.png';
import botIconSortir from '../img/botIconSortir.png';

import rubisImg from '../img/rubis.png';
import coffreFort from '../img/chest.png';
import ReliqueImg from '../img/mask.png'
import prefix from "react-native-web/dist/exports/StyleSheet/ReactNativePropRegistry";
import {BackgroundImage} from "react-native-elements/dist/config";

const jeuCartesINIT = {
    "danger" : {
        "value" : ["spider","spider","spider","lave","lave","lave","boule","boule","boule","serpent","serpent","serpent","hachePiquante","hachePiquante","hachePiquante"]
    },
    "tresor" : {
        "value" : ['tresor2','tresor17','tresor15','tresor18','tresor9','tresor17','tresor9','tresor4','tresor5','tresor21','tresor1','tresor7','tresor9','tresor11','tresor15']
    },
    "relique" : {
        "value" : ['relique5','relique5','relique5','relique10','relique10']
    }
}

const TheGame = ({ route, navigation }) => {


    const [startTheGame , setStartTheGame] = useState(true);
    // Gestion jeu de cartes
    const [jeuCartes, setJeuCartes] = useState(jeuCartesINIT);
    const [round, setRound] = useState(1);
    const [nbrCarteDanger, setNbrCarteDanger] = useState([]);
    const [cartesPlayed, setCartesPlayed] = useState([]);
    const [carteStayForRound, setCarteStayRound] = useState(jeuCartesINIT);

    const [maxThuneRound , setMaxThuneRound] = useState(0);

    const [userWantLeave, setUserWantLeave] = useState(false);
    // Etat Relique
    const [reliqueRound, setReliqueRound] = useState([]);
    // Etat reste
    const [reste, setReste] = useState(0);
    // Etat Utulisateur choose
    const [playersChoiceDone, setPlayersChoiceDone] = useState();

    const [userWantNewRound, setUserWantNewRound] = useState(false);
    // Etat actuel tour sortie
    const [pplWantLeave, setPplWantLeave] = useState(undefined);
    const [players, setPlayers] = useState(
        {})
    // click of user
    const handleChoiceUser = (type) => {
        if (type) {
            if (type === "sortir"){
                setUserWantLeave(true);
            }
            const newJson = {...players}
            newJson[route.params["User"]]["decision"] = type
            setPlayers(newJson);
        }
        setPlayersChoiceDone(true);
    }
    // algo bot
    const botAlgo = async () => {
        const nombreRandom = (min,max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const proba = (x) => {
            const nbrCartePioche = carteStayForRound.danger.value.length + carteStayForRound.tresor.value.length + carteStayForRound.relique.value.length
            const nbrCartesRestantes = nbrCartePioche - cartesPlayed.length;
            const cartesDanger = nbrCarteDanger.length;

            const chanceTirerCarteDanger = cartesDanger/nbrCartesRestantes * 100;
            const thuneRound = players[x]["thuneRound"];
            if (chanceTirerCarteDanger > 0) {
                let pourcentageDeuxiemeDangerIdem = 0;
                nbrCarteDanger.forEach(
                    element => {
                        let nbr = 0;
                        carteStayForRound.danger.value.forEach(
                            carte => {
                                if (carte === element) {
                                    nbr++;
                                }
                            }
                        )
                        pourcentageDeuxiemeDangerIdem += nbr/nbrCartePioche * 100
                    }
                )
                const nbrAlea = nombreRandom(0,33);
                if (thuneRound > 0) {
                    if (pourcentageDeuxiemeDangerIdem > 6) {
                        if (pourcentageDeuxiemeDangerIdem > 33) {
                            return "sortir";
                        } else if (nbrAlea < pourcentageDeuxiemeDangerIdem) {
                            return "sortir";
                        }
                        return "continue";
                    } else {
                        return 'continue';
                    }
                } else {
                    return 'continue';
                }
            } else {
                return 'continue';
            }
        }
        const wait = (ms) => {
            return new Promise(resolve => {
                setTimeout(resolve,ms);
            })
        }
        const newJson = {...players}
        const newArray = []
        wait(600);
        Object.entries(newJson).map(
            x => {
                if (x[1].type === "bot") {
                    if (x[1].decision === "continue") {
                        x[1].decision = proba(x[0])
                        if (x[1].decision === "sortir"){
                            newArray.push(x[0])
                        }
                    }
                }
            }
        )
        return {"newJson" : newJson, "newArray" : newArray};
    }

    useEffect(() => {
        if (userWantNewRound) {
            roundSuivant(jeuCartes);
            setUserWantNewRound(false);
        }
    }, [jeuCartes, userWantNewRound])

    useEffect(() => {
        if (playersChoiceDone) {
            botAlgo().then(
                x => {
                    let localPlayers = x.newJson;
                    const localPplWantLeave = x.newArray;
                    if (localPlayers[route.params["User"]]["decision"] === "sortir" && userWantLeave) {
                        localPplWantLeave.push(route.params["User"]);
                        setUserWantLeave(false);
                    }
                    if (localPplWantLeave.length > 0) {
                        localPlayers = sortir(localPlayers, localPplWantLeave)
                    }
                    TirerUneCarte(localPlayers, localPplWantLeave);
                }
            )
            setPlayersChoiceDone(false);
        }
    },[playersChoiceDone])

    useEffect(() => {
        if (startTheGame === true) {
            const newJson = {};
            newJson[route.params["User"]] = {
                "type" : "player",
                "thuneRound" : 0,
                "thuneFinal" : 0,
                "reliqueFinal" : 0,
                "decision" : "continue",
                "userMakeDecision" : false,
            }
            route.params["Bots"].forEach(
                x => newJson[x] = {
                    "type" : "bot",
                    "difficult" : "easy",
                    "thuneRound" : 0,
                    "thuneFinal" : 0,
                    "reliqueFinal" : 0,
                    "decision" : "continue",
                    "userMakeDecision" : false,
                }
            )
            setStartTheGame(false);
            setPlayers(newJson)
        }
    }, [startTheGame])

    // Tire une carte
    const TirerUneCarte = async (localPlayers, localPplWantLeave) => {

        const arrayActifPlayers = [];
        Object.entries(localPlayers).map(
            x => {
                x[1].decision === "continue"
                && arrayActifPlayers.push(x[0])
            }
        )
        if (arrayActifPlayers.length === 0) {
            setPlayersChoiceDone(false);
            setUserWantNewRound(true);
        } else {
            const nbrCartes = carteStayForRound.danger.value.length + carteStayForRound.tresor.value.length  + carteStayForRound.relique.value.length;
            const nombreRandom = (min,max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const handleTypeCarte = (index) => {
                if (index <= carteStayForRound.danger.value.length) {
                    setCartesPlayed(cartesPlayed => [...cartesPlayed, carteStayForRound['danger']['value'][index - 1]]);
                    return ['danger', carteStayForRound['danger']['value'][index - 1]];
                } else if (index <= carteStayForRound.danger.value.length + carteStayForRound.tresor.value.length) {
                    const newIndex = index - carteStayForRound.danger.value.length;
                    setCartesPlayed(cartesPlayed => [...cartesPlayed, carteStayForRound['tresor']['value'][newIndex - 1]]);
                    return ['tresor', carteStayForRound['tresor']['value'][newIndex - 1]];
                } else if (index <= carteStayForRound.danger.value.length + carteStayForRound.tresor.value.length + carteStayForRound.relique.value.length) {
                    const newIndex = index - (carteStayForRound.danger.value.length + carteStayForRound.tresor.value.length);
                    return ['relique', carteStayForRound['relique']['value'][newIndex - 1]];
                }
            }
            const nbr = nombreRandom(1,nbrCartes);
            const type = handleTypeCarte(nbr);

            if (type[0]) {
                const newArray = [];
                let pushedDanger = false;
                for (let i = 0; i < jeuCartes[type[0]]['value'].length; i++) {
                    if (!pushedDanger){
                        if (jeuCartes[type[0]]['value'][i] === type[1]) {
                            pushedDanger = true;
                        } else {
                            newArray.push(jeuCartes[type[0]]['value'][i]);
                        }
                    } else {
                        newArray.push(jeuCartes[type[0]]['value'][i]);
                    }
                }
                const newJson = {};
                newJson[type[0]] = {}
                newJson[type[0]]['value'] = newArray;
                setCarteStayRound({...carteStayForRound, ...newJson})
            }
            if (Array.isArray(type)) {
                if (type[0] === 'tresor') {
                    if (type[1].length === 7) {
                        const value = parseInt(type[1].slice(type[1].length - 1,type[1].length));
                        const resteLocal = value % arrayActifPlayers.length;
                        const nbrByUsers = parseInt((value - resteLocal) / arrayActifPlayers.length);
                        const newJsonPlayers = {}
                        Object.keys(players).map(
                            x => {
                                newJsonPlayers[x] = {...players[x]};
                                if (newJsonPlayers[x]["decision"] === "continue"){
                                    newJsonPlayers[x]["thuneRound"] =  parseInt(players[x]["thuneRound"]) + nbrByUsers
                                }
                            }
                        )
                        setPlayers(newJsonPlayers);
                        if (resteLocal > 0) {
                            setReste(prevState => prevState + resteLocal);
                        }
                    } else {
                        const value = parseInt(type[1].slice(type[1].length - 2,type[1].length));
                        const resteLocal = value % arrayActifPlayers.length;
                        const nbrByUsers = parseInt((value - resteLocal) / arrayActifPlayers.length);
                        const newJsonPlayers = {}
                        Object.keys(players).map(
                            x => {
                                newJsonPlayers[x] = {...players[x]};
                                if (newJsonPlayers[x]["decision"] === "continue"){
                                    newJsonPlayers[x]["thuneRound"] =  parseInt(players[x]["thuneRound"]) + nbrByUsers
                                }
                            }
                        )
                        setPlayers(newJsonPlayers);
                        if (resteLocal > 0) {
                            setReste(prevState => prevState + resteLocal);
                        }
                    }
                }
                else if (type[0] === 'danger') {
                    const newArrayBis = [];
                    newArrayBis.push(type[1])
                    setNbrCarteDanger(prevState => [...nbrCarteDanger, ...newArrayBis])
                    const found = cartesPlayed.find(element => element === type[1]);
                    if (found) {
                        const newArray = [];
                        let pushedDanger = false;
                        for (let i = 0; i < jeuCartes['danger']['value'].length; i++) {
                            if (!pushedDanger){
                                if (jeuCartes['danger']['value'][i] === type[1]) {
                                    pushedDanger = true;
                                } else {
                                    newArray.push(jeuCartes['danger']['value'][i]);
                                }
                            } else {
                                newArray.push(jeuCartes['danger']['value'][i]);
                            }
                        }
                        const newJson = {...jeuCartes, danger : { value : newArray}};
                        setJeuCartes(setJeuCartes => newJson);
                        if (localPlayers[route.params["User"]]["decision"] === "continue" ) {
                            createAlert();
                        }

                    }
                }
                else if (type[0] === 'relique') {
                    const resteRelique = {...carteStayForRound};
                    const newArray = [];
                    let nbrRelique = 0;
                    if (resteRelique["relique"]["value"].length > 2) {
                        nbrRelique = 5;
                    } else {
                        nbrRelique = 10;
                    }
                    nbrRelique = "relique " + nbrRelique;
                    for (let i = 0; i < resteRelique["relique"]["value"].length; i++) {
                        if (i === 0) {
                            setReliqueRound(prevState => [...prevState, nbrRelique])
                        } else {
                            newArray.push(resteRelique["relique"]["value"][i])
                        }
                    }
                    const newJson = {...jeuCartes, relique : { value : newArray}};
                    setJeuCartes(setJeuCartes => newJson);
                    setCartesPlayed(prevState => [...prevState, nbrRelique]);
                }
            }
        }

    }
    const createAlert = () => {
        Alert.alert(
            "Perdu",
            "Vous avez perdu tout votre argent de ce round",
            [
                {
                    text : "Next Round",
                    onPress: () => {setUserWantNewRound(true)},
                    style: "cancel"
                }
            ]
        )
    }

    const restartTheGame = () => {
        setReste(0);
        setNbrCarteDanger([]);
        setPlayersChoiceDone(false);
        setJeuCartes(jeuCartesINIT);
        setCarteStayRound(jeuCartesINIT);
        setRound(1);
        setCartesPlayed([]);
        setReliqueRound([]);
        setStartTheGame(true);
    }

    const roundSuivant = (cartes) => {
        setReste(0);
        setNbrCarteDanger([]);
        setPlayersChoiceDone(false);
        setCarteStayRound(cartes);
        setCartesPlayed([]);
        const newJson = {...players};
        Object.values(newJson).map(
            x => {
                x.decision = "continue";
                x.thuneRound = 0;
            }
        )
        setPlayers(newJson);
        if (round < 5) {
            setRound(round => round + 1);
        } else {
            Alert.alert(
                "Fin de la partie",
                `${Object.entries(players).map(x => x[0] + " a scoré : " + parseInt(x[1].thuneFinal + x[1].reliqueFinal) + "\n")}`
                ,
                [
                    {
                        text : "recommencer la partie",
                        onPress : () => {restartTheGame()}
                    }
                ]
            )
        }
    }

    const sortir = (localPlayers, localPplWantLeave) => {
            const resteDuReste = reste % localPplWantLeave.length;
            const resteDivByLeave = parseInt(( reste - resteDuReste) / localPplWantLeave.length);
            const newJson = {...localPlayers};
            Object.entries(localPlayers).map(
                x => {
                    const found = localPplWantLeave.find(element => element === x[0]);
                    if (found) {
                        newJson[x[0]]["thuneFinal"] = newJson[x[0]]["thuneFinal"] + newJson[x[0]]["thuneRound"] + resteDivByLeave;
                        newJson[x[0]]["thuneRound"] = 0;
                    }
                }
            )
            setReste(resteDuReste);
            if (localPplWantLeave.length === 1){
                let thuneRelique = 0;
                reliqueRound.map(
                    x => {
                        thuneRelique = thuneRelique + parseInt(x.split(" ")[1])
                    }
                )
                newJson[localPplWantLeave[0]]["reliqueFinal"] = parseInt(newJson[localPplWantLeave[0]]["reliqueFinal"] + thuneRelique);
                setReliqueRound([]);
            }
            return newJson;
    }

    useEffect(() => {
        if (!startTheGame) {
            if (!playersChoiceDone && players[route.params["User"]]["decision"] === "sortir" && cartesPlayed.length > 0){
                setTimeout(() => {
                    handleChoiceUser();
                }, 1200)
            }
        }
    }, [cartesPlayed])

    let valueRelique = 0;
    reliqueRound.forEach(
        x => {
            valueRelique = parseInt(valueRelique + x.split(" ")[1])
        }
    )

    useEffect(() => {
        if (Object.keys(players).length > 0) {
            let value = 0;
            for (let i = 0; i < Object.values(players).length; i++) {
                if (i === 0) {
                    value = Object.values(players)[i]["thuneRound"];
                }else {
                    if (Object.values(players)[i]["thuneRound"] > value){
                        value = Object.values(players)[i]["thuneRound"]
                    }
                }
            }
            setMaxThuneRound(value);
        }
    }, [players])
    return(
        <View style={styles.pageContainer}>
            <BackgroundImage source={backImage} style={{flex : 1}} resizeMode="cover">
                <View style={styles.containerRound}>
                    <Text style={styles.textRound}>ROUND {round} / 5</Text>
                </View>
                <View style={styles.containerInfoRound}>
                    <View style={styles.containerCard}>
                        <View style={{flex : 1 , position : "relative", flexDirection: "row", alignItems : "center"}}>
                            <View style={{justifyContent : "center", alignItems : "center"}}>
                                <Image
                                    style={{height : 45, width : 45}}
                                    source={ReliqueImg}
                                />
                                <Text>{valueRelique}</Text>
                            </View>
                            <Image
                                style={{width : 160, height : 160}}
                                source={carteImg}
                            />
                            <View style={{justifyContent : "center", alignItems : "center"}}>
                                <Text>Reste : </Text>
                                <Text>{reste}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.containerTextCard}>
                        <View style={styles.containerTextRubis}><Text style={[styles.textCard, cartesPlayed[cartesPlayed.length - 1] && {backgroundColor : 'rgba(0, 0, 0, 0.3)'}]}>{cartesPlayed[cartesPlayed.length - 1]}</Text></View>
                        <View style={styles.containerRubisInfoRound}>
                            <Image
                                style={{width : 50, height : 50}}
                                source={rubisImg}
                            />
                            <Text>
                                {maxThuneRound}
                            </Text>
                        </View>
                    </View>

                </View>
                <View style={styles.resultBots}>
                    <View style={styles.containerBots}>
                        {
                            Object.keys(players).length > 0
                            &&
                            Object.entries(players).map(
                                x =>
                                    x[1].type === "bot"
                                    &&
                                    <View key={x[0]} style={styles.containerUniqueBot}>
                                        {
                                            x[1].decision === "continue"
                                                ?
                                                <Image
                                                    style={{width : 50, height : 50}}
                                                    source={botIconContinue}
                                                />
                                                :
                                                <Image
                                                    style={{width : 50, height : 50}}
                                                    source={botIconSortir}
                                                />
                                        }
                                        <Text key={x[0]}>{x[0]}</Text>
                                        <View style={{flexDirection : "row", justifyContent : "center", alignItems : "center"}}>
                                            <View style={{justifyContent : "center", alignItems : "center"}}>
                                                <Image
                                                    style={{width : 30, height : 30}}
                                                    source={coffreFort}
                                                />
                                                <Text key={x[1].thuneFinal}>{parseInt(x[1].thuneFinal)}</Text>
                                            </View>
                                            <View style={{justifyContent : "center", alignItems : "center"}}>
                                                <Image
                                                    style={{width : 30, height : 30}}
                                                    source={ReliqueImg}
                                                />
                                                <Text key={x[1].thuneFinal}>{parseInt(x[1].reliqueFinal)}</Text>
                                            </View>

                                        </View>
                                    </View>
                            )
                        }
                    </View>
                </View>
                <View style={styles.resultUser}>
                    <View><Text style={{fontSize : 18}}>{Object.keys(players)[0]}</Text></View>
                    <View style={styles.resultSecondContainerUser}>
                        <View style={styles.containerChoiceUser}>
                            <View style={styles.containerUniqueChoice}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        players[route.params["User"]]["decision"] === "continue"
                                        &&
                                        handleChoiceUser("continue")}
                                    }
                                >
                                    <Image
                                        style={{width: 50, height: 80}}
                                        source={continuerImg}
                                    />
                                </TouchableWithoutFeedback>
                                <Text>Continuer</Text>
                            </View>
                            <View style={styles.containerUniqueChoice}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        players[route.params["User"]]["decision"] === "continue"
                                        &&
                                        handleChoiceUser("sortir")}
                                    }
                                >
                                    <Image
                                        style={{width: 50, height: 80}}
                                        source={sortirImg}
                                    />
                                </TouchableWithoutFeedback>
                                <Text>Sortir</Text>
                            </View>
                        </View>
                        <View style={styles.containerNbrInfoUser}>
                            <View style={styles.containerUniqueNbr}>
                                <Image
                                    style={{height : 70, width : 70}}
                                    source={coffreFort}
                                />
                                <Text style={{color : 'black'}}>{
                                    Object.keys(players).length > 0
                                    &&
                                    players[route.params["User"]]["thuneFinal"]
                                }</Text>
                            </View>
                            <View style={styles.containerUniqueNbr}>
                                <Image
                                    style={{height : 70, width : 70}}
                                    source={ReliqueImg}
                                />
                                <Text style={{color : 'black'}}>{
                                    Object.keys(players).length > 0
                                    &&
                                    players[route.params["User"]]["reliqueFinal"]
                                }</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </BackgroundImage>
        </View>
    )
}
const styles = StyleSheet.create({
    resultSecondContainerUser : {
        flexDirection : "row",
    },
    containerUniqueBot : {
        justifyContent : "center",
        alignItems : "center"
    },
    containerTextRubis : {
        alignItems : "center",
        justifyContent : "center",
        position : "relative",
    },
    containerBots : {
        flexDirection : "row",
        justifyContent : "space-around"
    },
    containerRubisInfoRound : {
        alignItems : "center",
        position : "relative",
        top : 60,
    },
    containerUniqueNbr : {
        flexDirection : "column",
        alignItems : "center"
    },
    containerNbrInfoUser : {
        flexDirection : "row",
        justifyContent : "space-around",
        flex : 2
    },
    containerUniqueChoice : {
        flexDirection : "column",
        alignItems : "center",
        justifyContent : "center",
    },
    containerChoiceUser : {
        flex : 1,
        paddingLeft : 20,
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
    },
    resultUser : {
        flex : 1,
        alignItems : "center"
    },
    pageContainer : {
        flex : 1,
    },
    resultBots : {
        flex : 2,
    },
    containerRound : {
        alignItems : "center",
        justifyContent : "center",
        marginTop : 30,
        flex : 1/2
    },
    textCard : {
        fontSize : 24,
        color : 'white',
        fontWeight : "600"
    },
    containerInfoRound : {
        flex : 2
    },
    containerCard : {
        alignItems : "center",
        flex : 3
    },
    containerTextCard : {
        flex : 1,
        position : "relative",
        top : -120,
    }
})
export default TheGame;