package com.java.activiti.model;

import java.io.Serializable;

import javax.websocket.Session;

/**
 * @author ccq
 */
public class OnlineUser implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -4182185449070799385L;

	private String userid;

	private Session session;

	public OnlineUser() {
	}

	public OnlineUser(String userid, Session session) {
		this.userid = userid;
		this.session = session;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid == null ? null : userid.trim();
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}
}
