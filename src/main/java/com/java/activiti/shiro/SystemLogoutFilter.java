package com.java.activiti.shiro;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.session.SessionException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.LogoutFilter;

public class SystemLogoutFilter extends LogoutFilter {

	@Override
	protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
		Subject subject = getSubject(request, response);
		String redirectUrl = getRedirectUrl(request, response, subject);
		try {
			// ��ջ���
			subject.logout();
		} catch (SessionException e) {
			e.printStackTrace();
		}
		issueRedirect(request, response, redirectUrl);
		return false;
	}
}
