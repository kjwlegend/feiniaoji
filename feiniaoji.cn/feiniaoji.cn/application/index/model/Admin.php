<?php
namespace app\index\model;
use think\Model;

class Admin extends Model
{
	//查看多条数据
	public function show(){
		//实例化user模型
		$adminModel = new Admin();
		//查看数据
		$res = $adminModel->select();
		//返回$res
		return $res;
	}
	//根据条件查询
	public function indexCheck($info){
		//实例化user模型
		$adminModel = new Admin();
		//查看数据
		$res = $adminModel->where($info)->find();
		//返回$res
		return $res;
	}
	//根据条件修改
	public function adminEdit($id,$arr)
	{
		//实例化对象
		$res = new Admin();
		$info = $res
			->where(['id'=>$id])
			->update($arr);
		return $info;
	}

	// 获取角色ids
	// public function getRoles($adminId){
	// 	$roleAdminModel = new RoleAdmin();
	// 	$roles = $roleAdminModel
	// 		->field('role_id')
	// 		->where(['admin_id' => $adminId])->select();
	// 	return $roles;
	// }

	// //管理员添加
	// public function adminAddInsert($arr)
	// {
	// 	//实例化对象
	// 	$res = new Admin();
	// 	$info = $res
	// 		->insertGetId($arr);
	// 	return $info ;
	// }

	// //管理员列表查询
	// public function adminIndexSelect()
	// {
	// 	//实例化对象
	// 	$res = new Admin();
	// 	$info = $res
	// 		->alias('a')
	// 		->field('a.id aid,a.name aname,a.password apassword,a.created_time acreated_time,a.updated_time aupdated_time,a.state astate,r.name rname')
	// 		->join('role_admin ra','ra.admin_id=a.id','left')
	// 		->join('role r','r.id=ra.role_id','left')
	// 		->select();
	// 	return $info; 
	// }

	// //管理员列表修改
	// public function adminEditSelect($id)
	// {
	// 	//实例化对象
	// 	$res = new Admin();
	// 	$info = $res
	// 		->where(['id'=>$id])
	// 		->find();
	// 	return $info;
	// }

	// //管理员修改操作
	// public function adminEditUpdate($id,$arr)
	// {
	// 	//实例化对象
	// 	$res = new Admin();
	// 	$info = $res
	// 		->where(['id'=>$id])
	// 		->update($arr);
	// 	return $info;
	// }

	// //管理员删除操作
	// public function adminDelete($id)
	// {
	// 	//实例化对象
	// 	$res = new Admin();
	// 	$info = $res
	// 		->where(['id'=>$id])
	// 		->delete();
	// 	return $info;
	// }
}
?>