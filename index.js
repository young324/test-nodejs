//index.js

﻿var express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
var mongoose = require('mongoose');//mongodb
var bodyParser = require('body-parser');//웹브라우저의 form으로 전송된 data를 서버에서 사용하기 위해
var app = express(); //express를 실행하여 app object를 초기화 합니다.

//DB setting...
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
//process.env 오브젝트는 환경변수들을 가지고 있는 객체
//MONGO_DB라는 이름의 환경변수에 DB connection string을 저장하였기 때문에 MONGO_DB로 불러온다
var db = mongoose.connection;//db object를 가져와 db변수에 넣음

db.once('open', function(){//db연결은 한번만 발생되면 되므로 once
  console.log('DB connected');
});//db가 연결되면 출력

db.on('error', function(err){//에러는 다양한 경우에 일어날 수 있기때문에 on
  console.log('DB ERROR : ', err);
});


//Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());//json형식의 데이터를 받는다
//req.body에서 form으로 입력받은 데이터를 사용할 수 있다.
app.use(bodyParser.urlencoded({extended:true}));//urlencoded data를 extended알고리즘을 사용해서 분석한다.

//DB schema
var contactSchema = mongoose.Schema({
  name:{type:String, require:true, unique:true},//값이 반드시 입력되어야함(require), 중복되면 안됨(unique)
  email:{type:String},
  phone:{type:String}
});//DB에서 사용할 스키마 설정, 데이터베이스에 정보를 어떤 형식으로 저장할지 지정
//contactSchema는 name, email, phone이라는 항목들을 가지고있다.
var Contact = mongoose.model('contact',contactSchema);
//mongoose.model함수를 사용하여 contactSchema의 model생성
//첫번째 파라미터 'contact'는 mongoDB에서 사용되는 콜렉션의 이름,
//두번째 파라미터는 contactSchema라는 데이터 콜렉션을 현재 선언한 Contact변수에 연결
//생성된 Contact는 mongoDB에 접근하여 data를 변경할 수 있는 함수들을 가지고있다.

//Routes
//Home
app.get('/',function(req,res){
  res.redirect('/contacts');
})


//port setting...
var port = 3000; // 사용할 포트 번호를 port 변수에 넣습니다.
app.listen(port, function(){ // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:'+port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});
