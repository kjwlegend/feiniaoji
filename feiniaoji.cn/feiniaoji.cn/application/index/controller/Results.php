<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Request;

class Results extends Controller{
	public  function index(){
          return $this->fetch();

	}

	

	//分页
	public function pages()
    {
	    $count = Db::table('fly_results')->count();

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

	    $select = Db::table('fly_results r')
  	    ->field('r.id as rid,r.moneys as rmoneys,r.state as rstate,r.dateline as rdateline,u.nickname as unickname,u.openid as uopenid')
    		->join('fly_user u','r.userid = u.id')
    		->order('rid desc')->limit($limit,$offset)->select();

        //数据条数查询
        $TotalCount  = Db::table('fly_results')->count();
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
	        $updated_rows = Db::table('fly_results')->where(['id'=>$editid])->update($save);
		}
		echo $ajaxpost['values'];
	}
	//删除
  //   public function delete(){
  //   	$id  = $_GET['id'];

		// $res = Db::table('fly_results')->where(['id'=>$id])->find();
		// $user = Db::table('fly_user')->where(['id'=>$res['userid']])->find();
		// $this->weixin_red_packet($user['openid'],$res['moneys']);
  
		// $date = 1;
  //       echo json_encode($date,true);
  //   }


    /*测试微信企业给个人发红包*/

    public function pay(){
  header('Content-type:text/html; Charset=utf-8');
  $mchid = '1524893921';          //微信支付商户号 PartnerID 通过微信支付商户资料审核后邮件发送
  $appid = 'wx044cb6546edbd8a2';  //微信支付申请对应的公众号的APPID
  $appKey = '0e6031b7107cc13fdfb4d2e4fddd9845';   //微信支付申请对应的公众号的APP Key
  $apiKey = 'feiniaoji12019340321199310183795';   //https://pay.weixin.qq.com 帐户设置-安全设置-API安全-API密钥-设置API密钥

  //①、获取当前访问页面的用户openid（如果给指定用户转账，则直接填写指定用户的openid)
  $wxPay = new \think\WxxinpayService($mchid,$appid,$appKey,$apiKey);
  $openId = 'oSYlK5J8SMTH0Gv2m1x2Csk9DdTc';      //获取openid
  if(!$openId) exit('获取openid失败');
  //②、付款
  $outTradeNo = uniqid();     //订单号
  $payAmount = 100;             //转账金额，单位:元。转账最小金额为1元
  $trueName = '葛岚';         //收款人真实姓名
  $result = $wxPay->createJsBizPackage($openId,$payAmount,$outTradeNo,$trueName);
var_dump($result);
  // echo 'success';
}

}