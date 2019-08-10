package com.java.activiti.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.java.activiti.dao.ResourcesDao;
import com.java.activiti.model.Resources;
import com.java.activiti.service.ResourcesService;

@Service("resourcesService")
public class ResourcesServiceImpl implements ResourcesService {

	@Resource
	private ResourcesDao resourcesDao;
	
	@Override
	public List<Resources> resourcesPage(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return resourcesDao.resourcesPage(map);
	}

	@Override
	public int resourcesCount(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return resourcesDao.resourcesCount(map);
	}

	@Override
	public int deleteResources(List<String> list) {
		// TODO Auto-generated method stub
		return resourcesDao.deleteResources(list);
	}

	@Override
	public int updateResources(Resources resources) {
		// TODO Auto-generated method stub
		return resourcesDao.updateResources(resources);
	}

	@Override
	public int addResources(Resources resources) {
		// TODO Auto-generated method stub
		return resourcesDao.addResources(resources);
	}

	@Override
	public int existResourcesName(Resources resources) {
		return resourcesDao.existResourcesName(resources);
	}

	@Override
	public List<Resources> getAllResources(String groupId) {
		return resourcesDao.getAllResources(groupId);
	}

	@Override
	public void addRoleResources(Map<String, String> rrMap) {
		resourcesDao.addRoleResources(rrMap);
	}

	@Override
	public void deleteRoleResources(Map<String, String> rrMap) {
		resourcesDao.deleteRoleResources(rrMap);
	}

	@Override
	public List<Resources> getPermissions(String username) {
		return resourcesDao.getPermissions(username);
	}
}
