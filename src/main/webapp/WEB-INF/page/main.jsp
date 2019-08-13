<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>员工请假流程系统-主页面</title>
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
	var url;
	function openTab(text, url, iconCls) {
		if ($("#tabs").tabs("exists", text)) {
			$("#tabs").tabs("select", text);
			var selTab = $('#tabs').tabs('getSelected');
			$('#tabs').tabs('update', {
				tab : selTab,
				options : {
					content : createFrame(url)
				}
			})
		} else {
			$("#tabs").tabs("add", {
				title : text,
				iconCls : iconCls,
				closable : true,
				content : createFrame(url)
			});
		}
	}

	function createFrame(url) {
		return "<iframe frameborder=0 scrolling='auto' style='width:100%;height:100%' src='${pageContext.request.contextPath}/user/"
				+ url + ".action'></iframe>";
	}

	function openPasswordModifyDialog() {
		$("#dlg").dialog("open").dialog("setTitle", "修改密码");
	}

	function openCodeDialog() {
		$('#tableName')
				.combobox(
						{
							onShowPanel : function() {
								$(this).combobox('options').url = "${pageContext.request.contextPath}/user/getTableName.action";
								$(this).combobox('reload');
							},
						});
		$("#dlg4").dialog("open").dialog("setTitle", "代码生成");
	}

	function codeGenerate() {
		$("#cfm")
				.form(
						"submit",
						{
							url : '${pageContext.request.contextPath}/user/codeGenerate.action',
							onSubmit : function() {
								if ($("#tableName").combobox("getValue") == "请选择") {
									$.messager.alert("系统提示", "请选择组！");
									return false;
								}
								return $(this).form("validate");
							},
							success : function(result) {
								var result = eval('(' + result + ')');
								if (result.success) {
									$.messager.alert("系统系统", "生成成功！");
									$("#dlg4").dialog("close");
								} else {
									$.messager.alert("系统系统", "生成失败！");
									return;
								}
							}
						});
	}

	function closeCodeGenerate() {
		$("#dlg4").dialog("close");
	}

	function checkPassword(oldPassword) {
		$
				.post(
						"${pageContext.request.contextPath}/user/checkPassword.action?id=${currentMemberShip.user.id}&password="
								+ oldPassword + "",
						function(result) {
							if (result.success) {
								var newPassword = $("#newPassword").val();
								$("#fm")
										.form(
												"submit",
												{
													url : "${pageContext.request.contextPath}/user/modifyPassword.do?id=${currentMemberShip.user.id}&password="
															+ newPassword + "",
													onSubmit : function() {
														var newPassword = $(
																"#newPassword")
																.val();
														var newPassword2 = $(
																"#newPassword2")
																.val();
														if (!$(this).form(
																"validate")) {
															return false;
														}
														if (oldPassword == newPassword) {
															$.messager
																	.alert(
																			"系统系统",
																			"新老密码相同,请耐心考虑！");
															return false;
														}
														if (newPassword != newPassword2) {
															$.messager
																	.alert(
																			"系统系统",
																			"确认密码输入错误！");
															return false;
														}
														return true;
													},
													success : function(result) {
														var result = eval('('
																+ result + ')');
														if (result.success) {
															$.messager
																	.alert(
																			"系统系统",
																			"密码修改成功，下一次登录生效！");
															resetValue();
															$("#dlg").dialog(
																	"close");
														} else {
															$.messager
																	.alert(
																			"系统系统",
																			"密码修改失败，请联系管理员！");
															return;
														}
													}
												});
							} else {
								$.messager.alert("系统系统", "原密码输入错误！");
								return;
							}
						}, "json");
	}

	function modifyPassword() {
		var oldPassword = $("#oldPassword").val();
		checkPassword(oldPassword);
	}

	function resetValue() {
		$("#oldPassword").val("");
		$("#newPassword").val("");
		$("#newPassword2").val("");
	}

	function closePasswordModifyDialog() {
		resetValue();
		$("#dlg").dialog("close");
	}

	function logout() {
		$.messager
				.confirm(
						"系统提示",
						"您确定要退出系统吗?",
						function(r) {
							if (r) {
								$
										.post(
												"${pageContext.request.contextPath}/user/logout.do",
												function(result) {
													if (result.success) {
														window.location.href = '${pageContext.request.contextPath}/login.jsp';
													} else {
														$.messager.alert(
																"系统提示",
																"登出失败，请联系管理员！");
													}
												}, "json");
							}
						});
	}
