package com.java.activiti.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.IdentityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.java.activiti.model.Group;
import com.java.activiti.model.MemberShip;
import com.java.activiti.model.PageInfo;
import com.java.activiti.model.Resources;
import com.java.activiti.model.User;
import com.java.activiti.service.GroupService;
import com.java.activiti.service.MemberShipService;
import com.java.activiti.service.ResourcesService;
import com.java.activiti.service.UserService;
import com.java.activiti.util.ResponseUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 资源管理
 * 
 * @author bob
 *
 */
@Controller
@RequestMapping("/resources")
public class ResourcesController {
	
	@Resource
	private ResourcesService resourcesService;

	/**
	 * 分页查询用户
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/resourcesPage")
	public String resourcesPage(HttpServletResponse response,
			@RequestParam(value = "page", required = false) String page,
			@RequestParam(value = "rows", required = false) String rows,
			User user) throws Exception{
		Map<String,Object> resourcesMap=new HashMap<String, Object>();
		PageInfo<Resources> resourcesPage = new PageInfo<Resources>();
		Integer pageSize=Integer.parseInt(rows);
		resourcesPage.setPageSize(pageSize);
		// 第几页
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		resourcesPage.setPageIndex((Integer.parseInt(pageIndex) - 1)
				* pageSize);
		// 取得总页数
		int userCount= resourcesService.resourcesCount(resourcesMap);
		resourcesPage.setCount(userCount);
		resourcesMap.put("pageIndex", resourcesPage.getPageIndex());
		resourcesMap.put("pageSize", resourcesPage.getPageSize());

		List<Resources> cusDevPlanList = resourcesService.resourcesPage(resourcesMap);
		JSONObject json = new JSONObject();
		// 把List格式转换成JSON
		JSONArray jsonArray = JSONArray.fromObject(cusDevPlanList);
		json.put("rows", jsonArray);
		json.put("total", userCount);
		ResponseUtil.write(response, json);
		return null;
	}

	/**
	 * 修改资源
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/updateResources")
	public String updateResources(HttpServletResponse response, Resources resources) throws Exception {
		int result = resourcesService.updateResources(resources);
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
	 * 批量刪除资源
	 * 
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/deleteResources")
	public String deleteResources(HttpServletResponse response, HttpServletRequest request) throws Exception {
		String id = request.getParameter("ids");
		JSONObject json = new JSONObject();
		List<String> list = new ArrayList<String>();
		String[] strs = id.split(",");
		for (String str : strs) {
			list.add(str);
		}
		try {
			int userResult = resourcesService.deleteResources(list);
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
	 * 新增资源
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/addResources")
	public String addResources(HttpServletResponse response, Resources resources) throws Exception {
		int resourcesResult = resourcesService.addResources(resources);
		JSONObject json = new JSONObject();
		if (resourcesResult > 0) {
			json.put("success", true);
		} else {
			json.put("success", false);
		}
		ResponseUtil.write(response, json);
		return null;
	}
	
	/**
	 * 资源名是否存在
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/existResourcesName")
	public String existResourcesName(HttpServletResponse response, Resources resources) throws Exception {
		int userResult = resourcesService.existResourcesName(resources);
		JSONObject json = new JSONObject();
		if (userResult > 0) {
			json.put("exist", true);
		} else {
			json.put("exist", false);
		}
		ResponseUtil.write(response, json);
		return null;
	}
	
	@RequestMapping("/getAllResources")
	public String getAllResources(HttpServletResponse response,String groupId) throws Exception{
		List<Resources> cusDevPlanList = resourcesService.getAllResources(groupId);
		JSONObject json = new JSONObject();
		// 把List格式转换成JSON
		JSONArray jsonArray = JSONArray.fromObject(cusDevPlanList);
		ResponseUtil.write(response, jsonArray);
		return null;
	}
	
	@RequestMapping("/addRoleResources")
	public String addRoleResources(HttpServletResponse response,String groupId,String resourcesId) throws Exception{
		Map<String,String> rrMap = new HashMap<>();
		rrMap.put("groupId", groupId);
		resourcesService.deleteRoleResources(rrMap);
		for(int i=0;i<resourcesId.split(",").length;i++){
			rrMap.put("resourcesId", resourcesId.split(",")[i]);
			resourcesService.addRoleResources(rrMap);
		}
		JSONObject json = new JSONObject();
		json.put("success", true);
		ResponseUtil.write(response, json);
		return null;
	}
}
