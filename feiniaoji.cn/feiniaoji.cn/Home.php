<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Home extends Controller{
    //用户授权
  public  function index(){
      $JSCODE     = $_GET['code'];
      $nickname   = $_GET['nickname'];
      $headerimg  = $_GET['headerimg'];
      $APPID  = 'wx044cb6546edbd8a2';
      $SECRET = '0e6031b7107cc13fdfb4d2e4fddd9845';
      $url    = "https://api.weixin.qq.com/sns/jscode2session?appid=$APPID&secret=$SECRET&js_code=$JSCODE&grant_type=authorization_code";
      $data = file_get_contents($url);
// var_dump($data);
      $arr = json_decode($data,true);

      // if(!empty($arr)) {
      //     $openid         = $arr['openid'];
      //     $res['err']     = 1;
      //     $res['openid']  = $openid;
      //     $list = Db::table('fly_user')->where(['openid'=>$openid])->find();
      //     $map['openid']    = $openid;
      //     $map['nickname']  = base64_encode($nickname); 
      //     $map['headerimg'] = $headerimg;
          
      //       if(!empty($list)){
      //         $map['updatetime']  = time();
      //         Db::table('fly_user')->where(['openid'=>$openid])->update($map);
      //       }else{
      //         $map['dateline']  = time();
      //         Db::table('fly_user')->insert($map); 
      //       }  
         
      //  }
       echo json_encode($arr);

  }
  public function getAccessToken($appid,$secret){

       $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$appid}&secret={$secret}";

        $res = $this->curl_get($url);

        $res = json_decode($res,1);

        return $res['access_token'];

    }

//获取模板消息内容主体

//因为是测试所以写死，大家可以通过传参的方式获取

    public function getMsg($openid,$template_id,$form_id,$ordernumber,$moneys1,$goodname,$starttime,$endtime,$date,$username,$phone,$emphasis_keyword='keyword1'){

        $data['data']= [
          // 'keyword1'=>array('value'=>urlencode("$ordernumber"),'color'=>'#FF0000'),  //keyword需要与配置的模板消息对应
        // 'keyword2'=>array('value'=>urlencode("$moneys1"),'color'=>'#FF0000'),
        // 'keyword3'=>array('value'=>urlencode("$goodname"),'color'=>'#FF0000'),
        // 'keyword4'=>array('value'=>urlencode("$starttime"),'color'=>'#FF0000'),
        // 'keyword5'=>array('value'=>urlencode("$endtime"),'color'=>'#FF0000'),
        // 'keyword6'=>array('value'=>urlencode("$date"),'color'=>'#FF0000'),
        // 'keyword7'=>array('value'=>urlencode("$username"),'color'=>'#FF0000'),
        // 'keyword8'=>array('value'=>urlencode("$phone"),'color'=>'#FF0000'),


        'keyword1'=>['value'=>'ordernumber','color'=>'#FF0000'],
        'keyword2'=>['value'=>'moneys1','color'=>'#FF0000'],
        'keyword3'=>['value'=>'goodname','color'=>'#FF0000'],
        'keyword4'=>['value'=>'starttime','color'=>'#FF0000'],
        'keyword5'=>['value'=>'endtime','color'=>'#FF0000'],
        'keyword6'=>['value'=>'date','color'=>'#FF0000'],
        'keyword7'=>['value'=>'username','color'=>'#FF0000'],
        'keyword8'=>['value'=>'phone','color'=>'#FF0000']

        ];//内容主体

        $data['touser'] = $openid;//用户的openid

        $data['template_id'] = $template_id;//从微信后台获取的模板id

        $data['form_id'] = $form_id;//前端提供给后端的form_id

        $data['page'] = '';//小程序跳转页面

        $data['emphasis_keyword'] = $emphasis_keyword;//选择放大的字体

        return $data;

    }



    public function getMsg1($openid,$template_id,$form_id,$name,$text,$phone,$emphasis_keyword='keyword1'){

        $data['data']= [
        'keyword1'=>['value'=>"$name",'color'=>'#FF0000'],
        'keyword2'=>['value'=>"$text",'color'=>'#FF0000'],
        'keyword3'=>['value'=>"$phone",'color'=>'#FF0000']
        ];//内容主体

        $data['touser'] = $openid;//用户的openid

        $data['template_id'] = $template_id;//从微信后台获取的模板idPhBsDcp1dSMgdkb8bR_nCG1XsoonLU42WzhM8f8FXRY

        $data['form_id'] = $form_id;//前端提供给后端的form_id

        $data['page'] = '';//小程序跳转页面

        $data['emphasis_keyword'] = $emphasis_keyword;//选择放大的字体

        return $data;

    }

    public function send($appid,$secret,$openid,$template_id,$form_id,$ordernumber,$moneys1,$goodname,$starttime,$endtime,$date,$username,$phone,$num){

        $access_token = $this->getAccessToken($appid,$secret);

        $send_url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' . $access_token;
        if($num ==1 ){
          $data = $this->getMsg($openid,$template_id,$form_id,$ordernumber,$moneys1,$goodname,$starttime,$endtime,$date,$username,$phone);
        }else{
          $data = $this->getMsg1($openid,$template_id,$form_id,$ordernumber,$moneys1,$goodname);
        }

        

        $str = $this->curl_post($send_url,json_encode($data));

        $str = json_decode($str,1);

        return $str;

    }

    public function curl_post($url, $fields, $data_type='text')

    {

        $cl = curl_init();

        if(stripos($url, 'https://') !== FALSE) {

            curl_setopt($cl, CURLOPT_SSL_VERIFYPEER, FALSE);

            curl_setopt($cl, CURLOPT_SSL_VERIFYHOST, FALSE);

            curl_setopt($cl, CURLOPT_SSLVERSION, 1);

        }

        curl_setopt($cl, CURLOPT_URL, $url);

        curl_setopt($cl, CURLOPT_RETURNTRANSFER, 1 );

        curl_setopt($cl, CURLOPT_POST, true);        

        curl_setopt($cl, CURLOPT_POSTFIELDS, $fields);

        $content = curl_exec($cl);

        $status = curl_getinfo($cl);

        curl_close($cl);

        if (isset($status['http_code']) && $status['http_code'] == 200) {

            if ($data_type == 'json') {

                $content = json_decode($content);

            }

            return $content;

        } else {

            return FALSE;

        }

    }

    public function curl_get($url, $data_type='text')

    {

        $cl = curl_init();

        if(stripos($url, 'https://') !== FALSE) {

            curl_setopt($cl, CURLOPT_SSL_VERIFYPEER, FALSE);

            curl_setopt($cl, CURLOPT_SSL_VERIFYHOST, FALSE);

            curl_setopt($cl, CURLOPT_SSLVERSION, 1);

        }

        curl_setopt($cl, CURLOPT_URL, $url);

        curl_setopt($cl, CURLOPT_RETURNTRANSFER, 1 );

        $content = curl_exec($cl);

        $status = curl_getinfo($cl);

        curl_close($cl);

        if (isset($status['http_code']) && $status['http_code'] == 200) {

            if ($data_type == 'json') {

                $content = json_decode($content);

            }

            return $content;

        } else {

            return FALSE;

        }        

    }
    
    // //发送消息
    // public function messageopenid(){
    //   $appid = 'wx044cb6546edbd8a2';//小程序appid
    //   $openid = $_GET['openid'];//接收用户的openid
    //   $template_id  = 'wkyD-I0OeOlcprmOWPbqFd3w_1t5zcHodKOHS_IunJw';//从微信后台获取的模板id
    //   $form_id = $_GET['formid'];//七天内的formid
    //   $user = Db::table('fly_user')->where(['openid'=>$openid])->find();
    //   $name = $user['name'];
    //   $text = '飞鸟纪：有人给你发消息了';
    //   $phone = $user['phone'];
    //   $data = $this->send($appid,'0e6031b7107cc13fdfb4d2e4fddd9845',$openid,$template_id,$form_id,$name,$text,$phone,1,1,1,1,1,2);
    //        // var_dump($data);//打印测试结果
    //    echo json_encode($data);
           
    // }
 



