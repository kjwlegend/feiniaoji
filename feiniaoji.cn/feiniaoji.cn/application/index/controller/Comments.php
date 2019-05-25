<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
class Comments extends Controller{
	public  function index(){
        return $this->fetch();

	}

	// 添加
	public function publish(){
	
		if(isset($_GET['id'])&& !empty($_GET['id'])){
			$id = $_GET['id'];
		    $comments = Db::table('fly_comments')->find($id);
			$this->assign('comments', $comments);
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
        $arr['end'] 		= $_POST['end'];	
        $arr['endtime'] 	= $_POST['endtime'];	
        $arr['start'] 		= $_POST['start'];	
        $arr['desc'] 		= $_POST['desc'];	

        if(!empty($_POST['id'])){
			$id = $_POST['id'];
			$this->commentssave($arr,$id);
		}else{
			$this->commentsadd($arr);
		}

	}

	public function commentsadd($arr){
		$arr['dateline'] = time();

	    $res = Db::table('fly_comments')->insert($arr);
		
		if($res){
			// 成功
			$this->redirect('comments/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}


	public function commentssave($arr,$id){
		$arr['updatetime'] = time();


	    //调用add方法添加数据
	    $res =  Db::table('fly_comments')->where(['id'=>$id])->update($arr);
		if($res){
			// 成功
			$this->redirect('comments/index');
		}else{
			// 失败
			$this->error('添加失败');
		}
	}

//对话
	public  function duihua(){
		$res =  Db::table('fly_user')->where(['id'=>1])->find();
		$res1 =  Db::table('fly_user')->where(['id'=>2])->find();
		$admin =  Db::table('fly_message')->select();

		$this->assign('res', $res);
		$this->assign('res1', $res1);
		$this->assign('admin', $admin);
		var_dump($admin);

		return $this->fetch();


	}



	//分页
	public function pages()
    {
    	$count = Db::table('fly_comments c')
		    ->field('c.id as cid,c.birdsid as cbirdsid,c.comment as ccomment,c.dateline as cdateline,u.nickname as unickname,c.ordernumber as cordernumber,c.tripnumbers as ctripnumbers')
			->join('fly_user u','c.user = u.id')
			->where($where)
		    ->order('cid desc')
		    ->count();

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
        // $id 		= isset($_GET['id']) && !empty($_GET['id'])?$_GET['id']:NULL;

        //调用banner模型
	    // $bannerModel = model('Banner');


        	$where = ['c.birdsid'=>$_GET['id']];
        	$select = Db::table('fly_comments c')
		    ->field('c.id as cid,c.birdsid as cbirdsid,c.comment as ccomment,c.dateline as cdateline,u.nickname as unickname,c.ordernumber as cordernumber,c.tripnumbers as ctripnumbers')
			->join('fly_user u','c.user = u.id')
			->where($where)
		    ->order('cid desc')
		    ->limit($limit,$offset)->select();
		    $TotalCount  = Db::table('fly_comments')->count();
    	
        // }
			
   //  		$select = Db::table('fly_comments c')
		 //    ->field('c.id as cid,c.birdsid as cbirdsid,c.comment as ccomment,c.dateline as cdateline,u.nickname as unickname,c.ordernumber as cordernumber,c.tripnumbers as ctripnumbers')
			// ->join('fly_user u','c.userid = u.id')
		 //    ->order('cid desc')
		 //    ->limit($limit,$offset)->select();
		 //    $TotalCount  = Db::table('fly_comments')->count();

   //  	}
        // $select = $bannerModel->pageselect($limit,$offset);
      
        //数据条数查询
        
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
			

		
	        $updated_rows = Db::table('fly_comments')->where(['id'=>$editid])->update($save);
			
		}
		echo $ajaxpost['values'];
	}
	//删除
    public function delete(){
    	$id  = $_GET['id'];

		$res = Db::table('fly_comments')->where(['id'=>$id])->delete();
		$date = 1;
        echo json_encode($date,true);
    }
}