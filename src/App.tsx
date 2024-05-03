import {useState,useEffect} from 'react';
import Appbar from './component/Appbar';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './App.css';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { initializeApp } from "firebase/app";
import { Firestore, deleteDoc, getFirestore } from "firebase/firestore";
import { collection,addDoc,doc,query,getDocs,where,orderBy,setDoc} from "firebase/firestore";
import React from 'react';
import {db} from './firebase'
import StickyHeadTable from  './component/table';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';

interface ObservationData {
  id: string;
  carNo: string;
  obserbDay: string;
  obserbTime: string;
  obserbTime2: string;
}

function App() { 
  const today = new Date();
  
  const [carNo, setCarNo] = useState('11号車(1111)');
  const [name, setName] = useState('成田');

  const [data, setData] = useState<any[][]>([]);
  const [open, setOpen] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);

  
  const [inputDay, setInputDay] = React.useState<Dayjs | null>(dayjs(today));
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs('2024-2-16T24:00'));
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs('2024-2-16T24:00'));
  const inputDate=dayjs(inputDay).format("MM/DD")


  const cars=["11号車(1111)","12号車(2222)","13号車(3333)","14号車(4444)"]
 
  const handleClick= async ()=>{
    const inputDate=dayjs(inputDay).format("MM/DD")
    const inputStartTime=dayjs(startTime).format("HH:mm")
    const inputEndTime=dayjs(endTime).format("HH:mm")
    setOpen(false);

    
  if(inputStartTime==inputEndTime){
    alert("開始時間と終了時間が同じです")
    return false
  }

  if(inputStartTime>inputEndTime){
    alert("開始時間と終了時間が逆転しています")
    return false
  }
  
  //array someを使ってエラーが出たらその場で終了のを作った
  const isCarFound = data.some(carArray => {
    const findStartTime = 
          carArray.find(carItem =>
                 carItem.data.obserbTime <= inputStartTime &&
                  carItem.data.obserbTime2 > inputStartTime &&
                   carItem.data.carNo == carNo);
                   //開始時間がすでにある開始時間と終了時間の間にある場合
     
                   
    if (findStartTime) {
      alert("エラー: 開始時間がおかしいですよ");
      return true; // 条件に一致する要素が見つかったので、some()メソッドの処理を停止します
    }
      return false; // 条件に一致する要素が見つからなかったので、処理を続けます
  });

  if (isCarFound) {
    console.log("ループを終了しました");
    return false
  } else {
    console.log("一致する要素は見つかりませんでした");
  }

  const isCarFound2 = data.some(carArray => {
    const findEndTime = 
          carArray.find(carItem =>
                 carItem.data.obserbTime < inputEndTime &&
                  carItem.data.obserbTime2 >= inputEndTime &&
                   carItem.data.carNo == carNo);
                   //終了時間がすでにある開始時間と終了時間の間にある場合
     
                   
    if (findEndTime) {
      alert("エラー: 終了時間がおかしいですよ");
      return true; // 条件に一致する要素が見つかったので、some()メソッドの処理を停止します
    }
    return false; // 条件に一致する要素が見つからなかったので、処理を続けます
  });
  if (isCarFound2) {
    console.log("ループを終了しました");
    return false
  } else {
    console.log("一致する要素は見つかりませんでした");
  }

  const isCarFound3 = data.some(carArray => {
    const findbetweenTime = 
          carArray.find(carItem =>
                 carItem.data.obserbTime >= inputStartTime &&
                  carItem.data.obserbTime2 <= inputEndTime &&
                   carItem.data.carNo == carNo);
                   //開始時間と終了時間ですでにある開始時間と終了時間を挟む場合
     
                   
    if (findbetweenTime) {
      alert("エラー: 開始時間がなんかおかしいですねぇ");
      return true; // 条件に一致する要素が見つかったので、some()メソッドの処理を停止します
    }
    return false; // 条件に一致する要素が見つからなかったので、処理を続けます
  });


  if (isCarFound3) {
    console.log("ループを終了しました");
    return false
  } else {
    console.log("一致する要素は見つかりませんでした");
  }
  
  const carDetail={
    carNo:carNo,
    obserbDay:inputDate,
    obserbTime:inputStartTime,
    obserbTime2:inputEndTime,
    name:name
  }

    await addDoc(collection(db,"cars"),carDetail)
    
    const usersRef = collection(db, "cars");
    const q = query(usersRef,where("obserbDay", "==", inputDate));
  
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => (
      { id: doc.id, data: doc.data()}));
    
    //obserbTimeをまずは数字に直す→stringなので、sortできない

      const timeToMinutes = (timeStr:any) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      let filteredCars = [];
      
      for (let car of cars) {
        const filteredData = newData.filter(data => data.data.carNo == car);
      
        // 文字列の時間を分に変換してからソート
        const sortedData = filteredData.sort((a, b) => {
          return timeToMinutes(a.data.obserbTime) - timeToMinutes(b.data.obserbTime);
        });
      
        filteredCars.push(sortedData);
      }
      
      // ソートされたデータで状態を更新
      setData(filteredCars);
      
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCarNo(event.target.value as string);
  }


  const handleName = (event: SelectChangeEvent) => {
    setName(event.target.value as string);
  }

  const deleteClick = async (id: string) => {
    await deleteDoc(doc(db, "cars", id)); // Firebaseからの削除
      //arrayの場合はmapをかけてデータを取り出し、その中で1つ1つフィルターをかけていく(編集も同じ)
    const newFilteredData = data.map(innerArray =>   
      innerArray.filter(item => item.id !== id)
    );
    
    setData(newFilteredData);
    setOpen(false);

  };
  
  useEffect(() => {
      (async () => {
        const inputDate = dayjs(inputDay).format("MM/DD"); 
        const usersRef = collection(db, "cars");
        const q = query(usersRef,where("obserbDay", "==", inputDate));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));   
        
        const timeToMinutes = (timeStr:any) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        let filteredCars = [];
        
        for (let car of cars) {
          const filteredData = newData.filter(data => data.data.carNo == car);
        
          // 文字列の時間を分に変換してからソート
          const sortedData = filteredData.sort((a, b) => {
            return timeToMinutes(a.data.obserbTime) - timeToMinutes(b.data.obserbTime);
          });
        
          filteredCars.push(sortedData);
          }
          setData(filteredCars)
          })();
       }, [carNo,inputDate]);