//点击沟通 加好友
  public function openidfriend(){
    $openid = $_GET['openid'];
    $friendopenid = $_GET['friendopenid'];
    $arr['my'] = $openid;
    $arr['myfriend'] = $friendopenid;

    $ress = Db::table('fly_friend')->where($arr)->find();
    if(empty($ress)){
      Db::table('fly_friend')->insert($arr);
    }
   
    $array['my'] = $friendopenid;
    $array['myfriend'] = $openid;

    $res1 = Db::table('fly_friend')->where($array)->find();
    if(empty($res1)){
      Db::table('fly_friend')->insert($array);
    }
// $appid = 'wx044cb6546edbd8a2';//小程序appid

// // $openid = 'oSYlK5PlckHn5CInuQYKiwl2CIkU';//接收用户的openid

// $template_id  = 'wkyD-I0OeOlcprmOWPbqFd3w_1t5zcHodKOHS_IunJw';//从微信后台获取的模板id

// $form_id = $_GET['formid'];//七天内的formid


    
//     $info = Db::table('fly_user')->where(['openid'=>$friendopenid])->find();
//     $name = $info['username'];
//     $text = '飞鸟纪有人想和你聊天';
//     $phone = $info['phone'];

//     $this->send($appid,'0e6031b7107cc13fdfb4d2e4fddd9845',$friendopenid,$template_id,$form_id,$name,$text,$phone,1,1,1,1,1,2);

      $res['err'] = 1;
      echo json_encode($res);


  }

//好友资料
  public  function  friends(){
    $openid = $_GET['openid'];
    $res1 = Db::table('fly_friend f')
    ->field('u.username as uusername,u.headerimg as uheaderimg,u.wxaccount as uwxaccount,u.openid as uopenid')
    ->join('fly_user u','f.myfriend = u.openid')
    ->where(['f.my'=>$openid])
    ->select();
    if(isset($res1) && !empty($res1)){
      $res['err'] = 1;
      $res['user'] = $res1;
    }else{
      $res['err'] = 0;
    }
    
    echo json_encode($res);


  }
  public function deletefriends(){
     $openid = $_GET['openid'];
    $friendopenid = $_GET['friendopenid'];

    $arr['my'] = $openid;
    $arr['myfriend'] = $friendopenid;
    $my = Db::table('fly_friend')->where($arr)->find();
    $my1 = Db::table('fly_friend')->where(['id'=>$my['id']])->delete();
    $array['my'] = $friendopenid;
    $array['myfriend'] = $openid;
    $myfriend = Db::table('fly_friend')->where($array)->find();
    $myfriend1 = Db::table('fly_friend')->where(['id'=>$myfriend['id']])->delete();
    $res['err'] = 1;

    echo json_encode($res);

  }
  //用户信息查询
  public function user(){
    header("Content-type: text/html; charset=utf-8");
    $openid = $_GET['openid'];
    $select = Db::table('fly_user')->where(['openid'=>$openid])->find();
    if(isset($select) && !empty($select)){
      $res['err'] = 1;
      $res['user']  = $select;
    }else{
      $res['err'] =0;
    }
    echo json_encode($res);
  }

  //用户信息添加
  public function adduser(){
    //用户的openid

    $openid = $_GET['openid'];
    // username用户姓名
    if(isset($_GET['username']) && !empty($_GET['username'])){
      $array['username'] = $_GET['username'];
    }
  
    // sex用户性别  0是男  1是女
    if(isset($_GET['sex']) && !empty($_GET['sex'])){
      $array['sex'] = $_GET['sex'];
    }
 
    // area code手机区号
    if(isset($_GET['areacode']) && !empty($_GET['areacode'])){
      $array['areacode'] = $_GET['areacode'];
    }
    
    // phone手机号
    if(isset($_GET['phone']) && !empty($_GET['phone'])){
      $array['phone'] = $_GET['phone'];
    }
    
    //微信账号 wxaccount
    if(isset($_GET['wxaccount']) && !empty($_GET['wxaccount'])){
      $array['wxaccount'] = $_GET['wxaccount'];
    }


    // nation   国家
    if(isset($_GET['nation']) && !empty($_GET['nation'])){
      $array['nation'] = $_GET['nation'];
    }
    
    // describe 个人描述
    if(isset($_GET['describe']) && !empty($_GET['describe'])){
      $array['describe'] = $_GET['describe'];
    }
  
    // state 0未认证 1已认证
    $array['state']    = 1;
    $array['dateline'] = time();

    //添加
    $select = Db::table('fly_user')->where(['openid'=>$openid])->update($array);
    if(isset($select)){
      $res['err'] = 1;
      $res['user']  = $array;
    }else{
      $res['err'] =0;
    }
    echo json_encode($res);
  }

  //用户修改信息
  public function saveuser(){
     //用户的openid
    $openid = $_GET['openid'];
    // username用户姓名
    if(isset($_GET['username']) && !empty($_GET['username'])){
      $array['username'] = $_GET['username'];
    }
    //phone手机号
    if(isset($_GET['phone']) && !empty($_GET['phone'])){
      $array['phone'] = $_GET['phone'];
    }
    // areacode区号
    if(isset($_GET['areacode']) && !empty($_GET['areacode'])){
      $array['areacode'] = $_GET['areacode'];
    }
    // nation   国家
    if(isset($_GET['nation']) && !empty($_GET['nation'])){
      $array['nation'] = $_GET['nation'];
    }
    // describe 个人描述
    if(isset($_GET['describe']) && !empty($_GET['describe'])){
      $array['describe'] = $_GET['describe'];
    }   
    
    $array['updatetime'] = time();
    //修改
    $select = Db::table('fly_user')->where(['openid'=>$openid])->update($array);
    if(isset($select)){
      $res['err'] = 1;
    }else{
      $res['err'] =0;
    }
    echo json_encode($res);

  }





