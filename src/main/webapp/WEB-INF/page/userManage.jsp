<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户管理</title>
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
	function openAuthDiglog() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要设置的用户！");
			return;
		}
		var row = selectRows[0];
		$("#dlg2").dialog("open").dialog("setTitle", "设置用户权限");

		function a(callback) {
			setTimeout(function() {
				pageData = 'pppp-a';
				console.log("pageData-a-1000:" + pageData);
				callback()//////////////
			}, 1000);

		}
		loadAllGroups(function () {
            setRoles(selectRows[0].id);
        });
// 		loadAllGroups(function())); // 加载所有角色
		//延时加载！！！！！2019/06/03
// 		setRoles(selectRows[0].id);
		url = "${pageContext.request.contextPath}/memberShip/updateMemberShip.action?userId="
				+ selectRows[0].id;
	}
	function loadAllGroups(callback) {
		$
				.post(
						"${pageContext.request.contextPath}/group/listAllGroups.action",
						{},
						function(result) {
							var groupList = result.groupList;
							$("#groupsList").empty();
							for ( var key in groupList) {
								var cbStr = '<input type="checkbox" name="groupId" value="'+groupList[key].id+'" />'
										+ '<font>'
										+ groupList[key].name
										+ '</font>' + '&nbsp;';
								$("#groupsList").append(cbStr);
							}
							callback()
						}, "json");
	}

	function setRoles(userId) {
		$
				.post(
						"${pageContext.request.contextPath}/group/findGroupByUserId.action",
						{
							userId : userId
						}, function(result) {
							var groups = result.groups;
							var groupsArr = groups.split(",");
							for (var i = 0; i < groupsArr.length; i++) {
								$("[value='" + groupsArr[i] + "']:checkbox")
										.prop("checked", true);
							}
						}, "json");
	}

	function saveAuth() {
		var obj = document.getElementsByName("groupId");
		var s = '';
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				s += obj[i].value + ',';
			}
		}
		$.post(url, {
			groupsIds : s.substring(0, s.length - 1)
		}, function(result) {
			if (result.success) {
				$.messager.alert("系统提示", "提交成功！");
				closeAuthDialog();
				$("#dg").datagrid("reload");
			} else {
				$.messager.alert("系统提示", "提交失败，请联系管理员！");
			}
		}, "json");
	}

	function closeAuthDialog() {
		$("#dlg2").dialog("close");
	}

	function qq(name, value) {
		if (value == 'id') {
			$("#dg").datagrid('load', {
				id : name
			});
		}
		if (value == 'firstName') {
			$("#dg").datagrid('load', {
				firstName : name
			});
		}
		if (value == 'lastName') {
			$("#dg").datagrid('load', {
				lastName : name
			});
		}
		if (value == 'email') {
			$("#dg").datagrid('load', {
				email : name
			});
		}
	}

	function searchUser() {
		$("#dg").datagrid('load', {
			"id" : $("#s_id").val()
		});
	}

	function deleteUser() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length == 0) {
			$.messager.alert("系统提示", "请选择要删除的数据！");
			return;
		}
		var strIds = [];
		for (var i = 0; i < selectRows.length; i++) {
			strIds.push(selectRows[i].id);
		}
		var ids = strIds.join(",");
		$.messager
				.confirm(
						"系统提示",
						"您确定要删除这<font color=red>" + selectRows.length
								+ "</font>条数据吗?",
						function(r) {
							if (r) {
								$
										.post(
												"${pageContext.request.contextPath}/user/deleteUser.action",
												{
													ids : ids
												},
												function(result) {
													if (result.success) {
														$.messager.alert(
																"系统提示",
																"数据已经成功删除！");
														$("#dg").datagrid(
																"reload");
													} else {
														$.messager
																.alert("系统提示",
																		"数据删除失败，请联系管理员！");
													}
												}, "json");
							}
						});
	}

	function openUserAddDiglog() {
		$("#dlg").dialog("open").dialog("setTitle", "添加用户信息");
		$("#flag").val(1);
		$("#id").attr("readonly", false);
	}

	function openUserModifyDiglog() {
		var selectRows = $("#dg").datagrid("getSelections");
		if (selectRows.length != 1) {
			$.messager.alert("系统提示", "请选择一条要编辑的数据！");
			return;
		}
		var row = selectRows[0];
		$("#dlg").dialog("open").dialog("setTitle", "编辑用户信息");
		$("#fm").form("load", row);
		$("#flag").val(2);
		$("#ptword").hide();
		$("#pt").hide();
		$("#id").attr("readonly", true);
	}

	function checkData() {
		if ($("#id").val() == '') {
			$.messager.alert("系统系统", "请输入用户名！");
			$("#id").focus();
			return;
		}
		var flag = $("#flag").val();
		if (flag == 1) {
			$.post("${pageContext.request.contextPath}/user/existUserName.do",
					{
						userName : $("#id").val()
					}, function(result) {
						if (result.exist) {
							$.messager.alert("系统系统", "该用户名已存在，请更换下！");
							$("#id").focus();
						} else {
							saveUser();
						}
					}, "json");
		} else {
			updateUser();
		}
	}

	function updateUser() {
		$("#fm").form("submit", {
			url : '${pageContext.request.contextPath}/user/updateUser.action',
			onSubmit : function() {
				$('#password').validatebox({
					required : false
				});
				// 				$('#password').removeClass('easyui-validatebox');
				return $(this).form("validate");
			},
			success : function(result) {
				var result = eval('(' + result + ')');
				if (result.success) {
					$.messager.alert("系统系统", "更新成功！");
					resetValue();
					$("#dlg").dialog("close");
					$("#dg").datagrid("reload");
				} else {
					$.messager.alert("系统系统", "更新失败！");
					return;
				}
			}
		});
	}

	function saveUser() {
		$("#fm").form("submit", {
			url : '${pageContext.request.contextPath}/user/userSave.action',
			onSubmit : function() {
				return $(this).form("validate");
			},
			success : function(result) {
				var result = eval('(' + result + ')');
				if (result.success) {
					$.messager.alert("系统系统", "保存成功！");
					resetValue();
					$("#dlg").dialog("close");
					$("#dg").datagrid("reload");
				} else {
					$.messager.alert("系统系统", "保存失败！");
					return;
				}
			}
		});
	}

	function resetValue() {
		$("#id").val("");
		$("#password").val("");
		$("#firstName").val("");
		$("#lastName").val("");
		$("#email").val("");
		$("#ptword").show();
		$("#pt").show();
		$('#password').validatebox({
			required : true
		});
	}

	function closeUserDialog() {
		$("#dlg").dialog("close");
		resetValue();
	}
