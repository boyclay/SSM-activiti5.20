package com.java.activiti.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.IdentityService;
import org.apache.commons.io.FileUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.java.activiti.model.Group;
import com.java.activiti.model.MemberShip;
import com.java.activiti.model.PageInfo;
import com.java.activiti.model.User;
import com.java.activiti.service.GroupService;
import com.java.activiti.service.MemberShipService;
import com.java.activiti.service.UserService;
import com.java.activiti.util.GeneratorUtil;
import com.java.activiti.util.ResponseUtil;
import com.java.activiti.util.ShiroMD5Util;
import com.java.activiti.util.ZipUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 用户管理
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/user")
public class UserController {

	@Resource
	private UserService userService;

	@Resource
	private MemberShipService menberShipService;

	@Resource
	private GroupService groupService;

	@Resource
	private IdentityService identityService;

	public static TreeSet<String> ts = new TreeSet<String>();

	/**
	 * 登入
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/userLogin")
	public String userLogin(HttpServletResponse response, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userName", request.getParameter("userName"));
		map.put("password", request.getParameter("password"));
		map.put("groupId", request.getParameter("groupId"));
		JSONObject result = new JSONObject();
		Subject user = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(map.get("userName").toString(),
				map.get("password").toString());
		// Boolean flag = rememberMe!=null?true:false;
		try {
			// token.setRememberMe(flag);//rememberMe功能
			user.login(token);
			user.checkRole(map.get("groupId").toString());
			MemberShip memberShip = menberShipService.userLogin(map);// 这个地方为了显示
			result.put("success", true);
			request.getSession().setAttribute("currentMemberShip", memberShip);
		} catch (LockedAccountException lae) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "用户已经被锁定不能登录，请与管理员联系！");
		} catch (ExcessiveAttemptsException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "失败次数过多！");
		} catch (AuthenticationException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "用户名或者密码错误！");
		} catch (UnauthorizedException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "用户没有当前角色！");
		}
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * 
	 * 密码校验
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/checkPassword")
	public String checkPassword(HttpServletResponse response, HttpServletRequest request, User checkUser)
			throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		JSONObject result = new JSONObject();
		Subject user = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(checkUser.getId(), checkUser.getPassword());
		try {
			user.login(token);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
		}
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * 分页查询用户
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/userPage")
	public String userPage(HttpServletResponse response, @RequestParam(value = "page", required = false) String page,
			@RequestParam(value = "rows", required = false) String rows, User user) throws Exception {
		Map<String, Object> userMap = new HashMap<String, Object>();
		userMap.put("id", user.getId());
		userMap.put("firstName", user.getFirstName());
		userMap.put("lastName", user.getLastName());
		userMap.put("email", user.getEmail());

		PageInfo<User> userPage = new PageInfo<User>();
		Integer pageSize = Integer.parseInt(rows);
		userPage.setPageSize(pageSize);

		// 第几页
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		userPage.setPageIndex((Integer.parseInt(pageIndex) - 1) * pageSize);
		// 取得总页数
		int userCount = userService.userCount(userMap);
		userPage.setCount(userCount);
		userMap.put("pageIndex", userPage.getPageIndex());
		userMap.put("pageSize", userPage.getPageSize());

		List<User> cusDevPlanList = userService.userPage(userMap);
		JSONObject json = new JSONObject();
		// 把List格式转换成JSON
		JSONArray jsonArray = JSONArray.fromObject(cusDevPlanList);
		json.put("rows", jsonArray);
		json.put("total", userCount);
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 修改用户
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/updateUser")
	public String updateUser(HttpServletResponse response, User user) throws Exception {
		user.setPassword(ShiroMD5Util.getMD5Password(user.getPassword()));
		int result = userService.updateUser(user);
		JSONObject json = new JSONObject();
		if (result > 0) {
			json.put("success", true);
		} else {
			json.put("success", false);
		}
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 批量刪除用戶
	 * 
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/deleteUser")
	public String deleteUser(HttpServletResponse response, HttpServletRequest request) throws Exception {
		String id = request.getParameter("ids");
		JSONObject json = new JSONObject();
		List<String> list = new ArrayList<String>();
		String[] strs = id.split(",");
		for (String str : strs) {
			list.add(str);
		}
		try {
			int userResult = userService.deleteUser(list);
			if (userResult > 0) {
				json.put("success", true);
			} else {
				json.put("success", false);
			}
		} catch (Exception e) {
			json.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 新增用戶
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/userSave")
	public String userSave(HttpServletResponse response, User user) throws Exception {
		user.setPassword(ShiroMD5Util.getMD5Password(user.getPassword()));
		int userResult = userService.addUser(user);
		JSONObject json = new JSONObject();
		if (userResult > 0) {
			json.put("success", true);
		} else {
			json.put("success", false);
		}
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 用户名是否存在
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/existUserName")
	public String existUserName(HttpServletResponse response, User user) throws Exception {
		int userResult = userService.existUserName(user);
		JSONObject json = new JSONObject();
		if (userResult > 0) {
			json.put("exist", true);
		} else {
			json.put("exist", false);
		}
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 查询数据库表
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getTableName")
	public String getTableName(HttpServletResponse response) throws Exception {
		List<Map> tableNameList = userService.getTableName();// 这里只针对Mysql
		JSONArray jsonArray = new JSONArray();
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("trueName", "请选择...");
		// 转为JSON格式的数据
		jsonArray.add(jsonObject);
		// 将list转为JSON
		JSONArray rows = JSONArray.fromObject(tableNameList);
		jsonArray.addAll(rows);
		ResponseUtil.write(response, jsonArray);
		return null;
	}

	/**
	 * 生成代码
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/codeGenerate")
	public ResponseEntity<byte[]> codeGenerate(HttpServletResponse response, HttpServletRequest request, Model model)
			throws Exception {
		JSONObject json = new JSONObject();
		String tableName = request.getParameter("tableName");
		try {
			File file = new File("E:\\java" + File.separator + tableName);
			if (!file.exists()) {// 如果文件夹不存在
				file.mkdir();// 创建文件夹
			}
			GeneratorUtil.codeGenerate(tableName);
			FileOutputStream fos1 = new FileOutputStream(new File("E:\\java\\" + tableName + ".zip"));
			ZipUtil.toZip("E:\\java\\" + tableName, fos1, true);
			return download(request, request.getParameter("tableName"), model);
		} catch (Exception e) {
			json.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, json);
		return null;
	}

	public ResponseEntity<byte[]> download(HttpServletRequest request, String tableName, Model model)
			throws IOException {

		File file = new File("E:\\java\\" + tableName + ".zip");

		HttpHeaders headers = new HttpHeaders();// http头信息

		String downloadFileName = new String((tableName + ".zip").getBytes("UTF-8"), "utf-8");// 设置编码

		headers.setContentDispositionFormData("attachment", downloadFileName);

		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

		// MediaType:互联网媒介类型 contentType：具体请求中的媒体类型信息
		return new ResponseEntity<byte[]>(FileUtils.readFileToByteArray(file), headers, HttpStatus.CREATED);
	}

	/**
	 * 查询组列表
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/listWithGroups")
	public String listWithGroups(HttpServletResponse response, String rows, String page, User user) throws Exception {
		PageInfo<User> userPage = new PageInfo<User>();
		Map<String, Object> userMap = new HashMap<String, Object>();
		userMap.put("id", user.getId());
		Integer pageSize = Integer.parseInt(rows);
		userPage.setPageSize(pageSize);

		// 第几页
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		userPage.setPageIndex((Integer.parseInt(pageIndex) - 1) * pageSize);
		// 取得总页数
		int userCount = userService.userCount(userMap);
		userPage.setCount(userCount);
		userMap.put("pageIndex", userPage.getPageIndex());
		userMap.put("pageSize", userPage.getPageSize());

		List<User> userList = userService.userPage(userMap);
		for (User users : userList) {
			StringBuffer buffer = new StringBuffer();
			List<Group> groupList = groupService.findByUserId(users.getId());
			for (Group g : groupList) {
				buffer.append(g.getName() + ",");
			}
			if (buffer.length() > 0) {
				// deleteCharAt 删除最后一个元素
				users.setGroups(buffer.deleteCharAt(buffer.length() - 1).toString());
			} else {
				user.setGroups(buffer.toString());
			}
		}
		JSONArray jsonArray = JSONArray.fromObject(userList);
		JSONObject result = new JSONObject();
		result.put("rows", jsonArray);
		result.put("total", userCount);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * 修改密码
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/modifyPassword")
	public String modifyPassword(HttpServletResponse response, User user) throws Exception {
		JSONObject json = new JSONObject();
		try {
			user.setPassword(ShiroMD5Util.getMD5Password(user.getPassword()));
			userService.modifyPassword(user);
			json.put("success", true);
		} catch (Exception e) {
			json.put("success", false);
			e.printStackTrace();
		}
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 组查用户
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getUserByGoupId")
	public String getUserByGoupId(HttpServletResponse response, String groupId) throws Exception {
		List<org.activiti.engine.identity.User> userList = identityService.createUserQuery().memberOfGroup(groupId)
				.list();
		JSONArray jsonArray = new JSONArray();
		// 将list转为JSON
		JSONArray rows = JSONArray.fromObject(userList);
		jsonArray.addAll(rows);
		ResponseUtil.write(response, jsonArray);
		return null;
	}

	/**
	 * 主页面
	 * 
	 * @return
	 */
	@RequestMapping("/main")
	public String main() {
		return "page/main";
	}