//定时任务
  public  function times(){
      $birds = Db::table('fly_birds')->select();
      foreach ($birds as $key => $value) {
        # code...
        $starttime = $value['starttime'];
        $bendtime = $value['endtime'];
        $starttimes = strtotime($starttime);
        $bendtimes = strtotime($bendtime);
        $time = time();

        if($value['state'] ==3){
          $arr['state'] = 3;
        }elseif((float)$time >(float)$bendtimes){
          $arr['state'] = 4;
        }elseif((float)$time >(float)$starttimes){
          $arr['state'] = 1;
        }else{
          $arr['state'] = 0;
        }
        $id=$value['id'];
        Db::table('fly_birds')->where(['id'=>$id])->update($arr);
      }
        


      $orders = Db::table('fly_orders')->select();
      foreach ($orders as $key => $value) {
          $state = $value['state'];
          // 待支付的定时
          if(isset($state) && $state == 1 ){
            $date = date('Y-m-d H:i:s',(int)$value['detaline']);
            $time = date("Y-m-d H:i:s",strtotime($b.' +1days'));
            $times = time("Y-m-d H:i:s");
            if($time < $times){
              $id = $value['id'];
              Db::table('fly_orders')->where(['id'=>$id])->delete($arr);
            }
          }

          if(isset($state) && $state == 4 && $value['ustate'] ==0 ){
            $date = date('Y-m-d H:i:s',(int)$value['detaline']);
            $time = date("Y-m-d H:i:s",strtotime($b.' +20 days'));
            $times = time("Y-m-d H:i:s");
            if($time < $times){
              $id = $value['birdsid'];
              $birds = Db::table('fly_birds')->where(['id'=>$id])->find();
              // $orders=Db::table('fly_orders')->find();

              if($value['bstate']==1){
                $array['state'] = 5;
              }else{
                $array['state'] = 4;
              }
              
              $array['ustate'] = 1;

              $array['birdsid'] = $value['birdsid'];
              $array['birdsuserid'] = $birds['userid'];
              $array['user'] = $value['userid'];
              $array['ordernumber'] = $value['ordernumber'];
              // $array['state'] = 5;
              $array['comment'] = '用户未评论，系统自动好评';
              $array['star'] = 5; 
              Db::table('fly_comments')->insert($array);
            }
          } 
          if(isset($state) && $state == 4 && $value['bstate'] ==0 ){
            $date = date('Y-m-d H:i:s',(int)$value['detaline']);
            $time = date("Y-m-d H:i:s",strtotime($b.' +20 days'));
            $times = time("Y-m-d H:i:s");
            if($time < $times){
              $id = $value['birdsid'];
              $birds = Db::table('fly_birds')->where(['id'=>$id])->find();
              // $orders=Db::table('fly_orders')->find();


              if($value['ustate']==1){
                $array['state'] = 5;
              }else{
                $array['state'] = 4;
              }
              $array['bstate'] = 1;

              $array['birdsid'] = $value['birdsid'];
              $array['birdsuserid'] = $birds['userid'];
              $array['user'] = $value['userid'];
              $array['ordernumber'] = $value['ordernumber'];
              // $array['state'] = 5;
              $array['comment'] = '用户未评论，系统自动好评';
              $array['star'] = 5; 
              Db::table('fly_comments')->insert($array);
            }
          }  
      }
  }

  //查看评论数据 
  public function comments(){
    //获取飞鸟id
    $openid = $_GET['openid'];
    $user = Db::table('fly_user')->where(['openid'=>$openid])->find();
    $where['c.userid']=$user['id'];
    $where['c.user']=$user['id'];


    //查询字段
    $select = Db::table('fly_comments c')
      ->field('c.id as cid,c.birdsid as cbirdsid,c.comment as ccomment,c.dateline as cdateline,u.nickname as unickname,c.userid as cuserid,u.username as uusername,u.openid as uopenid,u.headerimg as uheaderimg,c.ordernumber as cordernumber,c.tripnumbers as ctripnumbers,c.star as cstar,c.state as cstate,b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline')
      ->join('fly_user u','c.userid = u.id')
      ->join('fly_birds b','c.birdsid = b.id')
      ->where($where)
      ->order('cid desc')
      ->select();

      $where1['c.userid']=$user['id'];
      $where1['c.user']=['neq',$user['id']];
      $select1 = Db::table('fly_comments c')
      ->field('c.id as cid,c.birdsid as cbirdsid,c.comment as ccomment,c.dateline as cdateline,u.nickname as unickname,c.userid as cuserid,u.username as uusername,u.openid as uopenid,u.headerimg as uheaderimg,c.ordernumber as cordernumber,c.tripnumbers as ctripnumbers,c.star as cstar,c.state as cstate,b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline')
      ->join('fly_user u','c.user = u.id')
      ->join('fly_birds b','c.birdsid = b.id')
      ->where($where1)
      ->order('cid desc')
      ->select();
      $arr['userid']=$user['id'];
      $arr['state']=4;
      $userbirds =  Db::table('fly_birds')->where($arr)->count();
      $array['userid']=$user['id'];
      $array['state']=4;
      $userorders =  Db::table('fly_orders')->where($array)->count();


      //判断是否设置
      if(isset($select)){
        $res['err'] = 1;
        $res['comments']  = $select;
        $res['comments1']  = $select1;
        $res['userbirds']  = $userbirds;
        $res['userorders']  = $userorders;
      }else{
        $res['err'] =0;
      }
    echo json_encode($res);
  }

  //添加评论数据 
  public function addcomments(){
    $openid = $_GET['openid'];
    $user = Db::table('fly_user')->where(['openid'=>$openid])->find();
    // 飞鸟带货id
    $arr['birdsid'] = $_GET['birdsid'];
    //飞鸟用户id 
    // $arr['birdsuserid'] = $_GET['birdsuserid']; 

    //用户id
    $arr['userid'] = $_GET['birdsuserid']; 
    // ordernumber订单编号
    $arr['ordernumber'] = $_GET['ordernumber'];
    // comment评论  
    $arr['comment'] = $_GET['comment']; 
    // star星级
    $arr['star'] = $_GET['star']; 
    //判断哪个以后发的
    $arr['user'] = $user['id']; 
    $tripnumbers = Db::table('fly_birds')->where(['id'=>$_GET['birdsid']])->find();
    $arr['tripnumbers'] = $tripnumbers['tripnumbers']; 

    $arr['dateline'] = time();
    $infos['userid'] = $_GET['birdsuserid']; 
    $infos['ordernumber'] = $_GET['ordernumber'];
    $infos['tripnumbers'] = $tripnumbers['tripnumbers']; 
    $infos['birdsid'] = $_GET['birdsid'];
    $infos['user'] = $user['id'];

    $commentsfind = Db::table('fly_comments')->where($infos)->find();
    if(isset($commentsfind) && !empty($commentsfind)){
      $select = Db::table('fly_comments')->where(['id'=>$commentsfind['id']])->update($arr);
    }else{
      $select = Db::table('fly_comments')->insert($arr);
    }

    $commentsbirdsid = Db::table('fly_comments')->where(['birdsid'=>$_GET['birdsid']])->count();
    $birds = (float)$commentsbirdsid*5;
    $birdsuser = Db::table('fly_comments')->where(['ordernumber'=>$_GET['ordernumber']])->select();
    $star = 0;
    foreach ($birdsuser as $key => $value) {
      $star +=(int)$value['star'];
    }
    $array['sore'] = (int)$star/(int)$birds;
    $res['birds'] = $birds;

    $res['sore'] = $array['sore'];
    Db::table('fly_user')->where(['id'=>$_GET['birdsuserid']])->update($array);
    if ($_GET['birdsuserid'] == $user['id']) {
      $info['bstate'] = 1;
      Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->update($info); 
    }else{
      $info['ustate'] = 1;
      Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->update($info); 
    }
    $infos=Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->find(); 
    if($infos['bstate'] ==1 &&  $infos['bstate'] ==1){
      $info['state'] = 5;
      Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->update($info);

    }



      if(isset($select)){
        $res['err'] = 1;
      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);
  }

  //查询全部飞鸟行程
  public function selbirds(){
     $birds =  Db::table('fly_birds b')
      ->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg,u.openid as uopenid')
      ->join('fly_user u','b.userid = u.id')
      ->where(['b.state'=>0])
      ->order('b.id desc')
      ->select();
     if(isset($birds)){
        $res['err'] = 1;
        $res['birds']  = $birds;
      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);

  }

  //飞鸟带货查看单个
  public function birds(){
    $birdsid = $_GET['birdsid'];
    $select = Db::table('fly_birds b')
      ->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname,u.username as uusername,u.nation as unation,u.headerimg as uheaderimg,u.wxaccount as uwxaccount,u.sore as usore,u.describe as udescribe,u.openid as uopenid')
      ->join('fly_user u','b.userid = u.id')
      ->where(['b.id'=>$birdsid])

      ->order('b.id desc')
      ->find();
      // foreach ($select as $key => $value) {
        $starttime = $select['bstarttime'];
        $bendtime = $select['bendtime'];
        $starttimes = strtotime($starttime);
        $bendtimes = strtotime($bendtime);
        $time = time();

        if($select['bstate'] ==3){
          $arr['state'] = 3;
        }elseif((float)$time >(float)$bendtimes){
          $arr['state'] = 4;
        }elseif((float)$time >(float)$starttimes){
          $arr['state'] = 1;
        }else{
          $arr['state'] = 0;
        }
        Db::table('fly_birds')->where(['id'=>$birdsid])->update($arr);

       
      // }

      if(isset($select)){
        $res['err'] = 1;
        $res['birds']  = $select;
      }else{
        $res['err'] =0;
      }
    echo json_encode($res);

  }


   //我发布的飞鸟带货行程查看
  public function mybirds(){
    $openid = $_GET['openid'];
    $user = Db::table('fly_user')->where(['openid' => $openid])->find();

    $userid = $user['id'];
    $select = Db::table('fly_birds b')
      ->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname,u.username as uusername,u.nation as unation,u.headerimg as uheaderimg,u.sore as usore,u.describe as udescribe,u.openid as uopenid')
      ->join('fly_user u','b.userid = u.id')
      ->where(['b.userid'=>$userid])

      ->order('b.id desc')
      ->select();
      foreach ($select as $key => $value) {
        $starttime = $value['bstarttime'];
        $bendtime = $value['bendtime'];
        $starttimes = strtotime($starttime);
        $bendtimes = strtotime($bendtime);
        $time = time();

        if($value['bstate'] ==3){
          $arr['state'] = 3;         
        }elseif((float)$time >(float)$bendtimes){
          $arr['state'] = 4;
        }elseif((float)$time >(float)$starttimes){
          $arr['state'] = 1;
        }else{
          $arr['state'] = 0;
        }
        $id = $value['bid'];
        Db::table('fly_birds')->where(['id'=>$id])->update($arr);
      }

      $orders = Db::table('fly_orders o')
      
      ->field('o.id as oid,o.ordernumber as oordernumber,u.id as uid,u.nickname as unickname,o.dateline as odateline,o.state as ostate,o.money as omoney,o.birdsid as obirdsid,o.desc as odesc,u.username as uusername,u.headerimg as uheaderimg')
      ->join('fly_user u','o.userid = u.id')
      ->where(['o.birdsuserid' => $userid])
      ->order('oid desc')
      ->select();

      if(isset($select)){
        $res['err'] = 1;
        $res['birds']  = $select;
        $res['orders']  = $orders;

      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);

  }
  //行程搜索
