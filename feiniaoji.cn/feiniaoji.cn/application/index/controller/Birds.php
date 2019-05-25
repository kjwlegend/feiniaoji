<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Birds extends Controller{
	public  function index(){
        return $this->fetch();

	}

	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $birds = Db::table('fly_birds')->find($id);
		
			$this->assign('birds', $birds);
			return $this->fetch();
		}else{
			return $this->fetch();
		}	
	}
	public function insert(){
    
        $arr['startpoint'] 	= $_POST['startpoint'];
        $arr['start'] 		= $_POST['start'];	
        $arr['starttime'] 	= $_POST['starttime'];	
        $arr['endpoint'] 	= $_POST['endpoint'];	
        $arr['ends'] 		= $_POST['ends'];	
        $arr['endtime'] 	= $_POST['endtime'];	
        $arr['state'] 		= $_POST['state'];	
        $arr['desc'] 		= $_POST['desc'];	

        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->bannersave($arr,$id);
		}else{
			$this->banneradd($arr);
		}

	}

	public function banneradd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_birds')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('birds/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function bannersave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_birds')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('birds/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}
	public function orders()
	{
		$id = $_GET['id'];

		//订单取消
		$arr['state'] = 3;
		$arr['orderstime'] = time();
	    $res =  Db::table('fly_birds')->where(['id'=>$id])->update($arr);
		echo "<script>history.go(-1);location.replace(location.href);</script>";


	}


	//分页
	public function pages()
    {
        $count = Db::table('fly_birds')->count();
        $where      = array();
        $search     = $_GET['search'];
        // $orderby    = $_GET['order'];
        // $limit      = $_GET['limit'];
        // $offset     = $_GET['offset'];
        $orderby    = $_GET['order'];
        $limit      = isset($_GET['limit'])?$_GET['limit']:0;
        $offset     = isset($_GET['offset'])?$_GET['offset']:(int)$count;
        // $limit     = $_GET['limit'];
        $limit      = intval($limit);
        $offset     = intval($offset);


        //调用banner模型
	    // $bannerModel = model('Banner');
	    $select = Db::table('fly_birds b')
	    ->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname')
		->join('fly_user u','b.userid = u.id')
		
	    ->order('b.id desc')
	    ->limit($limit,$offset)->select();
        // $select = $bannerModel->pageselect($limit,$offset);
      
        //数据条数查询
        $TotalCount  = Db::table('fly_birds')->count();
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
			$str = $ajaxpost['fields'];
				$str = substr($str,1);
			$save = array(				
				$str => trim($ajaxpost['values']),
				'updatetime' => time()
			);
			

		
	        $updated_rows = Db::table('fly_birds')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_birds')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}