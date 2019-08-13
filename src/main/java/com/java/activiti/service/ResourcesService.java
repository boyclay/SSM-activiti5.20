package com.java.activiti.service;

import java.util.List;
import java.util.Map;

import com.java.activiti.model.Resources;

public interface ResourcesService {
	
	/**
	 * ��ҳ��ѯ
	 * 
	 * @param map
	 * @return
	 */
	 List<Resources> resourcesPage(Map<String, Object> map);

	/**
	 * ͳ������
	 * 
	 * @param map
	 * @return
	 */
	public int resourcesCount(Map<String, Object> map);

	/**
	 * ɾ����Դ
	 * 
	 * @param list
	 * @return
	 */
	public int deleteResources(List<String> list);

	/**
	 * �޸���Դ
	 * 
	 * @param resources
	 * @return
	 */
	public int updateResources(Resources resources);

	/**
	 * �����Դ
	 * 
	 * @param resources
	 * @return
	 */
	public int addResources(Resources resources);
	
	/**
	 * ��Դ���Ƿ����
	 * 
	 * @param resources
	 * @return
	 */
	public int existResourcesName(Resources resources);
	
	/**
	 * ��ȡ������Դ
	 * @param resources
	 * @return
	 */
	public List<Resources> getAllResources(String groupId);
	
	/**
	 * Ȩ����Դ��
	 * @param rrMap
	 * @return
	 */
	public void addRoleResources(Map<String,String>rrMap);
	
	/**
	 * Ȩ����Դɾ��
	 * @param rrMap
	 * @return
	 */
	public void deleteRoleResources(Map<String,String>rrMap);
	
	/**
	 * �����û�����ȡ��Դ�б�
	 * @param username
	 * @return
	 */
	public List<Resources> getPermissions(String username);
	
}
