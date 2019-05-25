<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Admin extends Controller{
	public function index(){
        $id = 1;
        $admin=Db::table('fly_admin')->where(['id'=>$id])->find();  

        $this->assign('admin', $admin);

        return $this->fetch();

    }
    public function admin(){
        $id = 1;
        var_dump($_POST['name']);
        $arr['name']     = $_POST['name'];
        $arr['password'] = md5($_POST['password']);
        Db::table('fly_admin')->where(['id'=>$id])->update($arr);
       $this->redirect('index/index');
    }
}
?>