public function birdsseach(){
  //出发地国家 startpoint
    if(isset($_GET['startpoint'])){
      $array['b.startpoint'] = $_GET['startpoint'];
    }
    //出发地 start
    if(isset($_GET['start'])){
      $array['b.start'] = $_GET['start'];
    }
    //出发时间 starttime
    if(isset($_GET['starttime'])){
      $array['b.starttime'] = $_GET['starttime'];
    }
    //终点国家 endpoint
    if(isset($_GET['endpoint'])){
      $array['b.endpoint'] = $_GET['endpoint'];
    }
    //终点 end
    if(isset($_GET['ends'])){
      $array['b.ends'] = $_GET['ends'];
    }
    //终点时间 endtime
    if(isset($_GET['endtime'])){
      $array['b.endtime'] = $_GET['endtime'];
    }
    $array['b.state'] = 0;


    $select = Db::table('fly_birds b')
      ->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg,u.openid as uopenid')
      ->join('fly_user u','b.userid = u.id')
      ->where($array)
      ->order('b.id desc')
      ->select();
      if(isset($select)){
        $res['err'] = 1;
        $res['birds']  = $select;
      }else{
        $res['err'] =0;
      }
    echo json_encode($res);

}

  //飞鸟带货添加
  public function addbirds(){
    $openid = $_GET['openid'];
    // $openid ='obcPi5HmyBuwg0jmXcZpQDSCyB6E';
    $user = Db::table('fly_user')->where(['openid' => $openid])->find();

    //用户id
    $array['userid'] = $user['id'];
    
    //订单编号
    $out_trade_no = time('ymdhis').rand(1000,999);
    $array['tripnumbers'] = $out_trade_no;

    //出发地国家startpoint
    if(isset($_GET['startpoint'])){
      $array['startpoint'] = $_GET['startpoint'];
    }
    //出发地start
    if(isset($_GET['start'])){
      $array['start'] = $_GET['start'];
    }
    //出发时间starttime
    if(isset($_GET['starttime'])){
      $array['starttime'] = $_GET['starttime'];
    }
    //终点国家endpoint
    if(isset($_GET['endpoint'])){
      $array['endpoint'] = $_GET['endpoint'];
    }
    //终点end
    if(isset($_GET['ends'])){
      $array['ends'] = $_GET['ends'];
    }
    //终点时间end时间
    if(isset($_GET['endtime'])){
      $array['endtime'] = $_GET['endtime'];
    }
    // box 行李箱
    if(isset($_GET['box'])){
      $array['box'] = $_GET['box'];
    }

    //总共享重量totalweight
    if(isset($_GET['totalweight'])){
      $array['totalweight'] = $_GET['totalweight'];
    }
    // //剩余共享重量residueweight
    if(isset($_GET['residueweight'])){
      $array['residueweight'] = $_GET['totalweight'];
    }
    // //总收益 totalearn
    // $array['totalearn'] = $_GET['totalearn'];

    //收货类型type
    if(isset($_GET['types'])){
      $array['types'] = $_GET['types'];
    }
    
    //备注desc
    if(isset($_GET['desc'])){
      $array['desc'] = $_GET['desc'];
    }
    //state状态 0待出发  1 进行中  2已完成 3取消
    $array['state'] =  0;
   
    //创建时间
    $array['dateline']      = time();
    $birds = Db::table('fly_birds')->insert($array);
    $birdsid = Db::table('fly_birds')->where(['tripnumbers'=>$out_trade_no])->find();


    if(isset($_GET['ends']) && !empty($_GET['ends']) && isset($_GET['endpoint']) && !empty($_GET['endpoint'])){
      $where['nations'] = $_GET['endpoint'];
      $where['citys'] = $_GET['ends'];

      $hot = Db::table('fly_hot')->where($where)->find();
      if(isset($hot) && !empty($hot)){
        $count = (int)$hot['count'];
        $count+=1;
        $where['count']=$count;
        Db::table('fly_hot')->where(['id'=>$hot['id']])->update($where);

      }else{
        $where['dateline']=time();
        Db::table('fly_hot')->insert($where);

      }


    }
    if(isset($birds)){
      $res['err'] = 1;
      $res['birdsid'] = $birdsid;

     
    }else{
      $res['err'] = 0;
    }
    echo json_encode($res);

  } 
  //修改飞鸟行程
  public function birdsstate(){
    //飞鸟行程id

    $birdsid = $_GET['birdsid'];
    //出发地国家startpoint
    if(isset($_GET['startpoint'])){
      $array['startpoint'] = $_GET['startpoint'];
    }
    //出发地start
    if(isset($_GET['start'])){
      $array['start'] = $_GET['start'];
    }
    //出发时间starttime
    if(isset($_GET['starttime'])){
      $array['starttime'] = $_GET['starttime'];
    }
    //终点国家endpoint
    if(isset($_GET['endpoint'])){
      $array['endpoint'] = $_GET['endpoint'];
    }
    //终点end
    if(isset($_GET['ends'])){
      $array['ends'] = $_GET['ends'];
    }
    //终点时间end时间
    if(isset($_GET['endtime'])){
      $array['endtime'] = $_GET['endtime'];
    }
    // box 行李箱
    if(isset($_GET['box'])){
      $array['box'] = $_GET['box'];
    }

    //总共享重量totalweight
    if(isset($_GET['totalweight'])){
      $array['totalweight'] = $_GET['totalweight'];
    }
    // 已用共享重量residueweight
    // if(isset($_GET['residueweight'])){
    //   $array['residueweight'] = $_GET['residueweight'];
    // }
    // //总收益 totalearn
    // $array['totalearn'] = $_GET['totalearn'];

    //收货类型type
    if(isset($_GET['types'])){
      $array['types'] = $_GET['types'];
    }
    
    //备注desc
    if(isset($_GET['desc'])){
      $array['desc'] = $_GET['desc'];
    }
    //state状态 0待确认    1 进行中  2已完成 3取消
    if(isset($_GET['state']) && !empty($_GET['state'])){
      $array['state'] =  $_GET['state'];
    }
    
    $array['updatetime'] =  time();

    $birds = Db::table('fly_birds')->where(['id' => $birdsid])->update($array);
    $select = Db::table('fly_birds')->where(['id' => $birdsid])->find();

        $starttime = $select['starttime'];
        $bendtime = $select['endtime'];
        $starttimes = strtotime($starttime);
        $bendtimes = strtotime($bendtime);
        $time = time();
        if($select['state'] ==3){
          $arr['state'] = 3;
          $res['err'] = 1;
          echo json_encode($res);
          die();
        }elseif((float)$time >(float)$bendtimes){
          $arr['state'] = 4;
        }elseif((float)$time >(float)$starttimes){
          $arr['state'] = 1;
        }else{
          $arr['state'] = 0;
        }
        if(isset($arr['state']) && !empty($arr['state'])){
          Db::table('fly_birds')->where(['id'=>$birdsid])->update($arr);
        }
        
          if(isset($birds) && !empty($birds)){
            $res['err'] = 1;
          }else{
            $res['err'] = 0;
          }
        echo json_encode($res);
  }
  //历史添加
 public function history(){
  // if (isset($_GET['city']) && !empty($_GET['city'])) {
      $arr['openid'] = $_GET['openid'];
      $arr['nation'] = $_GET['nation'];
      $arr['city']   = $_GET['city'];
      
      $array['openid'] = $_GET['openid'];
      $array['nation'] = $_GET['nation'];
      $array['city']   = $_GET['city'];

      $res = Db::table('fly_history')->where($array)->find();
      // var_dump($res);die();
      if(isset($res) && !empty($res)){
        $arr['dateline'] = time();
        Db::table('fly_history')->where(['id'=>$res['id']])->update($arr);
      }else{
        $arr['dateline'] = time();
        Db::table('fly_history')->insert($arr);
      }
      // var_dump($res);die();

      $count = Db::table('fly_history')->where(['openid'=>$_GET['openid']])->count();
      if($count>10){
          Db::table('fly_history')->where(['openid'=>$_GET['openid']])->order('id asc')->limit(1)->delete();
      }
      $res['err'] = 1;
      echo json_encode($res);
 } 
 //历史和热门查询
 public function histhot(){
    $history = Db::table('fly_history')->where(['openid'=>$_GET['openid']])->limit(0,7)->order('dateline desc')->select();
    $hot = Db::table('fly_hot')->limit(0,7)->order('dateline desc')->select();
    $res['err'] = 1;
    $res['history'] = $history;
    $res['hot'] = $hot;
    echo json_encode($res);
 } 

 public function histdelete(){
  $openid  = $_GET['openid'];
  Db::table('fly_history')->where(['openid'=>$openid])->delete();
  $res['err'] = 1;
  echo json_encode($res);

 }


  //城市搜索
  public function country(){
    $city = isset($_GET['city']) && !empty($_GET['city'])?$_GET['city']:'k';
    // $city = '呼和浩特';
    // $history = Db::table('fly_history')->where(['openid'=>$_GET['openid']])->select();
    $country = Db::table('fly_city_cn')
    ->where('city','like',"{$city}".'%')
    ->select();
    if(isset($country)){
      $res['err'] = 1;
      $res['country'] = $country;
      // $res['history'] = $history;

    }else{
      $res['err'] = 0;
    }
    echo json_encode($res);
  }
  //banner
  public function banner(){
     $banner = Db::table('fly_banner')->select($arr);
      if(isset($banner)){
        $res['err'] = 1;
        $res['banner']  = $banner;
      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);
  }


