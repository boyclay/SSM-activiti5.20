package com.java.activiti.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.activiti.engine.IdentityService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.java.activiti.model.Group;
import com.java.activiti.model.MemberShip;
import com.java.activiti.model.PageInfo;
import com.java.activiti.model.User;
import com.java.activiti.service.GroupService;
import com.java.activiti.service.MemberShipService;
import com.java.activiti.service.UserService;
import com.java.activiti.util.ResponseUtil;
import com.java.activiti.util.ShiroMD5Util;
import com.java.activiti.util.serfg;

/**
 * �û�����
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

	/**
	 * 
	 * ����
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/userLogin")
	public String userLogin(HttpServletResponse response, HttpServletRequest request,Boolean rememberMe) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("userName", request.getParameter("userName"));
		map.put("password", request.getParameter("password"));
		map.put("groupId", request.getParameter("groupId"));
		JSONObject result = new JSONObject();
		Subject user = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(map.get("userName").toString(),
				map.get("password").toString());
		Boolean flag = rememberMe!=null?true:false;
		try {
			token.setRememberMe(flag);
			user.login(token);
			user.checkRole(map.get("groupId").toString());
			MemberShip memberShip = menberShipService.userLogin(map);//����ط�Ϊ����ʾ
			result.put("success", true);
			request.getSession().setAttribute("currentMemberShip", memberShip);
		} catch (LockedAccountException lae) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "�û��Ѿ����������ܵ�¼���������Ա��ϵ��");
		} catch (ExcessiveAttemptsException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "ʧ�ܴ������࣡");
		} catch (AuthenticationException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "�û��������������");
		}catch (UnauthorizedException e) {
			token.clear();
			result.put("success", false);
			result.put("errorInfo", "�û�û�е�ǰ��ɫ��");
		}
		ResponseUtil.write(response, result);
		return null;
	}
	
	
	/**
	 * 
	 * ����У��
	 * 
	 * @param response
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/checkPassword")
	public String checkPassword(HttpServletResponse response, HttpServletRequest request,User checkUser) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		JSONObject result = new JSONObject();
		Subject user = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(checkUser.getId(),
				checkUser.getPassword());
		try {
			user.login(token);
			result.put("success", true);
		}catch (Exception e) {
			result.put("success", false);
		}
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ��ҳ��ѯ�û�
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

		// �ڼ�ҳ
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		userPage.setPageIndex((Integer.parseInt(pageIndex) - 1) * pageSize);
		// ȡ����ҳ��
		int userCount = userService.userCount(userMap);
		userPage.setCount(userCount);
		userMap.put("pageIndex", userPage.getPageIndex());
		userMap.put("pageSize", userPage.getPageSize());

		List<User> cusDevPlanList = userService.userPage(userMap);
		JSONObject json = new JSONObject();
		// ��List��ʽת����JSON
		JSONArray jsonArray = JSONArray.fromObject(cusDevPlanList);
		json.put("rows", jsonArray);
		json.put("total", userCount);
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * �޸��û�
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
	 * �����h���Ñ�
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
	 * �����Ñ�
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
	 * �����Ñ�
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

	@RequestMapping("/listWithGroups")
	public String listWithGroups(HttpServletResponse response, String rows, String page, User user) throws Exception {
		PageInfo<User> userPage = new PageInfo<User>();
		Map<String, Object> userMap = new HashMap<String, Object>();
		userMap.put("id", user.getId());
		Integer pageSize = Integer.parseInt(rows);
		userPage.setPageSize(pageSize);

		// �ڼ�ҳ
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		userPage.setPageIndex((Integer.parseInt(pageIndex) - 1) * pageSize);
		// ȡ����ҳ��
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
				// deleteCharAt ɾ�����һ��Ԫ��
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
	 * �޸�����
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
	 * ����û�
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getUserByGoupId")
	public String getUserByGoupId(HttpServletResponse response, String groupId) throws Exception {
		List<org.activiti.engine.identity.User> userList = identityService.createUserQuery().memberOfGroup(groupId)
				.list();
		JSONArray jsonArray = new JSONArray();
		// ��listתΪJSON
		JSONArray rows = JSONArray.fromObject(userList);
		jsonArray.addAll(rows);
		ResponseUtil.write(response, jsonArray);
		return null;
	}

	// /**
	// * �ǳ�
	// *
	// * @return
	// * @throws Exception
	// */
	// @RequestMapping("/logout")
	// @ResponseBody
	// public String logout(HttpServletResponse response, HttpServletRequest
	// request) {
	// request.getSession().removeAttribute("currentMemberShip");
	// JSONObject json = new JSONObject();
	// json.put("success", true);
	// ResponseUtil.write(response, json);
	// return null;
	// }

	/**
	 * ��ҳ��
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
	@ResponseBody
	public String code() {
		serfg.test();
		return null;
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
