<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Index extends Controller{
  	public function  index(){
        // session_start();
  		// $this->view->engine->layout(false);
        $this->view->engine->layout(false);

        if(isset($_SESSION['err']) && $_SESSION['err'] ==intval(1)){
           // echo "<script> alert('登陆失败');</script>";
           unset($_SESSION['err']);
           // unset($_SESSION['name']);

           // echo '登陆失败';
            return $this->fetch('index');
        }else{
            


            return $this->fetch('index');
        }
     }
	public function  indexs(){
        // var_dump($_SESSION);
        if(!empty($_GET['name'] )){
            $this->times();
            return $this->fetch();
            die();
        }
       
        $name       = $_POST['name'];
        $password   = MD5($_POST['password']);
        
         //获取登录传过来的post内容
        $info = [
          'name' => $name,
          'password' => $password
        ];
        //调用admin模型
        $adminModel = model('Admin');
        //调用indexCheck方法
        $ress = Db::table('fly_admin')->where($info)->find();

        $admin = ['id'=>1];

        $admin      = Db::table('fly_admin')->where($admin)->find();
        $sum        = $admin['pageview'];
        $arr['pageview'] = ++$sum;
        $id         = 1;
        $res        = $adminModel->adminEdit($id,$arr);

        $admin      = $adminModel->indexCheck($info);

        $sum = $admin['pageview'];

        $this->assign('sum',$sum);
    
        if($ress){
            // session
            session_start();
            session('name',$name);
            // session('password',$password);
            echo "<script> alert('登陆成功');</script>";
            $this->times();
            
            return $this->fetch();
        }else{
            session('err',1);
            // $this->redirect('index/login');
            echo "<script>alert('账号或密码不正确');history.go(-1);</script>";
            // return $this->fetch('index');
            die();
        }
	}
	public function checkLogin(){
        $name       = $_POST['name'];
        $password   = MD5($_POST['password']);
        
		 //获取登录传过来的post内容
	    $info = [
	      'name' => $name,
	      'password' => $password
	    ];
	    //调用admin模型
	    $adminModel = model('Admin');
	    //调用indexCheck方法
	    $ress = Db::table('admin')->where($info)->find();

	    // $adminModel = model('Admin');
    	$info = ['id'=>1];
        $admin      = $adminModel->indexCheck($info);
        $sum        = $admin['pageview'];
        $arr['pageview'] = ++$sum;
        $id         = 1;
        $res        = $adminModel->adminEdit($id,$arr);
        $admin      = $adminModel->indexCheck($info);
        $sum = $admin['pageview'];
  		$this->assign('sum',$sum);
        if($ress){
            // session
            session_start();
            session('name',$name);
            // session('password',$password);
            echo "<script> alert('登陆成功') </script>";
            // $this->redirect('index/index');
            return $this->fetch('index');
        }else{
            session('err',1);
            // $this->redirect('index/login');
            echo "<script> alert('登陆失败', </script>";
            return $this->fetch('login');
        }
    }
    public function times(){
        $year = date('Y');
  
            $arr1=[
                'date'=>date('Y'),
                'month'=>1,
                'state'=>['>=',2]

            ];
            $arr2=[
                'date'=>date('Y'),
                'month'=>2,
                'state'=>['>=',2]

            ];
            $arr3=[
                'date'=>date('Y'),
                'month'=>3,
                'state'=>['>=',2]

            ];
            $arr4=[
                'date'=>date('Y'),
                'month'=>4,
                'state'=>['>=',2]

            ];
            $arr5=[
                'date'=>date('Y'),
                'month'=>5,
                'state'=>['>=',2]

            ];
            $arr6=[
                'date'=>date('Y'),
                'month'=>6,
                'state'=>['>=',2]

            ];
            $arr7=[
                'date'=>date('Y'),
                'month'=>7,
                'state'=>['>=',2]

            ];
            $arr8=[
                'date'=>date('Y'),
                'month'=>8,
                'state'=>['>',2]

            ];
            $arr9=[
                'date'=>date('Y'),
                'month'=>9,
                'state'=>['>',2]

            ];
            $arr10=[
                'date'=>date('Y'),
                'month'=>10,
                'state'=>['>',2]

            ];
            $arr11=[
                'date'=>date('Y'),
                'month'=>11,
                'state'=>['>',2]

            ];
            $arr12=[
                'date'=>date('Y'),
                'month'=>12,
                'state'=>['>',2]
            ];
       
            $month1 = Db::table('fly_orders')->where($arr1)->count();

            if(!isset($month1) && empty($month1)){
                $month1=0;
            }
            $month2= Db::table('fly_orders')->where($arr2)->count();
            if(!isset($month2) && empty($month2)){
                $month2=0;
            }
            $month3 = Db::table('fly_orders')->where($arr3)->count();
            if(!isset($month3) && empty($month3)){
                $month1=0;
            }
            $month4 = Db::table('fly_orders')->where($arr4)->count();
            if(!isset($month4) && empty($month4)){
                $month4=0;
            }
            $month5 = Db::table('fly_orders')->where($arr5)->count();
            if(!isset($month5) && empty($month5)){
                $month5=0;
            }
            $month6 = Db::table('fly_orders')->where($arr6)->count();
            if(!isset($month6) && empty($month6)){
                $month6=0;
            }
            $month7 = Db::table('fly_orders')->where($arr7)->count();
            if(!isset($month7) && empty($month7)){
                $month7=0;
            }
            $month8 = Db::table('fly_orders')->where($arr8)->count();
            if(!isset($month8) && empty($month8)){
                $month8=0;
            }
            $month9 = Db::table('fly_orders')->where($arr9)->count();
            if(!isset($month9) && empty($month9)){
                $month9=0;
            }
            $month10 = Db::table('fly_orders')->where($arr10)->count();
            if(!isset($month10) && empty($month10)){
                $month10=0;
            }
            $month11 = Db::table('fly_orders')->where($arr11)->count();
            if(!isset($month11) && empty($month11)){
                $month11=0;
            }
            $month12 = Db::table('fly_orders')->where($arr12)->count();
            if(!isset($month12) && empty($month12)){
                $month12=0;
            }
  

            $this->assign('month1',$month1);
            $this->assign('month2',$month2);
            $this->assign('month3',$month3);
            $this->assign('month4',$month4);
            $this->assign('month5',$month5);
            $this->assign('month6',$month6);
            $this->assign('month7',$month7);
            $this->assign('month8',$month8);
            $this->assign('month9',$month9);
            $this->assign('month10',$month10);
            $this->assign('month11',$month11);
            $this->assign('month12',$month12);



            $user       = Db::table('fly_user')->count();
            $orders     = Db::table('fly_orders')->where('state=2')->count();
            $comments   = Db::table('fly_comments')->count();
            $birds      = Db::table('fly_birds')->count();
            $this->assign('user',$user);
            $this->assign('orders',$orders);
            $this->assign('comments',$comments);
            $this->assign('birds',$birds);
            $this->assign('year',$year);
    }
}
