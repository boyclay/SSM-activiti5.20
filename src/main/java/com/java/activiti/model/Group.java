package com.java.activiti.model;

import java.io.Serializable;

/**
 * ��ɫʵ����չ
 * @author user
 *
 */
public class Group implements Serializable {

	private static final long serialVersionUID = -9112390727793959763L;
	private String id; // ���� ��ɫ��
	private String name; // ����
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