// 物品类型显示
  public function goods(){

    $goods = Db::table('fly_goods')->select($arr);
      if($goods){
        $res['err'] = 1;
        $res['goods']  = $goods;
      }
    echo json_encode($res);

  }
  //单个订单查看
  public function selorderfind(){
    $id = $_GET['orderid'];
    $openid = $_GET['openid'];
    $user = Db::table('fly_user')->where(['openid' => $openid])->find();

    $orders = Db::table('fly_orders')->where(['id' => $id])->find();
    $ordernumber = $orders['ordernumber'];

$comments = Db::table('fly_comments')->where(['ordernumber' => $ordernumber])->find();
    
    if($user['id'] == $orders['userid']){
      $info['c.ordernumber'] = $ordernumber;
      $info['c.user']=$orders['birdsuserid'];
      $comments = Db::table('fly_comments c')
    ->field('c.comment as ccomment,c.star as cstar,c.dateline as cdateline,u.id as uid,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg')
    ->join('fly_user u','c.user = u.id')
    ->where($info)->find();

    }else{
      $info['c.ordernumber'] = $ordernumber;
    $info['c.user'] = $orders['userid'];
     $comments = Db::table('fly_comments c')
    ->field('c.comment as ccomment,c.star as cstar,c.dateline as cdateline,u.id as uid,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg')
    ->join('fly_user u','c.user = u.id')
    ->where($info)->find();

    }

    
    


    $birdsid = $orders['birdsid'];
    $birds = Db::table('fly_birds')->where(['id' => $birdsid])->find();

    $orderuserid = $orders['userid'];
    $orderuser = Db::table('fly_user')->where(['id' => $orderuserid])->find();

    $birdsuserid = $orders['birdsuserid'];
    $birdsuser = Db::table('fly_user')->where(['id' => $birdsuserid])->find();

     if($orders){
        $res['err'] = 1;
        $res['orders']  = $orders;
        $res['birds']  = $birds;
        $res['orderuser']  = $orderuser;
        $res['birdsuser']  = $birdsuser;
        $res['comments']  = $comments;


      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);
  }


  //用户订单查看
  public function orders(){
    $openid = $_GET['openid'];
    // $openid ='obcPi5HmyBuwg0jmXcZpQDSCyB6E';
    $user = Db::table('fly_user')->where(['openid' => $openid])->find();
    $id = $user['id'];

    $select = Db::table('fly_orders o')
    ->field('b.id as bid,b.tripnumbers as btripnumbers,u.id as uid,u.nickname as unickname,b.dateline as bdateline,b.state as bstate,u.username as uusername,u.headerimg as uheaderimg,b.desc as bdesc,b.startpoint as bstartpoint,b.start as bstart,b.userid as buserid,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,o.id as oid,o.ordernumber as oordernumber,o.dateline as odateline,o.state as ostate,o.money as omoney,o.desc as odesc,o.ustate as oustate,o.bstate as obstate')
    ->join('fly_user u','o.birdsuserid = u.id')
    ->join('fly_birds b','o.birdsid = b.id')
    // ->join('fly_comments c','o.ordernumber = c.ordernumber')

    ->where(['o.userid' => $id])
    ->order('o.id desc')
    ->select();
      

      if(isset($select) && !empty($select)){
        $res['err'] = 1;
        $res['orders'] = $select;
      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);

  }

  //飞鸟订单评论查看
  public function birdsordercomment(){
    $birdsid = $_GET['birdsid'];
    $ordernumber = $_GET['ordernumber'];
    // $orders = Db::table('fly_orders')->where(['ordernumber' => $ordernumber])->find();

    $birdsuserid = $_GET['birdsuserid'];
    $openid = $_GET['openid'];

    $user = Db::table('fly_user')->where(['openid' => $openid])->find();
    $id = $user['id'];
    if($birdsuserid == $id){
      $username = Db::table('fly_user')->where(['id' => $id])->find();
      //1是用户 2是飞鸟
      $res['user'] = 2;
    }else{
      $username = Db::table('fly_user')->where(['id' => $id])->find();
      $res['user'] = 1;
    }
      $orders = Db::table('fly_orders')->where(['ordernumber' => $ordernumber])->find();


    $where['birdsid'] = $birdsid;
    $where['ordernumber'] = $ordernumber;
    $where['userid'] = $_GET['birdsuserid'];
    $where['user'] = $orders['userid'];
    $usercomments = Db::table('fly_comments c')
    ->field('c.id as cid,c.birdsid as cbirdsid,c.userid as cuserid,c.ordernumber as cordernumber,c.comment as ccomment,c.star as cstar,c.user as cuser,u.id as uid,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg')
    ->join('fly_user u','c.user = u.id')
    ->where($where)
    ->find();

    $where1['birdsid'] = $birdsid;
    $where1['ordernumber'] = $ordernumber;
    $where1['userid'] = $_GET['birdsuserid'];
    $where1['user'] = $birdsuserid;

    $birdscomments = Db::table('fly_comments c')
    ->field('c.id as cid,c.birdsid as cbirdsid,c.userid as cuserid,c.ordernumber as cordernumber,c.comment as ccomment,c.star as cstar,c.user as cuser,u.id as uid,u.nickname as unickname,u.username as uusername,u.headerimg as uheaderimg')
    ->join('fly_user u','c.user = u.id')
    ->where($where1)
    ->find();

    if($username){
      $res['username'] = $username;
    }
    $res['usercomments'] = $usercomments;
    $res['birdscomments'] = $birdscomments;

    echo json_encode($res);
  }

  // //订单状态
  // public function orderstate(){

  //   $where['state'] = $_GET['state'];
  //   $orders = Db::table('fly_orders')->where(['id'=>$_GET['orderid']])->update($where);


  //   if(isset($orders)){
  //       $res['err'] = 1;

  //     }else{
  //       $res['err'] = 0;
  //     }
  //   echo json_encode($res);

  // }


  //飞鸟订单查看
  public function birdsorders(){
    $openid = $_GET['openid'];
    // $openid ='obcPi5HmyBuwg0jmXcZpQDSCyB6E';
    $user = Db::table('fly_user')->where(['openid' => $openid])->find();
    $id = $user['id'];

    $select = Db::table('fly_orders o')
    ->field('b.id as bid,b.tripnumbers as btripnumbers,u.id as uid,u.nickname as unickname,b.dateline as bdateline,b.state as bstate,u.username as uusername,u.headerimg as uheaderimg,b.desc as bdesc,b.startpoint as bstartpoint,b.start as bstart,b.userid as buserid,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,o.id as oid,o.ordernumber as oordernumber,o.dateline as odateline,o.state as ostate,o.money as omoney,o.desc as odesc,o.ustate as oustate,o.bstate as obstate')
    ->join('fly_user u','o.userid = u.id')
    ->join('fly_birds b','o.birdsid = b.id')
    ->where(['o.birdsuserid' => $id])
    ->order('o.id desc')
    ->select();

      if(isset($select)){
        $res['err'] = 1;
        $res['orders'] = $select;
      }else{
        $res['err'] = 0;
      }
    echo json_encode($res);

  }
  //修改订单状态
  public function saveorders(){
    $birdsid = $_GET['birdsid'];
    //state状态 0待确认   1待支付 2待发货 3待收货 4 待评论 5已完成
    $array['state'] =  $_GET['state'];
    $orders = Db::table('fly_orders')->where(['id' => $birdsid])->update($array);
    if(isset($orders)){
      $res['err'] = 1;
    }else{
      $res['err'] = 0;
    }
    echo json_encode($res);
  }
  //行程图片
  public function tripimg(){
    $select = Db::table('fly_tripimg')->limit(0,4)->order('id desc')->select();
    if(isset($select)){
      $res['err'] = 1;
      $res['select'] = $select;
    }else{
      $res['err'] = 0;
    }
    echo json_encode($res);
  }


   

 //添加订单
