import React, {useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block, QuizGroupCard, BottomMenu} from '../components/';
import {TouchableOpacity} from "react-native";
import apiCaller from "../config/apiCaller";
import {IQuizGroupCard} from "../constants/types";
import Tabs from "../components/Tabs";

const QuizGroupListScreen = ({navigation}) => {

    const [tab, setTab] = useState<number>(0);
    const [filteredQuizGroupCards, setFilteredQuizGroupCards] = useState([{}]);
    const [quizGroupCards, setQuizGroupCards] = useState([{}]);
    const {sizes} = useTheme();

    useEffect(() => {
        apiCaller('quiz-group/get-quiz-groups-with-user-quiz-data', 'POST', {pageSize: 25, page: 0})
            .then(response => {
                let dataList = response?.quizGroupWithUserDataList;
                setQuizGroupCards(dataList);
                setFilteredQuizGroupCards(dataList?.filter((card: IQuizGroupCard) => card?.userSolvedCount !== card?.quizQuantity));
            });
    }, []);

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizGroupCards(quizGroupCards.filter((card: IQuizGroupCard) => card?.userSolvedCount !== card?.quizQuantity));
        } else {
            setFilteredQuizGroupCards(quizGroupCards.filter((card: IQuizGroupCard) => card?.userSolvedCount === card?.quizQuantity));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    const onPressQuizGroupCard = (card: IQuizGroupCard) => (
        navigation.navigate('QuizListScreen', {quizGroupId: card.id, quizGroupTitle: card.title})
    );

    return (
        <Block>
            <Tabs tabOneText={'home.filter1'} tabTwoText={'home.filter2'} callback={setTabChange}
                  title={'Quiz Groups'}/>

            {/* quizGroupCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizGroupCards?.map((card: IQuizGroupCard) => (
                        <TouchableOpacity key={`card-${card?.id}`} onPress={() => onPressQuizGroupCard(card)}>
                            <QuizGroupCard  {...card}/>
                        </TouchableOpacity>
                    ))}
                </Block>
            </Block>
            <BottomMenu/>
        </Block>
    );
};

export default QuizGroupListScreen;
