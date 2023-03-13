import React, { useCallback, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import { Alert, Dimensions, StatusBar } from 'react-native';
import Input from './components/Input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppLoading } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0px 20px; /* y축 x축 */
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const width = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false); //로딩여부 체크
  const [newTask, setNewTask] = useState('');

  const [tasks, setTasks] = useState({});
  // { 샘플데이터 생략 후 useState에는 빈객체({})
  //   1: { id: '1', text: 'Hanbit', completed: false },
  //   2: { id: '2', text: 'React Native', completed: true },
  //   3: { id: '3', text: 'React Native Sample', completed: false },
  //   4: { id: '4', text: 'Edit TODO Item', completed: false },
  //  }

  //추가, 변동, 삭제 시 스토리지에서 호출
  const _saveTasks = async tasks => {
    try {
      // const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  //앱이 첫구동이 될때 스토리지에서 값을 읽어와 호출이됨
  const _loadTasks = async () => {
    try {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      // return jsonValue != null ? JSON.parse(loadedTasks) : null;
      setTasks(JSON.parse(loadedTasks || '{}'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await _loadTasks();
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const _addTask = () => {
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };

    setNewTask('');
    setTasks({ ...tasks, ...newTaskObject });
    // alert(`입력하시겠습니까?: ${newTask}`);
  };

  const _deleteTask = id => {
    const currentTasks = { ...tasks }; //Object.assign({},item,{text})
    // delete currentTasks[id];
    // setTasks(currentTasks);
    Alert.alert('', '삭제하시겠습니까?', [
      {
        text: '아니오',
        onPress() {
          console.log('아니오');
        },
      },
      {
        text: '예',
        onPress() {
          console.log('예');
          delete currentTasks[id];
          _saveTasks(currentTasks);
        },
      },
    ]);
  };

  const _toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    // setTasks(currentTasks);
    _saveTasks(currentTasks);
  };

  const _updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    setTasks(currentTasks);
  };

  const _handleTextChange = text => {
    setNewTask(text);
    console.log(`변경된문자열:${newTask}`);
  };

  // const _onPressOut = () => alert('완료');

  const _onBlur = () => {
    setNewTask('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          value={newTask}
          placeholder="+ Add a Task"
          onChangeText={_handleTextChange} //수정시
          onSubmitEditing={_addTask} //완료버튼
          onBlur={_onBlur} //포커스 잃었을때
        />

        {/* <IconButton type={images.uncompleted} />
        <IconButton type={images.completed} />
        <IconButton type={images.delete} />
        <IconButton type={images.update} /> */}

        <List width={width}>
          {/* <Task text="Hanbit" />
          <Task text="React Native" />
          <Task text="React Native Sample" />
          <Task text="Edit TODO Item" /> */}
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              />
            ))}
        </List>
      </Container>
    </ThemeProvider>
  );
};

export default App;