public function addorders(){
  $openid = $_GET['openid'];
  // $openid ='obcPi5HmyBuwg0jmXcZpQDSCyB6E';
  $user = Db::table('fly_user')->where(['openid' => $openid])->find();

  //飞鸟带货id  
  $array['birdsid'] = $_GET['birdsid'];
  $array['birdsuserid'] = $_GET['birdsuserid'];

  //用户id
  $array['userid'] = $user['id'];
  //订单编号
  $out_trade_no = time('ymdhis').rand(1000,999);
  $array['ordernumber'] = $out_trade_no;

  //我的物品重量 goodsweight
  $array['goodsweight'] = $_GET['goodsweight'];
  //物品类型id
  $array['goodsid'] = $_GET['goodsid'];
  //钱
  $array['money'] = $_GET['money'];
  //备注 
  $array['desc'] = $_GET['desc'];
  //state状态 0待确认   1待支付 2待发货 3待收货 4 待评论 5已完成
  $array['state'] =  0;
 
  //创建时间
  $array['dateline']      = time();
  $array['date']          = date('Y');
  $array['month']         =(int)(date('m'));

  $orders = Db::table('fly_orders')->insert($array);
  $ordersid = Db::table('fly_orders')->where(['ordernumber'=>$out_trade_no])->find();
  $ordersid = $ordersid['id'];


  $birdsuserid1 = Db::table('fly_user')->where(['id' => $_GET['birdsuserid']])->find();


   //  $moneys = $_GET['money'];
   //  $name = $user['username'];
   //  $text = '飞鸟纪:我想你帮忙带货，理想金额' .$moneys;
   //  $phone = $user['phone'];

   //  $appid = 'wx044cb6546edbd8a2';//小程序appid

   // // $openid = 'oSYlK5PlckHn5CInuQYKiwl2CIkU';//接收用户的openid

   // $template_id  = 'PhBsDcp1dSMgdkb8bR_nCG1XsoonLU42WzhM8f8FXRY';//从微信后台获取的模板id

   // $form_id = $_GET['formid'];//七天内的formid

   // $data = $this->send($appid,'0e6031b7107cc13fdfb4d2e4fddd9845',$birdsuserid1['openid'],$template_id,$form_id,$name,$text,$phone,1,1,1,1,1,2);

    // $this->send($birdsuserid1['openid'],$name,$text,$phone,1,1,1,1,1,2);
    

  if(isset($orders) && !empty($orders)){
    $res['err'] = 1;
    $res['orders']  = $array;
    $res['ordersid']  = $ordersid;
  }else{
    $res['err'] = 0;
  }
  echo json_encode($res);
 
}

