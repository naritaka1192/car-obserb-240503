import {
  Avatar,Box,Button,Checkbox,FormControlLabel,Grid,
  Paper,Stack,TextField,Typography
} from "@mui/material";
import { teal } from "@mui/material/colors";
import React,{useState} from "react"
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged ,signInWithEmailAndPassword, signOut } from "firebase/auth";
import {useNavigate} from 'react-router-dom'
import { auth } from '../firebase';

const Signin = () => {
  const navigate=useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")

  const handleEmail=(e: { target: { value: React.SetStateAction<string>; }; })=>{
    setEmail(e.target.value)    
  }

  const handlePassword=(e: { target: { value: React.SetStateAction<string>; }; })=>{
    setPassword(e.target.value)
  }

  const handleSignin=(e: { preventDefault: () => void; })=>{
    e.preventDefault()
    
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          alert("ログイン成功: " + userCredential.user.email);
          navigate('/App');
        })
        .catch((error) => {
          alert("ログインに失敗しました");
        });
        }
    
  const handleSignup= ()=>{
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        alert("登録成功: " + userCredential.user.email);
      })
      .catch((error) => {
        alert("エラー: " + error.message);
      });
  }

  const handleSignout=()=>{
    const auth = getAuth();
signOut(auth).then(() => {
  alert("サインアウト")
}).catch((error) => {
  alert("エラー")
});

  }

  return (
    <Grid>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: "70vh",
          width: "280px",
          m: "20px auto"
        }}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start" //多分、デフォルトflex-startなので省略できる。
          alignItems="center"
        >
          <Avatar sx={{ bgcolor: teal[400] }}>
          </Avatar>
          <Typography variant={"h5"} sx={{ m: "30px" }}>
            サインイン
          </Typography>
        </Grid>
        
        <TextField type="email" placeholder="email入力ね" 
        id="outlined-basic" label="e-mail入力" variant="standard" 
        fullWidth  required onChange={handleEmail}/>
        
        <TextField type="password" label="Password" variant="standard"
          fullWidth  required onChange={handlePassword}
        />
        {/* ラベルとチェックボックス */}
        {/* <FormControlLabel
          labelPlacement="end"
          label="パスワードを忘れました"
          control={<Checkbox name="checkboxA" size="small" color="primary" />}
        /> */}
        <Box mt={3}>
          <Button type="submit" color="primary" variant="contained" fullWidth onClick={handleSignin}>
            サインイン
          </Button>
        <p></p>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={handleSignout}>
            サインアウト
          </Button>
        <p></p>
          <Button color="success" variant="contained" onClick={handleSignup}>新規登録</Button>
        <p></p>
        <Link to="/">戻る</Link>

          {/* <Typography variant="caption">
            <Link href="#">パスワードを忘れましたか？</Link>
          </Typography>
          <Typography variant="caption" display="block">
            アカウントを持っていますか？
            <Link href="#">アカウントを作成</Link>
          </Typography> */}
        </Box>
      </Paper>
    </Grid>
  );
};

// export default Signin
export default Signin