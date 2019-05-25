<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Tripimg extends Controller{
	public  function index(){
          return $this->fetch();

	}

	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $tripimg = Db::table('fly_tripimg')->find($id);
		
			$this->assign('tripimg', $tripimg);
			return $this->fetch();
		}else{
			return $this->fetch();
		}	
	}
	public function insert(){
		$file = request()->file('img');
    if($file){
      $filePaths = ROOT_PATH . 'public' . DS . 'uploads' . DS . 'thumb';

      $info = $file->move($filePaths);
      if($info){
        $imgpath = 'uploads/'.'thumb/'.$info->getSaveName();
        $image = \think\Image::open($imgpath);
        $date_path = 'uploads/'.'thumb/'.date('Ymd');

        $thumb_path = $date_path.'/'.$info->getFilename();
        $image->thumb(414, 736)->save($thumb_path);

        $arr['img'] = $thumb_path;

      }else{
        // 上传失败获取错误信息
        $arr['img'] = $_POST['imgs'];
      }
    }


        $arr['nations'] = $_POST['nations'];
        $arr['citys'] = $_POST['citys'];	
        $arr['endscitys'] = $_POST['endscitys'];	

        $arr['endsnations'] = $_POST['endsnations'];	



        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->bannersave($arr,$id);
		}else{
			$this->banneradd($arr);
		}

	}

	public function banneradd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_tripimg')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('tripimg/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function bannersave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_tripimg')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('tripimg/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}



	//分页
	public function pages()
    {
	    $count = Db::table('fly_tripimg')->count();

        $where      = array();
        $search     = $_GET['search'];
        // $orderby    = $_GET['order'];
        // $limit      = $_GET['limit'];
        // $offset     = $_GET['offset'];
        $orderby    = isset($_GET['order'])?$_GET['order']:'desc';
        $limit      = isset($_GET['limit'])?$_GET['limit']:0;
        $offset     = isset($_GET['offset'])?$_GET['offset']:(int)$count;
        $limit      = intval($limit);
        $offset     = intval($offset);

        //调用banner模型
	    // $bannerModel = model('Banner');
	    $select = Db::table('fly_tripimg')->order('id desc')->limit($limit,$offset)->select();
        // $select = $bannerModel->pageselect($limit,$offset);
      
        //数据条数查询
        $TotalCount  = Db::table('fly_tripimg')->count();
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

		
	        $updated_rows = Db::table('fly_tripimg')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_tripimg')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}