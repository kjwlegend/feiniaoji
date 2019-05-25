<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Orders extends Controller{
	public  function index(){
		$id=$_GET['id'];
		$select = Db::table('fly_birds b')
		->field('b.id as bid,b.userid as buserid,b.tripnumbers as btripnumbers,b.startpoint as bstartpoint,b.start as bstart,b.starttime as bstarttime,b.endpoint as bendpoint,b.ends as bends,b.endtime as bendtime,b.box as bbox,b.totalweight as btotalweight,b.residueweight as bresidueweight,b.totalearn as btotalearn,b.types as btypes,b.state as bstate,b.desc as bdesc,b.dateline as bdateline,b.updatetime as bupdatetime,u.nickname as unickname')
		->join('fly_user u','b.userid = u.id')
		->where(['b.id'=>$id])
	    ->order('b.id desc')
	    ->find();
	    // var_dump($select);
	    $this->assign('id',$id);
	    $this->assign('birds',$select);

        return $this->fetch();

	}


	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $orders = Db::table('fly_orders')->find($id);
		
			$this->assign('orders', $orders);
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
        $arr['start'] 		= $_POST['start'];	
        $arr['desc'] 		= $_POST['desc'];	

        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->orderssave($arr,$id);
		}else{
			$this->ordersadd($arr);
		}

	}

	public function ordersadd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_orders')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('orders/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function orderssave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_orders')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('orders/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}



	//分页
	public function pages()
    {
    	// var_dump($_GET['id']);
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
        $birdsid    = isset($_GET['birdsid'])?$_GET['birdsid']:1;

        //调用banner模型
	    // $bannerModel = model('Banner');
	    $select = Db::table('fly_orders o')
	    
	    ->field('o.id as oid,o.ordernumber as oordernumber,u.id as uid,u.nickname as unickname,o.dateline as odateline,o.state as ostate,o.money as omoney,o.desc as odesc')

	    ->join('fly_user u','o.userid = u.id')
		->where(['o.birdsid'=>$birdsid])
	    ->order('oid desc')
	    ->limit($limit,$offset)->select();
        // $select = $bannerModel->pageselect($limit,$offset);
      
        //数据条数查询
        $TotalCount  = Db::table('fly_orders')->count();
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
			

		
	        $updated_rows = Db::table('fly_orders')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_orders')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}