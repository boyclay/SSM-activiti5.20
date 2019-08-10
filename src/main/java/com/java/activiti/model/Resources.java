package com.java.activiti.model;

import java.io.Serializable;

public class Resources implements Serializable {
	
	private static final long serialVersionUID = -6812242071705361506L;
	
	private Integer id;// ��ԴID
	private String name;// ��Դ����
	private String resurl;// ��Դ��ַ
	private Integer type;// ��Դ����
	private Integer parentId;// ��Դ��ID
	private Integer sort;// ��Դ˳��
	private String isChecked;// �Ƿ�ѡ��

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getResurl() {
		return resurl;
	}

	public void setResurl(String resurl) {
		this.resurl = resurl;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public String getIsChecked() {
		return isChecked;
	}

	public void setIsChecked(String isChecked) {
		this.isChecked = isChecked;
	}
}