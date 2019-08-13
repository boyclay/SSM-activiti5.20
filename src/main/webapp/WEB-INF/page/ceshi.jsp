<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>待办任务管理</title>
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
<script type="text/javascript">
$(function(){
	$('#tableName')
				.combobox(
						{
							onShowPanel : function() {
								$(this).combobox('options').url = "${pageContext.request.contextPath}/user/getTableName.action";
								$(this).combobox('reload');
							},
						});
	})
</script>
</head>
<body style="margin: 1px">
	<div id="dlg" >
		<form id="tfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>数据库表：</td>
					<td><input id="tableName" name="tableName" class="easyui-combobox"
						data-options="panelHeight:'auto',valueField:'tableName',textField:'tableName'"
						value="请选择" /></td>
				</tr>
			</table>
		</form>
	</div>
</body>
</html>