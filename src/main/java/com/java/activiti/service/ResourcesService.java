package com.java.activiti.service;

import java.util.List;
import java.util.Map;

import com.java.activiti.model.Resources;

public interface ResourcesService {
	
	/**
	 * 分页查询
	 * 
	 * @param map
	 * @return
	 */
	 List<Resources> resourcesPage(Map<String, Object> map);

	/**
	 * 统计数量
	 * 
	 * @param map
	 * @return
	 */
	public int resourcesCount(Map<String, Object> map);

	/**
	 * 删除资源
	 * 
	 * @param list
	 * @return
	 */
	public int deleteResources(List<String> list);

	/**
	 * 修改资源
	 * 
	 * @param resources
	 * @return
	 */
	public int updateResources(Resources resources);

	/**
	 * 添加资源
	 * 
	 * @param resources
	 * @return
	 */
	public int addResources(Resources resources);
	
	/**
	 * 资源名是否存在
	 * 
	 * @param resources
	 * @return
	 */
	public int existResourcesName(Resources resources);
	
	/**
	 * 获取所有资源
	 * @param resources
	 * @return
	 */
	public List<Resources> getAllResources(String groupId);
	
	/**
	 * 权限资源绑定
	 * @param rrMap
	 * @return
	 */
	public void addRoleResources(Map<String,String>rrMap);
	
	/**
	 * 权限资源删除
	 * @param rrMap
	 * @return
	 */
	public void deleteRoleResources(Map<String,String>rrMap);
	
	/**
	 * 根据用户名获取资源列表
	 * @param username
	 * @return
	 */
	public List<Resources> getPermissions(String username);
	
}