//ダイアログ用
const handleClickOpen = (id: string) => {
  setOpenId(id);
};

const handleClose = () => {
  setOpenId(null);
};

  return (

    <Grid className="grd" container direction="column">
      <Grid item>
        <Appbar />
      </Grid>
      <div className="App">
      <Grid item container spacing={2}>
        <Grid item sm={1}/>
        <Grid item sm={1}>
          <Button><Link to="/App2"><h3>次のページへ</h3></Link></Button>
        </Grid>
        <Grid item sm={2}>
        <label>号車　　</label>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={carNo}
                label="carNo"
                onChange={handleChange}
              >
                <MenuItem value={"11号車(1111)"}>11号車(1111)</MenuItem>
                <MenuItem value={"12号車(2222)"}>12号車(2222)</MenuItem>
                <MenuItem value={"13号車(3333)"}>13号車(3333)</MenuItem>
                <MenuItem value={"14号車(4444)"}>14号車(4444)</MenuItem>

            </Select>
            <p></p>
            <label>使用者　</label>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={name}
                label="使用者"
                onChange={handleName}
              >
                <MenuItem value={"成田"}>成田</MenuItem>
                <MenuItem value={"八重樫"}>八重樫</MenuItem>
                <MenuItem value={"吉田"}>吉田</MenuItem>
            </Select>
          </Grid>
          <Grid item sm={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker
                    label="予約日時"
                    value={inputDay}
                    format="YY/M/D"
                    onChange={(newValue) => setInputDay(newValue)}
                    
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

          <Grid item sm={2} >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker', 'TimePicker']}>
                  <TimePicker
                    label="開始時間"
                    value={startTime}
                    ampm={false}
                    onChange={(newStartTime) => setStartTime(newStartTime)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker', 'TimePicker']}>
                  <TimePicker
                    label="終了時間"                 
                    value={endTime}
                    ampm={false}
                    onChange={(newEndTime) => setEndTime(newEndTime)}
                  />
                </DemoContainer>
              </LocalizationProvider>

          </Grid>

          <Grid item sm={1}>
            <Button variant="contained" size="large" onClick={handleClick}>
              予約
            </Button>
          </Grid>
          <Grid item container>

            <Grid item sm={1}/>
            <h1>{inputDate}</h1>
            </Grid>
            
            <Grid item container>
            <Grid item sm={1}/>
            
              {data.map((carData, Index) => (
              <Grid item sm={2.5}>
                    <h2>{cars[Index]}</h2>
                      <div key={Index}> 
                        {carData.map((item) => (
                          <tr key={item.data.id}>
                            <td>{item.data.obserbTime}</td>
                            <td>～</td>
                            <td>{item.data.obserbTime2}</td>
                            <td>【{item.data.name}】</td>
                            <td>                       
                            <Button variant="contained"  color="primary" onClick={() => handleClickOpen(item.id)}>
                              削除
                            </Button>
                                <Dialog
                                  open={item.id === openId}
                                  onClose={handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"削除確認"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      削除しますがよろしいですか？
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                  <Button size="large" variant="contained" color="success" 
                                     onClick={()=>deleteClick(item.id)}>はい</Button>
                                    <Button onClick={handleClose} variant="contained" color="success">いいえ</Button>
                                  </DialogActions>
                                </Dialog>
                            </td>
                          </tr>
                        ))}
                      </div>
                </Grid>
                )) 
              }
              
              {/* <StickyHeadTable/> */}
            </Grid>
          </Grid>
         </div>  
      </Grid>
  );
}

export default App;
