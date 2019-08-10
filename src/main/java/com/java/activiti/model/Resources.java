package com.java.activiti.model;

import java.io.Serializable;

public class Resources implements Serializable {
	
	private static final long serialVersionUID = -6812242071705361506L;
	
	private Integer id;// 资源ID
	private String name;// 资源名称
	private String resurl;// 资源地址
	private Integer type;// 资源类型
	private Integer parentId;// 资源父ID
	private Integer sort;// 资源顺序
	private String isChecked;// 是否被选中

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