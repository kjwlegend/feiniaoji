<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Banner extends Controller{
	public  function index(){
          return $this->fetch();

	}

	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $banner = Db::table('fly_banner')->find($id);
		
			$this->assign('banner', $banner);
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
    }else{
        // 上传失败获取错误信息
       $arr['img'] = $_POST['imgs'];
    }


       

        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->bannersave($arr,$id);
		}else{
			$this->banneradd($arr);
		}

	}

	public function banneradd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_banner')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('banner/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function bannersave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_banner')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('banner/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}



	//分页
	public function pages()
    {
	    $count = Db::table('fly_banner')->count();

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

	    $select = Db::table('fly_banner')->order('id desc')->limit($limit,$offset)->select();
   
      
        //数据条数查询
        $TotalCount  = Db::table('fly_banner')->count();
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

		
	        $updated_rows = Db::table('fly_banner')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_banner')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}