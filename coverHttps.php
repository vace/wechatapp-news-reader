<?php 

/**
 * 此代码可以转换任何http请求到另一个服务器。
 * 主要供小程序上线后没有http服务使用
 */

// domain

define('REWRITE_DOMAIN','http://httpbin.org/');

class FetchRequst{
	protected static function http_get($url,$param = array()){
		$oCurl = curl_init();
		curl_setopt($oCurl, CURLOPT_URL, $url);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
		$sContent = curl_exec($oCurl);
		$aStatus = curl_getinfo($oCurl);
		curl_close($oCurl);
		if(intval($aStatus["http_code"])==200){
			return $sContent;
		}else{
			return false;
		}
	}

	protected static function http_post($url,$param = array(),$post_file=false){
		if(!$param){
			try {
				$param = json_decode(file_get_contents("php://input"),true);
			} catch (Exception $e) {}
		}
		$oCurl = curl_init();
		
		if (is_string($param) || $post_file) {
			$strPOST = $param;
		} else {
			$aPOST = array();
			foreach($param as $key=>$val){
				$aPOST[] = $key."=".urlencode($val);
			}
			$strPOST =  join("&", $aPOST);
		}
		curl_setopt($oCurl, CURLOPT_URL, $url);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($oCurl, CURLOPT_POST,true);
		curl_setopt($oCurl, CURLOPT_POSTFIELDS,$strPOST);
		$sContent = curl_exec($oCurl);
		$aStatus = curl_getinfo($oCurl);
		curl_close($oCurl);
		if(intval($aStatus["http_code"])==200){
			return $sContent;
		}else{
			return false;
		}
	}

	public static function run($params = array()){
		$target = isset($params['url']) ? $params['url'] : '';
		$method = isset($params['method']) ? $params['method'] : 'GET';
		unset($params['url'],$params['method']);
		// 组装请求
		$requset = 'http_' . strtolower($method);
		$url = REWRITE_DOMAIN . $target;
		header('Content-type: application/json');

		echo call_user_func(array(__NAMESPACE__ .'\FetchRequst',$requset), $url,$params );
	}
}
if(strtolower($_SERVER['HTTP_CONTENT_TYPE']) === 'application/json'){
	$_POST = json_decode(file_get_contents("php://input"),true) ? : array();
}

FetchRequst::run(array_merge($_POST,$_GET));

// dev
/*
 $post = ['chid' => 0,'page' => 0];
 $get = ['url' => 'v2/news/list.html','method' => 'POST'];
 FetchRequst::run( array_merge($post,$get) );
*/
