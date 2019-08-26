<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" src="${pageContext.request.contextPath}/static/jquery-easyui-1.3.3/jquery.min.js""></script>
<title>Insert title here</title>
</head>
<script type="text/javascript">
	$(function() {
		$("span").click(function(){
			var roomid = $(this).html()
			location.href="${pageContext.request.contextPath}/user/room.action?uname=${currentMemberShip.user.id}&roomid="+roomid;
		})
	})
</script>
<style>
	span:HOVER{
		color: red;
	}
	span{
		cursor:pointer;
	}
</style>
<body>
	<h1><span>room1</span></h1>
</body>
</html>