</script>
</head>
<body class="easyui-layout">
	<div region="north" style="height: 78px; background-color: #E0ECFF">
		<table style="padding: 5px;" width="100%">
			<tr>
				<td width="50%"><img src="" /></td>
				<td valign="bottom" align="right" width="50%"><font size="3">&nbsp;&nbsp;<strong>欢迎：</strong>${currentMemberShip.user.id }(${currentMemberShip.user.firstName }${currentMemberShip.user.lastName })【${currentMemberShip.group.name}${currentMemberShip.group.id}】</font>
				</td>
			</tr>
		</table>
	</div>
	<div region="center">
		<div class="easyui-tabs" fit="true" border="false" id="tabs">
			<div title="首页" data-options="iconCls:'icon-home'">
				<div align="center" style="padding-top: 100px;">
					<font color="red" size="10">欢迎使用</font>
				</div>
			</div>
		</div>
	</div>
	<div region="west" style="width: 200px;" title="导航菜单" split="true">
		<div id="layout_west_accordion" class="easyui-accordion"
			data-options="fit:true,border:false">
			<!--  这里也可以通过shiro控制-->
			<shiro:hasPermission name="/usersManage">
				<div title="员工管理" data-options="selected:true,iconCls:'icon-item'"
					style="padding: 10px">
					<shiro:hasPermission name="/userManage">
						<a href="javascript:openTab('用户管理','userManage','icon-user')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-user'"
							style="width: 150px">用户管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/roleManage">
						<a href="javascript:openTab('角色管理','groupManage','icon-role')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-role'"
							style="width: 150px">角色管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/resourcesManage">
						<a
							href="javascript:openTab('资源管理','resourcesManage','icon-power')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-power'"
							style="width: 150px">资源管理</a>
					</shiro:hasPermission>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="/processManage">
				<div title="流程管理" data-options="iconCls:'icon-flow'"
					style="padding: 10px;">
					<shiro:hasPermission name="/processManage/processDesign">
						<a href="javascript:openTab('流程设计','processDesign','icon-design')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-design'"
							style="width: 150px;">流程设计</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/processManage/deployManage">
						<a
							href="javascript:openTab('流程部署管理','deployManage','icon-deploy')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-deploy'"
							style="width: 150px;">流程部署管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/processManage/processDefinitionManage">
						<a
							href="javascript:openTab('流程定义管理','processDefinitionManage','icon-definition')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-definition'"
							style="width: 150px;">流程定义管理</a>
					</shiro:hasPermission>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="/taskManage">
				<div title="任务管理" data-options="iconCls:'icon-task'"
					style="padding: 10px">
					<shiro:hasPermission name="/taskManage/claimTaskManage">
						<a
							href="javascript:openTab('签收任务管理','claimTaskManage','icon-claim')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-claim'"
							style="width: 150px;">签收任务管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/taskManage/daibanManage">
						<a
							href="javascript:openTab('待办任务管理','daibanManage','icon-daiban')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-daiban'"
							style="width: 150px;">待办任务管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/taskManage/yibanManage
">
						<a href="javascript:openTab('已办任务管理','yibanManage','icon-yiban')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-yiban'"
							style="width: 150px;">已办任务管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/taskManage/lishiManage">
						<a href="javascript:openTab('历史任务管理','lishiManage','icon-lishi')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-lishi'"
							style="width: 150px;">历史任务管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/taskManage/deTaskManage">
						<a href="javascript:openTab('委派任务管理','deTaskManage','icon-deTask')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-deTask'"
							style="width: 150px;">委派任务管理</a>
					</shiro:hasPermission>
					<shiro:hasPermission name="/taskManage/assignTaskManage">
						<a
							href="javascript:openTab('指派任务管理','assignTaskManage','icon-assignTask')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-assignTask'"
							style="width: 150px;">指派任务管理</a>
					</shiro:hasPermission>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="/busManage">
				<div title="业务管理" data-options="iconCls:'icon-yewu'"
					style="padding: 10px">
					<shiro:hasPermission name="/busManage/leaveManage">
						<a href="javascript:openTab('请假申请','leaveManage','icon-apply')"
							class="easyui-linkbutton"
							data-options="plain:true,iconCls:'icon-apply'"
							style="width: 150px">请假申请</a>
					</shiro:hasPermission>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="/codeManage">
			<div title="代码管理" data-options="iconCls:'icon-codeManage'"
				style="padding: 10px">
				<a href="javascript:openCodeDialog()" class="easyui-linkbutton"
					data-options="plain:true,iconCls:'icon-codeGenerate'"
					style="width: 150px;">代码生成</a>
			</div>
			</shiro:hasPermission>
			<div title="系统管理" data-options="iconCls:'icon-system'"
				style="padding: 10px">
				<a href="javascript:openPasswordModifyDialog()"
					class="easyui-linkbutton"
					data-options="plain:true,iconCls:'icon-modifyPassword'"
					style="width: 150px;">修改密码</a> <a href="javascript:logout()"
					class="easyui-linkbutton"
					data-options="plain:true,iconCls:'icon-exit'" style="width: 150px;">安全退出</a>
			</div>
		</div>
	</div>
	<div id="dlg" class="easyui-dialog"
		style="width: 400px; height: 250px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg-buttons">

		<form id="fm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>用户名：</td>
					<td><input type="text" id="userId" name="userId"
						readonly="readonly" value="${currentMemberShip.user.id }"
						style="width: 200px" /></td>
				</tr>
				<tr>
					<td>原密码：</td>
					<td><input type="password" id="oldPassword" name="oldPassword"
						class="easyui-validatebox" required="true" style="width: 200px" />
					</td>
				</tr>
				<tr>
					<td>新密码：</td>
					<td><input type="password" id="newPassword" name="newPassword"
						class="easyui-validatebox" required="true" style="width: 200px" />
					</td>
				</tr>
				<tr>
					<td>再次输入：</td>
					<td><input type="password" id="newPassword2"
						name="newPassword2" class="easyui-validatebox" required="true"
						style="width: 200px" /></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:modifyPassword()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a
			href="javascript:closePasswordModifyDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>

	<div id="dlg4" class="easyui-dialog"
		style="width: 400px; height: 250px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg4-buttons">
		<form id="cfm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>数据库表：</td>
					<td><input id="tableName" name="tableName"
						class="easyui-combobox"
						data-options="panelHeight:200,valueField:'table_name',textField:'table_name'"
						value="请选择" /></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg4-buttons">
		<a href="javascript:codeGenerate()" class="easyui-linkbutton"
			iconCls="icon-ok">生成</a> <a href="javascript:closeCodeGenerate()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>
</body>
</html>