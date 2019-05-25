<?php
namespace app\admin\model;
use think\Model;

class Index extends Model
{
	public function contactIndex(){
		//实例化Contact模型
		$contactModel = new Contact();
		//查看Contact
		$res = $contactModel->select();
		//返回$res
		return $res;
	}

	//contact 数据库  查看修改的内容 
	public function contactEdit($id){
		//实例化Contact模型
		$contactModel = new Contact();
		//查看修改的contact数据
		$res = $contactModel->find($id);
		//返回$res
		return $res;
	}
	//contact 数据库 执行修改内容
	//传过来要修改的数据$info   和修改的$id
	public function contactUpdate($info,$id){
		//实例化Contact 模型
		$contactModel = new Contact();
		//根据id查到具体那一天，用$info里的数据调换原有的contact数据   
		$res = $contactModel->save($info,['id'=>$id]);
		//返回$res
		return $res;
	}
	
}
?>