	@RequestMapping("/userManage")
	public String userManage() {
		return "page/userManage";
	}

	@RequestMapping("/groupManage")
	public String groupManage() {
		return "page/groupManage";
	}

	@RequestMapping("/authManage")
	public String authManage() {
		return "page/authManage";
	}

	@RequestMapping("/resourcesManage")
	public String resourcesManage() {
		return "page/resourcesManage";
	}

	@RequestMapping("/deployManage")
	public String deployManage() {
		return "page/deployManage";
	}

	@RequestMapping("/processDesign")
	public String processDesign() {
		return "page/processDesign";
	}

	@RequestMapping("/processDefinitionManage")
	public String processDefinitionManage() {
		return "page/processDefinitionManage";
	}

	@RequestMapping("/daibanManage")
	public String daibanManage() {
		return "page/daibanManage";
	}

	@RequestMapping("/yibanManage")
	public String yibanManage() {
		return "page/yibanManage";
	}

	@RequestMapping("/lishiManage")
	public String lishiManage() {
		return "page/lishiManage";
	}

	@RequestMapping("/deTaskManage")
	public String deTaskManage() {
		return "page/deTaskManage";
	}

	@RequestMapping("/leaveManage")
	public String leaveManage() {
		return "page/leaveManage";
	}

	@RequestMapping("/assignTaskManage")
	public String assignTaskManage() {
		return "page/assignTaskManage";
	}

	@RequestMapping("/claimTaskManage")
	public String claimTaskManage() {
		return "page/claimTaskManage";
	}

	@RequestMapping("/code")
	public String code() {
		return "page/code";
	}

	@RequestMapping("/login")
	public String login() {
		return "page/login";
	}

	@RequestMapping("/logout")
	public String logout(HttpServletResponse response, HttpServletRequest request) {
		JSONObject json = new JSONObject();
		json.put("success", true);
		ResponseUtil.write(response, json);
		return null;
	}

	@RequestMapping("/redirectUrlLogin")
	public String redirectUrlLogin(HttpServletResponse response, HttpServletRequest request) {
		JSONObject json = new JSONObject();
		json.put("success", true);
		ResponseUtil.write(response, json);
		return null;
	}
}