// // 订单支付成功
public function orderresults(){
  //飞鸟带货id
  $birdsid = $_GET['birdsid'];
  //订单编号
  $ordernumber = $_GET['ordernumber'];
  //订单状态
  $array['state'] = $_GET['state'];

  //钱
  // $array['money'] = $_GET['money'];
  //查询得到总收益
  $birds = Db::table('fly_birds')->where(['id'=>$birdsid])->find();
  $starttime = $birds['starttime'];
  $endtime = $birds['endtime'];
  $birdsuserid1 = $birds['userid'];

  $money = (float)$birds['totalearn'];
  $omoney=(float)$_GET['money'] /100;

  $money = $money + (float)$omoney;
  
  $arr['totalearn']=$money;
  //重量
  //获取总重量
  
  $total = (float)$birds['residueweight'];
  $total += (float)$_GET['goodsweight'];
  //已用重量
  $arr['residueweight'] = $total;
  $birds = Db::table('fly_birds')->where(['id'=>$birdsid])->update($arr);



  Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->update($array);
  $info = Db::table('fly_orders')->where(['ordernumber'=>$_GET['ordernumber']])->find();

$user = Db::table('fly_user')->where(['id'=>$info['userid']])->find();
$openid = $user['openid'];
$moneys1 = (float)$_GET['money'] /100;
$goodname = '飞鸟纪带货订单';
$appid = 'wx044cb6546edbd8a2';//小程序appid

// $openid = 'oSYlK5PlckHn5CInuQYKiwl2CIkU';//接收用户的openid
$template_id  = 'wkyD-I0OeOlcprmOWPbqFd3w_1t5zcHodKOHS_IunJw';//从微信后台获取的模板id
$form_id = $_GET['formid'];//七天内的formid
$date = date("Y年m月d日 H:i:s",$info['dateline']);


 $this->send($appid,'0e6031b7107cc13fdfb4d2e4fddd9845',$openid,$template_id,$form_id,$ordernumber,$moneys1,$goodname,$starttime,$endtime,$date,$user['username'],$user['phone'],1);

  if(isset($birds) && !empty($birds)){
    $res['err'] = 1;
  }else{
    $res['err'] = 0;
  }
  echo json_encode($res);
}




