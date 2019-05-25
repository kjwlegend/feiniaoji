<?php
namespace app\common;
use think\Controller;
use think\Request;
class Common extends Controller
{
	// public function __construct(Request $request)
	// {
	// 	parent::__construct();
	// 	//检测用户权限
	// 	//
	// 	$roleIds = session('roles');	//session role_id
	// 	//预定于不需要权限检测的方法
	// 	$aarr = [
	// 		'admin/adminIndex',
	// 		'admin/roleIndex',
	// 		'admin/accessIndex',
	// 		'index/login',
	// 		'index/main',
	// 		'index/left',
	// 		'index/comuter',
	// 		'index/filelist',
	// 		'index/form',
	// 		'index/imglist',
	// 		'index/imgtable',
	// 		'index/right',
	// 		'index/tab',
	// 		'index/tools',
	// 		'index/top',
	// 		'index/index',
	// 		'banner/index',
	// 		'banner/upload',
	// 		'color/upload',
	// 		'color/index',
	// 		'combo/index',
	// 		'combo/upload',
	// 		'config/index',

	// 	];
		
	// 	//获取当前的控制器
	// 	$a =$request->controller().'/'.$request->action();
	// 	if(!in_array($a,$aarr)){

	// 		$access = model('access')
	// 			->alias('a')
	// 			->field('a.action')
	// 			->join('role_access ra','a.id=ra.access_id','left')
	// 			->whereIn('ra.role_id', $roleIds)
	// 			->select();
	// 		//当前用户的权限地址
	// 		$arr = [];
	// 		foreach($access as $k => $v){
	// 			$arr[$k]	=	strtolower($v['action']);
	// 		}

			
			
	// 		//判断权限
	// 		if(!in_array($a,$arr)){
	// 			$this->error('你没有权限','index/login');
	// 		}
	// 	}
	// }
}