</script>
</head>
<body style="margin: 1px">
	<table id="dg" title="用户管理" class="easyui-datagrid" fitColumns="true"
		pagination="true" rownumbers="true"
		url="${pageContext.request.contextPath}/user/userPage.action"
		fit="true" toolbar="#tb">
		<thead>
			<tr>
				<th field="cb" checkbox="true" align="center"></th>
				<th field="id" width="80" align="center">用户名</th>
				<th field="firstName" width="50" align="center">姓</th>
				<th field="lastName" width="50" align="center">名</th>
				<th field="email" width="100" align="center">邮箱</th>
			</tr>
		</thead>
	</table>
	<div id="tb">
		<div>
			<shiro:hasPermission name="/userManage/add">
				<a href="javascript:openUserAddDiglog()" class="easyui-linkbutton"
					iconCls="icon-add" plain="true">添加</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/userManage/update">
				<a href="javascript:openUserModifyDiglog()"
					class="easyui-linkbutton" iconCls="icon-edit" plain="true">修改</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/userManage/delete">
				<a href="javascript:deleteUser()" class="easyui-linkbutton"
					iconCls="icon-remove" plain="true">删除</a>
			</shiro:hasPermission>
			<shiro:hasPermission name="/userManage/permission">
				<a href="javascript:openAuthDiglog()" class="easyui-linkbutton"
					iconCls="icon-power" plain="true">授权</a>
			</shiro:hasPermission>
		</div>
		<input id="ss" class="easyui-searchbox" style="width: 300px"
			data-options="searcher:qq,prompt:'Please Input Value',menu:'#mm'"></input>
		<div id="mm" style="width: 120px">
			<div data-options="name:'id',iconCls:'icon-ok'">用户名</div>
			<div data-options="name:'firstName',iconCls:'icon-ok'">姓</div>
			<div data-options="name:'lastName',iconCls:'icon-ok'">名</div>
			<div data-options="name:'email',iconCls:'icon-ok'">邮箱</div>
		</div>
	</div>

	<div id="dlg" class="easyui-dialog"
		style="width: 680px; height: 300px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg-buttons">

		<form id="fm" method="post">
			<table cellpadding="8px">
				<tr>
					<td>用户名：</td>
					<td><input type="text" id="id" name="id"
						class="easyui-validatebox" required="true" /></td>
					<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td id="ptword">密码：</td>
					<td id="pt"><input type="text" id="password" name="password"
						class="easyui-validatebox" required="true" /></td>
				</tr>
				<tr>
					<td>姓：</td>
					<td><input type="text" id="firstName" name="firstName"
						class="easyui-validatebox" required="true" /></td>
					<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<td>名：</td>
					<td><input type="text" id="lastName" name="lastName"
						class="easyui-validatebox" required="true" /></td>
				</tr>
				<tr>
					<td>邮箱：</td>
					<td colspan="2"><input type="text" style="width: 200px"
						id="email" name="email" class="easyui-validatebox"
						validType="email" required="true" /> <input type="hidden"
						id="flag" name="flag" /></td>
				</tr>
			</table>
		</form>
	</div>

	<div id="dlg-buttons">
		<a href="javascript:checkData()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeUserDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>


	<div id="dlg2" class="easyui-dialog"
		style="width: 450px; height: 200px; padding: 10px 20px" closed="true"
		closable="false" buttons="#dlg2-buttons">
		<div id="groupsList" style="padding: 10px"></div>
	</div>

	<div id="dlg2-buttons">
		<a href="javascript:saveAuth()" class="easyui-linkbutton"
			iconCls="icon-ok">保存</a> <a href="javascript:closeAuthDialog()"
			class="easyui-linkbutton" iconCls="icon-cancel">关闭</a>
	</div>
</body>
</html>