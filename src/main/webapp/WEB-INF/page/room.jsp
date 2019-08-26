<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>聊天室</title>
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/css/chat.css" />
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/themes/icon.css">
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/locale/easyui-lang-zh_CN.js"></script>
</head>
<script type="text/javascript">
	var roomid;
	var nickname;//自己的昵称
	var flag;
	var info;
	var socket = null;//建立一条与服务器之间的连接
	var text;
	var addRess = "ws://${pageContext.request.getServerName()}:${pageContext.request.getServerPort()}${pageContext.request.contextPath}/websocket/";
	var welcome;
	var exitroom;
	$(function() {
		socketConnection();
	})

	/**
	 * 连接
	 */
	function socketConnection() {
		if (socket == null) {
			roomId = "room1";//房间名
			nickname = $(".uname").html();//自己的昵称
			info = roomId + "|" + nickname;
			socket = new WebSocket(addRess + info);
			text = "";

			welcome = JSON.stringify({ //加入房间时的欢迎消息
				nickname : nickname, //用户名
				content : text, //消息内容
				target : roomId, //推送到目标房间
				flag : "chatroom"
			}); //推送标识

			exitroom = JSON.stringify({ //退出房间
				nickname : nickname,
				flag : "exitroom",
				roomId : roomId
			});

			//当服务端执行onopen后触发此方法
			socket.onopen = function() {
				// 				socket.send(welcome);
			};

			//接收服务器的消息
			socket.onmessage = function(ev) {
				var obj = eval('(' + ev.data + ')');
				addMessage(obj)
			};

			//当服务端执行onerror后触发此方法
			socket.onerror = function(evt) {
				$.messager.alert("系统系统", "产生异常！！！");
			};

			//当服务端执行onclose后触发此方法
			socket.onclose = function(evt) {
				$.messager.alert("系统系统", "关闭成功！！！");
			};
		} else {
			$.messager.alert("系统系统", "链接已存在！！！");
		}
	}

	/**
	 * 关闭连接
	 */
	function socketClose() {
		if (socket != null) {
			socket.close();
			socket = null;
			$(".center-info").html(""); //清空消息
			$(".member").html("");//清空在线列表
		} else {
			$.messager.alert("系统系统", "已经关闭！！！");
		}
	}

	/**
	 * 连接检查
	 */
	function socketCheck() {
		$.messager.alert("系统系统", socket == null ? "连接异常" : "连接正常");
	}

	/**
	 * 发送内容
	 */
	function ensure() {
		//获取输入框的内容
		if (socket != null) {
			var txt = $(".center-input").val()
			if (txt == '') {
				$.messager.alert("系统系统", "不能发送空内容！！！");
			} else {
				//构建一个标准格式的JSON对象
				var obj = JSON.stringify({
					nickname : nickname, //用户名
					content : txt, //消息内容
					flag : 'chatroom', //标识--chatroom代表是聊天室的消息
					target : roomid
				//消息推送的目的地
				});
				// 向服务器发送消息
				socket.send(obj);
				// 清空消息输入框
				$(".center-input").val("")
				// 消息输入框获取焦点
				$(".center-input").focus();
			}
		} else {
			$.messager.alert("系统系统", "链接已经断开,请重新连接！！！");
		}
	}

	function addMessage(msg) {
		if (msg.flag == "join" || msg.flag == "exitroom" || msg.flag == "close") {//加入或者退出的时候发布简单的信息
			$(".center-info").append(
					"<div class='welcome'>" + msg.content + "</div>");
		} else {
			var align;
			if (msg.isSelf) {
				align = "right";
			} else {
				align = "left";
			}
			$(".center-info")
					.append(
							"<div class='basicInfo' style=float:"+align+">"
									+ "<div class='basicInfo-left' style=float:"+align+">"
									+ "<img src='${pageContext.request.contextPath}/img/wqb.jpg'>"
									+ "</div>"
									+ "<div class='basicInfo-right' style=float:"+align+">"
									+ "<div class='username' style=text-align:"+align+">"
									+ "<span>" + msg.nickname + "</span>&nbsp;"
									+ "<span>" + msg.date + "</span>"
									+ "</div>" + "<div class='context'>"
									+ "<span><h2>" + msg.content
									+ "</h2></span>" + "</div>" + "</div>"
									+ "</div>");
		}
		refreshMember(msg)
		$(".center-info").scrollTop(999999); //让滚动条始终保持在最下 
	}

	/**
	 * 退出房间
	 */
	function quittroom() {
		socket.send(exitroom); //向服务器发送退出房间的信号
		location.href = "${pageContext.request.contextPath}/user/webChat"; //跳转到前一个页面
	}

	/**
	 * 显示消息
	 */
	function refreshMember(data) {
		$(".member").html("");
		var temp = $('#cc').layout('panel', 'east');
		//2、给区域面板title赋值
		temp.panel('setTitle', '在线人数:'+data.number);
		if (data.userList != null) {
			$
					.each(
							data.userList,
							function(key, val) { //添加私聊按钮
								var username = val.userid;
								var li = "<div class='divcss5'><img src='${pageContext.request.contextPath}/img/wqb.jpg'><li  style='list-style:none;'>"
										+ username + "</li></div>";
								$(".member").append(li);
							});
		}
	}

	/**
	 * 清空聊天区
	 */
	function clearConsole() {
		$(".center-info").html("");
	}
</script>

<body>
	<div id="cc" class="easyui-layout" style='width: 100%; height: 100%'>
		<div data-options="region:'east',title:'在线人数:',split:true"
			style='width: 240%'>
			<!-- 			<div class="body-right"> -->
			<!-- 				<div class="left-info"> -->
			<div class="member"></div>
			<!-- 				</div> -->
			<!-- 			</div> -->
		</div>
		<div data-options="region:'center',title:'房间名称:${roomid}'">
			<div class="center-info"></div>
			<textarea class="center-input" placeholder="这里输入你想发送的信息..."></textarea>
			<div class="center-button">
				<a href="javascript:socketConnection()" class="easyui-linkbutton"
					iconCls="icon-tip">连接</a> <a href="javascript:socketClose()"
					class="easyui-linkbutton" iconCls="icon-cut">断开</a> <a
					href="javascript:socketCheck()" class="easyui-linkbutton"
					iconCls="icon-search">检查</a> <a href="javascript:clearConsole()"
					class="easyui-linkbutton" iconCls="icon-remove">清屏</a> <a
					href="javascript:quittroom()" class="easyui-linkbutton"
					iconCls="icon-remove">退出</a> <a href="javascript:ensure()"
					class="easyui-linkbutton" iconCls="icon-redo">发送</a>
			</div>
		</div>
	</div>
	<span class="uname" style="display: none">${uname}</span>
</body>

</html>