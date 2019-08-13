package com.java.activiti.service;

import java.util.List;
import java.util.Map;

import com.java.activiti.model.User;

public interface UserService {
	
	public User findById(String userId);
	/**
	 * ����
	 * @return
	 */
	public User userLogin(User user);
	
	/**'
	 * ��ҳ��ѯ�û�
	 * @param map
	 * @return
	 */
	public List<User> userPage(Map<String, Object> map);
	
	public int userCount(Map<String, Object> map);
	
	/**
	 * ����ɾ���û�
	 * @param id
	 * @return
	 */
	public int deleteUser(List<String> id);
	
	/**
	 * �޸��û�
	 * @param user
	 * @return
	 */
	public int updateUser(User user);
	
	/**
	 * �����û�
	 * @param user
	 * @return
	 */
	public int addUser(User user);
	
	/**
	 * �û�����У��
	 * @param user
	 * @return
	 */
	public int existUserName(User user);
	
	/**
	 * �û������޸�
	 * @param user
	 * @return
	 */
	public void modifyPassword(User user);
	
	/**
	 * �����ʼ�
	 * @param map
	 * @return
	 */
	public void sendMail(Map<String,String> map);
	
	/**
	 * ��ȡ���б���
	 * @param map
	 * @return
	 */
	public List<Map> getTableName();
}