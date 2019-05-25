<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class User extends Controller{
	public  function index(){
          return $this->fetch();

	}

	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $user = Db::table('fly_user')->find($id);
		
			$this->assign('user', $user);
			return $this->fetch();
		}else{
			return $this->fetch();
		}	
	}
	public function insert(){
    // 获取表单上传文件
    $file = request()->file('img');

        // 移动到框架应用根目录/uploads/ 目录下
    if(isset($file)){
    	$info = $file->move('./static/uploads');
    }
        
        if(isset($info)){

            // 成功上传后 获取上传信息
            // 输出 20160820/42a79759f284b767dfcb2a0197904287.jpg
            $img = $info->getSaveName();
            $arr['img'] = $img;	

            // return $img;
        }else{
            // 上传失败获取错误信息
            // echo $file->getError();
            $arr['img'] = $_POST['imgs'];	
        }
            $arr['nation'] = $_POST['nation'];	


        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->usersave($arr,$id);
		}else{
			$this->useradd($arr);
		}

	}

	public function useradd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_user')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('user/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function usersave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_user')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('user/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}



	//分页
	public function pages()
    {
        $where      = array();
        $search     = $_GET['search'];
        // $orderby    = $_GET['order'];
        // $limit      = $_GET['limit'];
        // $offset     = $_GET['offset'];
        $orderby    = isset($_GET['order'])?$_GET['order']:'desc';
        $limit      = isset($_GET['limit'])?$_GET['limit']:0;
        $offset     = isset($_GET['offset'])?$_GET['offset']:10;
        $limit      = intval($limit);
        $offset     = intval($offset);

        //调用banner模型
	    // $bannerModel = model('Banner');
	    $select = Db::table('fly_user')->order('id desc')->limit($limit,$offset)->select();
        // $select = $bannerModel->pageselect($limit,$offset);
      
        //数据条数查询
        $TotalCount  = Db::table('fly_user')->count();
        $res['data']  = $select;
        $res['total'] = $TotalCount;
        echo json_encode($res,true);
    }


	//列表里修改
    public function ajax()
	{
		/* 获取数据 */
		$ajaxpost = array(
			'editid' => $_POST['editid'],
			'fields' => $_POST['field'],
			'values' => $_POST['value']
		);

		$editid = $ajaxpost['editid'];
		if(!empty($editid) && is_numeric($editid)){
			$save = array(	
				$ajaxpost['fields'] => trim($ajaxpost['values']),
				'updatetime' => time()
			);

		
	        $updated_rows = Db::table('fly_user')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_user')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}