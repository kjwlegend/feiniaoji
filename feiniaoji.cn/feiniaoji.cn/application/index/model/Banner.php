<?php
namespace app\admin\model;
use think\Model;
/**
 *banner操作
 */
class Banner extends Model
{
	//查询多条
    public function indexSelect(){
        //查询banner数据
        $bannerModel = new Banner();
        $banner = $bannerModel -> select();
        return $banner;
    }
    //根据id查询单条
    public function indexFind($id){
        //查询指定banner数据
        $bannerModel = new Banner();
        $banner = $bannerModel -> find($id);
        return $banner;
    }
    //根据多个条件查询
	public function indexCheck($info){
		//实例化user模型
		$adminModel = new Admin();
		//查看数据
		$res = $adminModel->where($info)->find();
		//返回$res
		return $res;
	}
	//添加数据
    public function add($data){
      //添加banner信息
      $bannerModel = new Banner();
      $banner = $bannerModel->save($data);
      return $banner;
    }
	//修改
    public function edit($id,$arr){
        //修改banner信息
        $bannerModel = new Banner();
        $banner      = $bannerModel ->where(['id'=>$id])->update($data);
        return $banner;
    }

    //删除
	public function deletes($id)
	{
		//实例化对象
		$bannerModel = new Banner();
		$banner = $bannerModel
			->where(['id'=>$id])
			->delete();
		return $banner;
	}
    //查询分页
    public function pageselect($id,$limit,$offset){
        //查询banner分页信息
        $bannerModel = new Banner();
        $banner      = $bannerModel ->order('id desc')->limit($limit,$offset)->select();
        return $banner;
    }
    //查询一共多少数据
    public function count_record(){
        //查询banner分页信息
        $bannerModel = new Banner();
        $banner      = $bannerModel ->count();
        return $banner;
    }
}
