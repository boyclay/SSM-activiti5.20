package com.java.activiti.model;

import java.io.Serializable;

/**
 * �û���չʵ��
 * @author user
 *
 */
public class User implements Serializable {

	private static final long serialVersionUID = 5596438259170985095L;
	private String id; // ���� �û���
	private String firstName;  // ��
	private String lastName; // ��
	private String email; // ����
	private String password; // ����
	private String groups; // �û����еĽ�ɫ �����ɫ֮���ö��Ÿ���
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGroups() {
		return groups;
	}
	public void setGroups(String groups) {
		this.groups = groups;
	}
	
	
}