//支付回调函数
public function hui(){

}
//获取订单号
 public function getid($num=27){
  $array=array(
      'a','b','c','d','e'.'f','g','h','i','j','k','l','m',
      'n','o','p','q','r','s','t','u','v','w','x','y','z',
      'A','B','C','D','E','F','G','H','I','J','K','L','M',
      'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
      '0','1','2','3','4','5','6','7','8','9'
  );
  $tempstr ='';
  $max=count($array);
  for($i=1;$i<=$num;$i++){

      $tempstr.=$array[rand(0,$max-1)];
  }
  return $tempstr;
}
//支付
public function scoupon(){

$appid = "wx044cb6546edbd8a2";//小程序appid
$mch_id = "1524893921";//商户支付号
$nonce_str = md5(time() . mt_rand(0,1000));  //随机字符串

// $out_trade_no=$this->getid();
$out_trade_no = $_GET['ordernumber'];

$body = $_GET['name'];
// $body='飞鸟带货';

$total_fee = (float)$_GET['money'];
// $total_fee=1;

$spbill_create_ip = $_SERVER['REMOTE_ADDR'];
// $spbill_create_ip="58";

$notify_url = 'https://cs.sapukeji.cn/index.php/Soup/api/hui';//回调地址
$trade_type = 'JSAPI';
$openid = $_GET['openid'];
// $openid= "o8LkXxEKuBrpTSYceVXTjZkyheJY";

// $apikey="x2x02vjo89bwpkd7r7zb3zefprxgo5nt";//商户支付密钥a66571bdcc15cab737f6efbe5c365e61
 $apikey="feiniaoji12019340321199310183795";//商户支付密钥
$m_arr = array (
 'appid' => $appid,
 'mch_id' => $mch_id,
 // 随机串，32字符以内
 'nonce_str' => $nonce_str,
 // 商品名
 'body' => $body,
 // 订单号，自定义，32字符以内。多次支付时如果重复的话，微信会返回“重复下单”
 'out_trade_no' => $out_trade_no,
 // 订单费用，单位：分
 'total_fee' =>$total_fee,
 'spbill_create_ip' => $spbill_create_ip,
 // 支付成功后的回调地址，服务端不一定真得有这个地址
 'notify_url' => $notify_url,
 'trade_type' =>$trade_type,
 // 小程序传来的OpenID
 'openid' => $openid,
);
// var_dump($m_arr);
array_filter ( $m_arr ); // 清空参数为空的数组元素
ksort ( $m_arr ); // 按照参数名ASCII码从小到大排序
$stringA = "";
foreach ( $m_arr as $key => $row ) {
   $stringA .= "&" . $key . '=' . $row;
}
$stringA = substr ( $stringA, 1 );
// 拼接API密钥：
$stringSignTemp = $stringA."&key=" . $apikey;
$sign = strtoupper ( md5 ( $stringSignTemp ) );         //签名
$textTpl = "<xml>
         <appid><![CDATA[%s]]></appid>
         <body><![CDATA[%s]]></body>
         <mch_id><![CDATA[%s]]></mch_id>
         <nonce_str><![CDATA[%s]]></nonce_str>
         <notify_url><![CDATA[%s]]></notify_url>
         <openid><![CDATA[%s]]></openid>
         <out_trade_no><![CDATA[%s]]></out_trade_no>
         <spbill_create_ip><![CDATA[%s]]></spbill_create_ip>
         <total_fee><![CDATA[%s]]></total_fee>
         <trade_type><![CDATA[%s]]></trade_type>
         <sign><![CDATA[%s]]></sign>
     </xml>";
     // var_dump($sign);
$resultStr = sprintf($textTpl,$appid,$body,$mch_id,$nonce_str,$notify_url,$openid,$out_trade_no,$spbill_create_ip,$total_fee,$trade_type,$sign);
// var_dump($resultStr);
 $ch = curl_init();
// var_dump($ch);

 curl_setopt($ch, CURLOPT_URL, 'https://api.mch.weixin.qq.com/pay/unifiedorder');
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $resultStr);
 $output = curl_exec($ch);
 // var_dump($output);
 $postArr=$this->xml2Array($output)['xml'];
 // var_dump($postArr);
 if($postArr['return_msg']=='OK'){
   $prepay_idss=$postArr['prepay_id'];
     $nonceStr=md5(time() . mt_rand(0,1000));
     $package="prepay_id=".$postArr['prepay_id'];
     $timeStamp=time();
     $signType='MD5';
     $arr_m=array(
         'appId'    => $appid,
         'nonceStr' => $nonceStr,
         'package'  => $package,
         'timeStamp'=> $timeStamp,
         'signType' => $signType
     );
     array_filter ( $arr_m ); // 清空参数为空的数组元素
     ksort ( $arr_m ); // 按照参数名ASCII码从小到大排序
     $stringB = "";
       foreach ( $arr_m as $keye => $rowe ) {
           $stringB .= "&" . $keye . '=' . $rowe;
       }
       $stringB = substr ( $stringB, 1 );
       // 拼接API密钥：
     $stringSignTemps = $stringB."&key=" . $apikey;
     $sign1 = strtoupper ( md5 ( $stringSignTemps ) );         //签名
     // var_dump($sign1);
     $data['nonceStr']=$nonceStr;
     $data['package']=$package;
     $data['timeStamp']="$timeStamp";
     $data['signType']='MD5';
     $data['sign']=$sign1;
     $data['prepay_idss']=$prepay_idss;
     // echo 1;
     // var_dump($data);
     // $this->ajaxreturn($data);
     echo json_encode($data);
 }
}
//xml装数组
  public function xml2Array($contents = NULL, $encoding = 'UTF-8', $get_attributes = 1, $priority = 'tag'){
        if (!$contents)
        {
            return array();
        }
        if (!function_exists('xml_parser_create'))
        {
            return array ();
        }
        $parser = xml_parser_create('');
        xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, $encoding);
        xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
        xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
        xml_parse_into_struct($parser, trim($contents), $xml_values);
        xml_parser_free($parser);
        if (!$xml_values)
            return array();
        $xml_array = array ();
        $parents = array ();
        $opened_tags = array ();
        $arr = array ();
        $current = & $xml_array;
        $repeated_tag_index = array ();
        foreach ($xml_values as $data)
        {
            unset ($attributes, $value);
            extract($data);
            $result = array ();
            $attributes_data = array ();
            if (isset ($value))
            {
                if ($priority == 'tag')
                    $result = trim($value);
                else
                    $result['value'] = trim($value);
            }
            if (isset ($attributes) && $get_attributes) {
                foreach ($attributes as $attr => $val)
                {
                    if ($priority == 'tag')
                        $attributes_data[$attr] = $val;
                    else
                        $result['attr'][$attr] = $val; //Set all the attributes in a array called 'attr'
                }
            }
            if ($type == "open")
            {
                $parent[$level -1] = & $current;
                if (!is_array($current) || (!in_array($tag, array_keys($current)))) {
                    $current[$tag] = $result;
                    if ($attributes_data)
                        $current[$tag . '_attr'] = $attributes_data;
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if (isset($tag) && $tag && isset($current[$tag])) {
                        $current = & $current[$tag];
                    }
                }
                else
                {
                    if (isset ($current[$tag][0]))
                    {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                        $repeated_tag_index[$tag . '_' . $level]++;
                    }
                    else
                    {
                        $current[$tag] = array (
                            $current[$tag],
                            $result
                        );
                        $repeated_tag_index[$tag . '_' . $level] = 2;
                        if (isset ($current[$tag . '_attr']))
                        {
                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                            unset ($current[$tag . '_attr']);
                        }
                    }
                    $last_item_index = $repeated_tag_index[$tag . '_' . $level] - 1;
                    $current = & $current[$tag][$last_item_index];
                }
            }
            elseif ($type == "complete")
            {
                if (!isset ($current[$tag]))
                {
                    $current[$tag] = $result;
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if ($priority == 'tag' && $attributes_data) {
                        $current[$tag . '_attr'] = $attributes_data;
                    }
                }
                else
                {
                    if (isset ($current[$tag][0]) && is_array($current[$tag])) {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                        if ($priority == 'tag' && $get_attributes && $attributes_data) {
                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                        }
                        $repeated_tag_index[$tag . '_' . $level]++;
                    }
                    else
                    {
                        $current[$tag] = array (
                            $current[$tag],
                            $result
                        );
                        $repeated_tag_index[$tag . '_' . $level] = 1;
                        if ($priority == 'tag' && $get_attributes) {
                            if (isset ($current[$tag . '_attr']) && is_array($current[$tag]))
                            {
                                $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                                unset ($current[$tag . '_attr']);
                            }
                            if ($attributes_data)
                            {
                                $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                            }
                        }
                        $repeated_tag_index[$tag . '_' . $level]++; //0 and 1 index is already taken
                    }
                }
            }
            elseif ($type == 'close')
            {
                $current = & $parent[$level -1];
            }
        }
        return ($xml_array);
    }






}

